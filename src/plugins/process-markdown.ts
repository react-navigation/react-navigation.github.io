import { convertStaticToDynamic } from './rehype-static-to-dynamic.ts';

type TabItem = {
  label: string;
  content: string;
};

type TabsBlock = {
  start: number;
  end: number;
  items: TabItem[];
};

type FrontMatterData = Record<string, string>;

export type ProcessedMarkdown = {
  frontmatter: FrontMatterData;
  content: string;
};

/**
 * Parse frontmatter and process raw MDX markdown into clean, LLM-friendly markdown.
 *
 * - Parses and strips YAML frontmatter
 * - Strips MDX import statements
 * - Transforms <Tabs>/<TabItem> into labeled sections
 * - Converts static2dynamic code fences into static + dynamic sections
 * - Strips code fence meta attributes (snack, name, static2dynamic, npm2yarn, etc.)
 * - Converts Docusaurus admonitions (:::note, :::warning, etc.) to blockquotes
 * - Converts HTML <img> tags to markdown image syntax
 * - Converts HTML <video> tags to plain video URLs
 * - Strips decorative HTML divs (device-frame, image-grid, feature-grid, etc.)
 * - Cleans up extra blank lines
 */
export async function processMarkdown(
  rawContent: string
): Promise<ProcessedMarkdown> {
  const { data: frontmatter, content: contentWithoutFrontmatter } =
    parseFrontmatter(rawContent);

  let result = contentWithoutFrontmatter;

  // Strip MDX import statements
  result = stripImports(result);

  // Transform <Tabs>/<TabItem> blocks (handles nesting)
  result = transformTabs(result);

  // Transform static2dynamic code fences
  result = await transformStatic2Dynamic(result);

  // Strip code fence meta attributes
  result = stripCodeFenceMeta(result);

  // Convert admonitions to blockquotes
  result = convertAdmonitions(result);

  // Convert HTML media tags and strip decorative divs,
  // protecting code fences from modification
  result = withProtectedCodeFences(result, (text) => {
    text = convertImageTags(text);
    text = convertVideoTags(text);
    text = stripDecorativeDivs(text);
    return text;
  });

  // Clean up extra blank lines (max 2 consecutive)
  result = result.replace(/\n{3,}/g, '\n\n');

  return { frontmatter, content: result.trim() };
}

type BuildDocumentOptions = {
  title?: string;
  version?: string;
  sitemapUrl?: string;
  sitemapLabel?: string;
};

/**
 * Build a complete markdown document with header metadata.
 */
export function buildMarkdownDocument(
  processedContent: string,
  options: BuildDocumentOptions = {}
): string {
  const { title, version, sitemapUrl, sitemapLabel } = options;
  const parts: string[] = [];

  if (title) {
    parts.push(`# ${title}`);
  }

  if (version) {
    parts.push(`Version: ${version}`);
  }

  if (sitemapUrl && sitemapLabel) {
    parts.push(`Sitemap: [${sitemapLabel}](${sitemapUrl})`);
  }

  parts.push(processedContent);

  return parts.join('\n\n');
}

/**
 * Parse YAML frontmatter block and return data + content without frontmatter.
 */
