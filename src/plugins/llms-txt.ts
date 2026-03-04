import type { LoadContext, Plugin } from '@docusaurus/types';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import versionsData from '../../versions.json';
import {
  buildMarkdownDocument,
  parseFrontmatter,
  processMarkdown,
} from './process-markdown.ts';

type SidebarCategory = {
  type: 'category';
  label: string;
  items: SidebarItem[];
};

type SidebarItem = string | SidebarCategory | Record<string, unknown>;

type FullDoc = {
  id: string;
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
        const { data, content } = parseFrontmatter(fileContent);

        const title = data.title || id;
        const description = data.description || '';

        // Construct the public URL for the document
        // Latest version uses /docs/id, others use /docs/version/id
        const urlPath = isLatest ? `/docs/${id}` : `/docs/${version}/${id}`;
        const fullUrl = `${baseUrl}${urlPath}`;
        const mdUrl = `${fullUrl}.md`;

        llmsContent += `- [${title}](${mdUrl})${
          description ? `: ${description}` : ''
        }\n`;

        fullDocsList.push({
          id,
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
 * Generates the llms.txt, llms-full.txt, and individual .md files for a specific version.
 *
 * @returns {Array<string>} - List of generated filenames.
 */
async function generateForVersion(
  siteDir: string,
  outDir: string,
  version: string,
  outputPrefix: string,
  isLatest: boolean,
  baseUrl: string
): Promise<string[]> {
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

  // The llms.txt URL for this version (used as sitemap link in .md files)
  const llmsTxtUrl = `${baseUrl}/${summaryFilename}`;

  // 2. Process all docs in parallel
  const processedDocs = await Promise.all(
    docs.map(async (doc) => {
      const { content: processedContent } = await processMarkdown(doc.content);
      return { ...doc, processedContent };
    })
  );

  // 3. Generate Full Content (llms-full.txt)
  let llmsFullTxt = '';

  processedDocs.forEach((doc) => {
    llmsFullTxt += `# ${doc.title}\n\n`;
    llmsFullTxt += `Source: ${doc.url}.md\n\n`;
    llmsFullTxt += `${doc.processedContent}\n\n---\n\n`;
  });

  const fullFilename = isLatest ? 'llms-full.txt' : `llms-full-${version}.txt`;

  fs.writeFileSync(path.join(outDir, fullFilename), llmsFullTxt);

  // 4. Generate individual .md files for each doc
  const mdFiles = processedDocs.map((doc) => {
    const urlPath = isLatest ? `/docs/${doc.id}` : `/docs/${version}/${doc.id}`;

    const mdFilePath = path.join(outDir, `${urlPath}.md`);
    const mdDir = path.dirname(mdFilePath);

    fs.mkdirSync(mdDir, { recursive: true });

    const mdContent = buildMarkdownDocument(doc.processedContent, {
      title: doc.title,
      version,
      sitemapUrl: llmsTxtUrl,
      sitemapLabel: summaryFilename,
    });

    fs.writeFileSync(mdFilePath, mdContent + '\n');

    return `${urlPath}.md`;
  });

  return [summaryFilename, fullFilename, ...mdFiles];
}

async function serveMarkdown(
  siteDir: string,
  baseUrl: string,
  latestVersion: string,
  reqPath: string
): Promise<string | null> {
  // Parse URL: /docs/[version/]<id>.md
  const match = reqPath.match(/^\/docs\/(.+)\.md$/);

  if (!match) {
    return null;
  }

  const pathPart = match[1];

  // Check if first segment is a known version
  let version = latestVersion;
  let docId = pathPart;

  const firstSlash = pathPart.indexOf('/');

  if (firstSlash !== -1) {
    const possibleVersion = pathPart.substring(0, firstSlash);

    if (versions.includes(possibleVersion)) {
      version = possibleVersion;
      docId = pathPart.substring(firstSlash + 1);
    }
  }

  const docsPath = path.join(siteDir, 'versioned_docs', `version-${version}`);
  const filePath = path.join(docsPath, `${docId}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, content } = await processMarkdown(fileContent);

  const isLatest = version === latestVersion;
  const summaryFilename = isLatest ? 'llms.txt' : `llms-${version}.txt`;
  const llmsTxtUrl = `${baseUrl}/${summaryFilename}`;

  return (
    buildMarkdownDocument(content, {
      title: frontmatter.title || docId,
      version,
      sitemapUrl: llmsTxtUrl,
      sitemapLabel: summaryFilename,
    }) + '\n'
  );
}

export default function llmsTxtPlugin(
  context: LoadContext,
  options: LlmsTxtOptions
): Plugin {
  return {
    name: 'llms.txt',

    configureWebpack() {
      const { latestVersion } = options;

      if (!latestVersion) {
        return {};
      }

      return {
        devServer: {
          setupMiddlewares(middlewares: unknown[]) {
            middlewares.unshift({
              name: 'llms-txt',
              middleware: (
                req: { originalUrl: string },
                res: {
                  type: (t: string) => void;
                  status: (s: number) => typeof res;
                  send: (b: string) => void;
                  end: () => void;
                },
                next: () => void
              ) => {
                serveMarkdown(
                  context.siteDir,
                  context.siteConfig.url,
                  latestVersion,
                  req.originalUrl
                )
                  .then((content) => {
                    if (content) {
                      res.type('text/markdown');
                      res.send(content);
                    } else {
                      next();
                    }
                  })
                  .catch(() => {
                    res.status(500).end();
                  });
              },
            });

            return middlewares;
          },
        },
      } as Record<string, unknown>;
    },

    async postBuild({ siteDir, outDir }) {
      const { latestVersion } = options;
      const baseUrl = context.siteConfig.url;

      if (!latestVersion) {
        throw new Error('[llms.txt] "latestVersion" option is required.');
      }

      const generatedFiles: string[] = [];

      for (const version of versions) {
        const isLatest = version === latestVersion;
        // Prefix: 'llms' for latest, 'llms-vX.x' for others
        const outputPrefix = isLatest ? 'llms' : `llms-${version}`;

        const files = await generateForVersion(
          siteDir,
          outDir,
          version,
          outputPrefix,
          isLatest,
          baseUrl
        );

        generatedFiles.push(...files);
      }

      console.log(
        `${util.styleText(['magenta', 'bold'], '[llms.txt]')} Wrote ${generatedFiles.length} files in build output.`
      );
    },
  };
}
