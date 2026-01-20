import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import versions from '../../versions.json';

/**
 * Parses frontmatter from markdown content.
 * Extracts metadata like title and description, and returns the cleaned content.
 *
 * @param {string} fileContent - Raw markdown file content.
 * @returns {{data: Object, content: string}} - Parsed data and stripped content.
 */
function parseFrontMatter(fileContent) {
  const frontMatterRegex = /^---\n([\s\S]+?)\n---\n/;
  const match = fileContent.match(frontMatterRegex);

  if (!match) {
    return { data: {}, content: fileContent };
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontMatterRegex, '');

  const data = {};

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
  items,
  docsPath,
  version,
  isLatest,
  baseUrl,
  level = 0
) {
  let llmsContent = '';
  let fullDocsList = [];

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
    else if (item.type === 'category') {
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
  siteDir,
  outDir,
  version,
  outputPrefix,
  isLatest,
  baseUrl
) {
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

  const sidebarConfig = JSON.parse(fs.readFileSync(sidebarPath, 'utf8'));

  // Handle different Docusaurus sidebar structures (root 'docs' key or first key)
  let rootItems = sidebarConfig.docs || Object.values(sidebarConfig)[0] || [];

  // Normalize object-style sidebars (older Docusaurus versions) to array format
  if (!Array.isArray(rootItems) && typeof rootItems === 'object') {
    const normalized = [];

    for (const [label, items] of Object.entries(rootItems)) {
      normalized.push({
        type: 'category',
        label: label,
        items: items,
      });
    }

    rootItems = normalized;
  }

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

export default function (context, options) {
  return {
    name: 'llms.txt',
    async postBuild({ siteDir, outDir }) {
      const { latestVersion, baseUrl } = options;

      if (!latestVersion) {
        throw new Error('[llms.txt] "latestVersion" option is required.');
      }

      if (!baseUrl) {
        throw new Error('[llms.txt] "baseUrl" option is required.');
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