export function parseFrontmatter(fileContent: string): {
  data: FrontMatterData;
  content: string;
} {
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
 * Remove MDX import lines (e.g. `import Tabs from '@theme/Tabs'`)
 */
function stripImports(content: string): string {
  return (
    content
      // Single-line: import X from 'y'
      .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
      // Multi-line: import { ... } from 'y'
      .replace(/^import\s*\{[^}]*\}\s*from\s*['"].*?['"];?\s*$/gm, '')
  );
}

/**
 * Transform all <Tabs>/<TabItem> blocks into plain markdown sections.
 * Handles nested tabs by processing innermost first.
 */
function transformTabs(content: string): string {
  // Process repeatedly until no more <Tabs> blocks remain
  // (handles nesting by resolving innermost first)
  let result = content;
  let iterations = 0;
  const maxIterations = 20;

  while (result.includes('<Tabs') && iterations < maxIterations) {
    const block = findInnermostTabsBlock(result);

    if (!block) {
      break;
    }

    const replacement = renderTabsAsMarkdown(block.items);
    result =
      result.slice(0, block.start) + replacement + result.slice(block.end);

    iterations++;
  }

  return result;
}

/**
 * Find the innermost (most deeply nested) <Tabs> block.
 * This ensures nested tabs are resolved before their parents.
 */
function findInnermostTabsBlock(content: string): TabsBlock | null {
  // Find all <Tabs opening positions
  const tabsOpenRegex = /<Tabs[^>]*>/g;
  let lastInnermost: { openStart: number; openEnd: number } | null = null;
  let match: RegExpExecArray | null;

  while ((match = tabsOpenRegex.exec(content)) !== null) {
    const openStart = match.index;
    const openEnd = openStart + match[0].length;

    // Check if there's another <Tabs before the closing </Tabs>
    const closingPos = content.indexOf('</Tabs>', openEnd);

    if (closingPos === -1) {
      continue;
    }

    const between = content.slice(openEnd, closingPos);

    // If no nested <Tabs inside, this is an innermost block
    if (!between.includes('<Tabs')) {
      lastInnermost = { openStart, openEnd };
      break;
    }
  }

  if (!lastInnermost) {
    return null;
  }

  const { openStart, openEnd } = lastInnermost;
  const closingTag = '</Tabs>';
  const closingPos = content.indexOf(closingTag, openEnd);

  if (closingPos === -1) {
    return null;
  }

  const innerContent = content.slice(openEnd, closingPos);
  const items = parseTabItems(innerContent);

  return {
    start: openStart,
    end: closingPos + closingTag.length,
    items,
  };
}

/**
 * Parse <TabItem> elements from the inner content of a <Tabs> block.
 */
function parseTabItems(content: string): TabItem[] {
  const items: TabItem[] = [];
  const tabItemRegex =
    /<TabItem\s+[^>]*label=['"]([^'"]+)['"][^>]*>([\s\S]*?)(?=<\/TabItem>)/g;

  let match: RegExpExecArray | null;

  while ((match = tabItemRegex.exec(content)) !== null) {
    items.push({
      label: match[1],
      content: match[2].trim(),
    });
  }

  // If regex didn't match (e.g. label comes after value), try alternative order
  if (items.length === 0) {
    const altRegex =
      /<TabItem\s+[^>]*?(?:label=['"]([^'"]+)['"]|value=['"]([^'"]+)['"])[^>]*>([\s\S]*?)(?=<\/TabItem>)/g;

    while ((match = altRegex.exec(content)) !== null) {
      const label = match[1] || match[2] || 'Tab';
      items.push({
        label,
        content: match[3].trim(),
      });
    }
  }

  return items;
}

/**
 * Render parsed tab items as plain markdown with bold labels.
 */
function renderTabsAsMarkdown(items: TabItem[]): string {
  if (items.length === 0) {
    return '';
  }

  // If only one tab, just render its content without label
  if (items.length === 1) {
    return items[0].content;
  }

  return items
    .map((item) => `**${item.label}:**\n\n${item.content}`)
    .join('\n\n');
}

/**
 * Find and transform code fences with `static2dynamic` in their meta.
 * Generates both static and dynamic versions.
 */
async function transformStatic2Dynamic(content: string): Promise<string> {
  // Match code fences with static2dynamic in meta
  const fenceRegex =
    /^(```\w*)\s+([^\n]*static2dynamic[^\n]*)\n([\s\S]*?)^```$/gm;
  const matches: {
    fullMatch: string;
    lang: string;
    meta: string;
    code: string;
  }[] = [];

  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      lang: match[1].replace('```', ''),
      meta: match[2],
      code: match[3],
    });
  }

  // Process all static2dynamic blocks in parallel
  const conversions = await Promise.all(
    matches.map(async (m) => {
      try {
        const dynamicCode = await convertStaticToDynamic(m.code);
        const cleanMeta = cleanCodeFenceMeta(m.meta);
        const langTag = m.lang || 'js';
        const metaSuffix = cleanMeta ? ` ${cleanMeta}` : '';

        const staticSection = `**Static:**\n\n\`\`\`${langTag}${metaSuffix}\n${m.code}\`\`\``;
        const dynamicSection = `**Dynamic:**\n\n\`\`\`${langTag}${metaSuffix}\n${dynamicCode}\n\`\`\``;

        return {
          original: m.fullMatch,
          replacement: `${staticSection}\n\n${dynamicSection}`,
        };
      } catch {
        // If conversion fails, keep the original code without static2dynamic meta
        const cleanMeta = cleanCodeFenceMeta(m.meta);
        const metaSuffix = cleanMeta ? ` ${cleanMeta}` : '';

        return {
          original: m.fullMatch,
          replacement: `\`\`\`${m.lang}${metaSuffix}\n${m.code}\`\`\``,
        };
      }
    })
  );

  let result = content;

  for (const { original, replacement } of conversions) {
    result = result.replace(original, replacement);
  }

  return result;
}

/**
 * Clean code fence meta by removing MDX-specific attributes.
 * Removes: static2dynamic, snack, npm2yarn, name="...", dependencies="..."
 */
