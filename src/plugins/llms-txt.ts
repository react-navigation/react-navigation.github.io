import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import type { LoadContext, Plugin } from '@docusaurus/types';
import versionsData from '../../versions.json';

type FrontMatterData = Record<string, string>;

type ParsedFrontMatter = {
  data: FrontMatterData;
  content: string;
};

type SidebarCategory = {
  type: 'category';
  label: string;
  items: SidebarItem[];
};

type SidebarItem = string | SidebarCategory | Record<string, unknown>;

type FullDoc = {
  title: string;
  url: string;
  content: string;
};

type LlmsTxtOptions = {
  latestVersion?: string;
};

type SidebarProcessResult = {
  content: string;
  docs: FullDoc[];
};

const versionsSource: unknown = versionsData;

const versions = Array.isArray(versionsSource)
  ? versionsSource.filter(
      (version): version is string => typeof version === 'string'
    )
  : [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOwnProperty<T extends object, K extends PropertyKey>(
  value: T,
  key: K
): value is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isSidebarItem(value: unknown): value is SidebarItem {
  return typeof value === 'string' || isRecord(value);
}

function isSidebarCategory(item: SidebarItem): item is SidebarCategory {
  if (!isRecord(item)) {
    return false;
  }

  if (
    !hasOwnProperty(item, 'type') ||
    !hasOwnProperty(item, 'label') ||
    !hasOwnProperty(item, 'items')
  ) {
    return false;
  }

  return (
    item.type === 'category' &&
    typeof item.label === 'string' &&
    Array.isArray(item.items)
  );
}

function normalizeRootItems(value: unknown): SidebarItem[] {
  if (Array.isArray(value)) {
    return value.filter(isSidebarItem);
  }

  if (isRecord(value)) {
    const normalized: SidebarCategory[] = [];

    for (const [label, items] of Object.entries(value)) {
      normalized.push({
        type: 'category',
        label,
        items: Array.isArray(items) ? items.filter(isSidebarItem) : [],
      });
    }

    return normalized;
  }

  return [];
}

/**
 * Parses frontmatter from markdown content.
 * Extracts metadata like title and description, and returns the cleaned content.
 *
 * @param {string} fileContent - Raw markdown file content.
 * @returns {{data: Object, content: string}} - Parsed data and stripped content.
 */
function parseFrontMatter(fileContent: string): ParsedFrontMatter {
  const frontMatterRegex = /^---\n([\s\S]+?)\n---\n/;
  const match = fileContent.match(frontMatterRegex);

  if (!match) {
    return { data: {}, content: fileContent };
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontMatterRegex, '');

  const data: FrontMatterData = {};

  frontMatterBlock.split('\n').forEach((line) => {
    const parts = line.split(':');

    if (parts.length >= 2) {
      const key = parts[0].trim();

      let value = parts.slice(1).join(':').trim();

      // Remove surrounding quotes if present
      if (
        (value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))
      ) {
        value = value.slice(1, -1);
      }

      data[key] = value;
    }
  });

  return { data, content };
}

/**
 * Recursively processes sidebar items to generate the LLM index and collect full docs.
 * Handles different sidebar structures (flat arrays, categories).
 *
 * @param {Array} items - Sidebar items to process.
 * @param {string} docsPath - Base path to documentation files.
 * @param {string} version - Current version being processed (e.g., '7.x').
 * @param {boolean} isLatest - Whether this is the latest/stable version.
 * @param {string} baseUrl - The base URL of the website.
 * @param {number} level - Current nesting level for headings.
 * @returns {{content: string, docs: Array}} - Generated index content and list of doc objects.
 */
function processSidebar(
  items: SidebarItem[],
  docsPath: string,
  version: string,
  isLatest: boolean,
  baseUrl: string,
  level = 0
): SidebarProcessResult {
  let llmsContent = '';
  let fullDocsList: FullDoc[] = [];

  items.forEach((item) => {
    // Case 1: Item is a direct link (string ID)
    if (typeof item === 'string') {
      const id = item;
      const filePath = path.join(docsPath, `${id}.md`);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = parseFrontMatter(fileContent);

        const title = data.title || id;
        const description = data.description || '';

        // Construct the public URL for the document
        // Latest version uses /docs/id, others use /docs/version/id
        const urlPath = isLatest ? `/docs/${id}` : `/docs/${version}/${id}`;
        const fullUrl = `${baseUrl}${urlPath}`;

        llmsContent += `- [${title}](${fullUrl})${
          description ? `: ${description}` : ''
        }\n`;

        fullDocsList.push({
          title,
          url: fullUrl,
          content,
        });
      }
    }
    // Case 2: Item is a category object
    else if (isSidebarCategory(item)) {
      const label = item.label;
      const headingPrefix = '#'.repeat(level + 3); // Start at level 3 (###)

      llmsContent += `\n${headingPrefix} ${label}\n\n`;

      const { content: childContent, docs: childDocs } = processSidebar(
        item.items,
        docsPath,
        version,
        isLatest,
        baseUrl,
        level + 1
      );

      llmsContent += childContent;
      fullDocsList = fullDocsList.concat(childDocs);
    }
  });

  return { content: llmsContent, docs: fullDocsList };
}