function cleanCodeFenceMeta(meta: string): string {
  return meta
    .replace(/\bstatic2dynamic\b/g, '')
    .replace(/\bsnack\b/g, '')
    .replace(/\bnpm2yarn\b/g, '')
    .replace(/\bname=["'][^"']*["']/g, '')
    .replace(/\bdependencies=["'][^"']*["']/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Strip meta attributes from all code fences (not just static2dynamic ones).
 */
function stripCodeFenceMeta(content: string): string {
  return content.replace(
    /^(```\w*)[ \t]+([^\n]*?)$/gm,
    (_match, lang: string, meta: string) => {
      const cleaned = cleanCodeFenceMeta(meta);
      return cleaned ? `${lang} ${cleaned}` : lang;
    }
  );
}

/**
 * Run a transform function on content while protecting code fences.
 * Temporarily replaces code fences with placeholders, runs the transform,
 * then restores the original code fences.
 */
function withProtectedCodeFences(
  content: string,
  transform: (text: string) => string
): string {
  const fences: string[] = [];

  const placeholder = (i: number) => `\x00CODEFENCE${i}\x00`;

  const protected_ = content.replace(/^```[^\n]*\n[\s\S]*?^```$/gm, (match) => {
    fences.push(match);
    return placeholder(fences.length - 1);
  });

  const transformed = transform(protected_);

  return transformed.replace(/\x00CODEFENCE(\d+)\x00/g, (_match, i) => {
    return fences[Number(i)];
  });
}

/**
 * Convert HTML <img> tags to markdown image syntax.
 * Strips inline styles and other attributes, keeping only src and alt.
 */
function convertImageTags(content: string): string {
  return content.replace(/<img\s+([^>]*?)\/?>/gi, (match, attrs: string) => {
    const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/);

    if (!srcMatch) {
      return match;
    }

    const src = srcMatch[1];
    const altMatch = attrs.match(/\balt=["']([^"']*)["']/);
    const alt = altMatch ? altMatch[1] : '';

    return `![${alt}](${src})`;
  });
}

/**
 * Convert HTML <video> tags to plain video source URLs.
 */
function convertVideoTags(content: string): string {
  return content.replace(
    /<video[^>]*>[\s\S]*?<source\s+src=["']([^"']+)["'][^>]*\/?>[\s\S]*?<\/video>/gi,
    (_match, src: string) => src
  );
}

/**
 * Strip decorative HTML divs, keeping their inner content.
 * Processes innermost divs first to handle nesting.
 */
function stripDecorativeDivs(content: string): string {
  let result = content;
  let iterations = 0;
  const maxIterations = 50;

  while (/<div[\s>]/i.test(result) && iterations < maxIterations) {
    const transformed = stripInnermostDiv(result);

    if (transformed === result) {
      break;
    }

    result = transformed;
    iterations++;
  }

  return result;
}

/**
 * Find and strip the first innermost <div> (one with no nested divs).
 * Returns original content if no strippable div is found.
 */
function stripInnermostDiv(content: string): string {
  const divOpenRegex = /<div[\s>][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = divOpenRegex.exec(content)) !== null) {
    const openStart = match.index;
    const openEnd = openStart + match[0].length;

    let depth = 1;
    let pos = openEnd;
    let closingStart = -1;

    while (pos < content.length && depth > 0) {
      const nextOpen = content.indexOf('<div', pos);
      const nextClose = content.indexOf('</div>', pos);

      if (nextClose === -1) {
        break;
      }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + 4;
      } else {
        depth--;

        if (depth === 0) {
          closingStart = nextClose;
        }

        pos = nextClose + 6;
      }
    }

    if (closingStart === -1) {
      continue;
    }

    const innerContent = content.slice(openEnd, closingStart).trim();
    const closingEnd = closingStart + '</div>'.length;

    if (!innerContent.includes('<div')) {
      return (
        content.slice(0, openStart) + innerContent + content.slice(closingEnd)
      );
    }
  }

  return content;
}

/**
 * Convert Docusaurus admonitions (:::note, :::warning, etc.) to blockquotes.
 *
 * :::warning          >  > **Warning:**
 * Content here   =>   >  > Content here
 * ::::               >
 */
function convertAdmonitions(content: string): string {
  return content.replace(
    /^:::(\w+)\s*\n([\s\S]*?)^:::+\s*$/gm,
    (_match, type: string, body: string) => {
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      const trimmedBody = body.trim();
      const quoted = trimmedBody
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');

      return `> **${label}:**\n>\n${quoted}`;
    }
  );
}