/**
 * Generates the llms.txt and llms-full.txt files for a specific version.
 *
 * @returns {Array<string>} - List of generated filenames.
 */
function generateForVersion(
  siteDir: string,
  outDir: string,
  version: string,
  outputPrefix: string,
  isLatest: boolean,
  baseUrl: string
): string[] {
  const docsPath = path.join(siteDir, 'versioned_docs', `version-${version}`);
  const sidebarPath = path.join(
    siteDir,
    'versioned_sidebars',
    `version-${version}-sidebars.json`
  );

  if (!fs.existsSync(sidebarPath)) {
    // Silent return if sidebar is missing to avoid noise
    return [];
  }

  const sidebarConfig: unknown = JSON.parse(
    fs.readFileSync(sidebarPath, 'utf8')
  );

  // Handle different Docusaurus sidebar structures (root 'docs' key or first key)
  const rootItemsSource = isRecord(sidebarConfig)
    ? hasOwnProperty(sidebarConfig, 'docs')
      ? sidebarConfig.docs
      : Object.values(sidebarConfig)[0]
    : undefined;

  const rootItems = normalizeRootItems(rootItemsSource);

  const { content: sidebarContent, docs } = processSidebar(
    rootItems,
    docsPath,
    version,
    isLatest,
    baseUrl
  );

  // 1. Generate Summary (llms.txt)
  let llmsTxt = `# React Navigation ${version}\n\n`;

  llmsTxt += `> Routing and navigation for your React Native apps.\n\n`;
  llmsTxt += `## Documentation\n`;
  llmsTxt += sidebarContent;

  const summaryFilename = `${outputPrefix}.txt`;

  fs.writeFileSync(path.join(outDir, summaryFilename), llmsTxt);

  // 2. Generate Full Content (llms-full.txt)
  let llmsFullTxt = `# React Navigation ${version} Documentation\n\n`;

  docs.forEach((doc) => {
    llmsFullTxt += `## ${doc.title}\n\n`;
    llmsFullTxt += `Source: ${doc.url}\n\n`;
    llmsFullTxt += `${doc.content.trim()}\n\n---\n\n`;
  });

  // Determine full filename (e.g., llms-v8.x -> llms-full-v8.x.txt)
  let fullFilename;

  if (outputPrefix === 'llms') {
    fullFilename = 'llms-full.txt';
  } else {
    if (outputPrefix.includes('llms-')) {
      fullFilename = outputPrefix.replace('llms-', 'llms-full-') + '.txt';
    } else {
      fullFilename = outputPrefix + '-full.txt';
    }
  }

  fs.writeFileSync(path.join(outDir, fullFilename), llmsFullTxt);

  return [summaryFilename, fullFilename];
}

export default function llmsTxtPlugin(
  context: LoadContext,
  options: LlmsTxtOptions
): Plugin {
  return {
    name: 'llms.txt',
    async postBuild({ siteDir, outDir }) {
      const { latestVersion } = options;
      const baseUrl = context.siteConfig.url;

      if (!latestVersion) {
        throw new Error('[llms.txt] "latestVersion" option is required.');
      }

      const generatedFiles = [];

      versions.forEach((version) => {
        const isLatest = version === latestVersion;
        // Prefix: 'llms' for latest, 'llms-vX.x' for others
        const outputPrefix = isLatest ? 'llms' : `llms-${version}`;

        const files = generateForVersion(
          siteDir,
          outDir,
          version,
          outputPrefix,
          isLatest,
          baseUrl
        );

        generatedFiles.push(...files);
      });

      console.log(
        `${util.styleText(['magenta', 'bold'], '[llms.txt]')} Wrote ${generatedFiles.length} files in build output.`
      );
    },
  };
}
