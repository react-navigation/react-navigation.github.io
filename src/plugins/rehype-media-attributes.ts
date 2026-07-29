import ffprobe from '@ffprobe-installer/ffprobe';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const mediaDimensionsCache = new Map<string, Promise<MediaDimensions>>();
const maxEagerVideoBytes = 512 * 1024;

type MdxJsxAttribute = {
  type: 'mdxJsxAttribute';
  name: string;
  value?: string | MdxJsxAttributeValueExpression;
};

type MdxJsxAttributeValueExpression = {
  type: 'mdxJsxAttributeValueExpression';
  data?: {
    estree?: {
      body?: Array<{
        expression?: {
          properties?: unknown[];
        };
      }>;
    };
  };
};

type MdxJsxFlowElement = {
  type: 'mdxJsxFlowElement';
  name?: string;
  attributes?: MdxJsxAttribute[];
  children?: MdxJsxFlowElement[];
};

type VFileLike = {
  cwd: string;
  dirname: string;
};

type MediaDimensions = {
  width?: number;
  height?: number;
};

type StyleEstreeData = {
  estree: {
    type: 'Program';
    body: Array<{
      type: 'ExpressionStatement';
      expression: {
        type: 'ObjectExpression';
        properties: unknown[];
      };
    }>;
  };
};

function isAttributeValueExpression(
  value: MdxJsxAttribute['value']
): value is MdxJsxAttributeValueExpression {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'mdxJsxAttributeValueExpression'
  );
}

export default function rehypeMediaAttributes({
  staticDir,
}: {
  staticDir: string;
}) {
  return async (tree: Node, file: VFileLike) => {
    const promises: Promise<void>[] = [];
    const eagerVideos = new Set<MdxJsxFlowElement>();

    let eagerVideoBytes = 0;
    let eagerVideoBudgetExceeded = false;
    let foundFeatureGrid = false;

    visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
      if (foundFeatureGrid || node.name !== 'div') {
        return;
      }

      const className = node.attributes?.find(
        (attribute) =>
          attribute.type === 'mdxJsxAttribute' && attribute.name === 'className'
      )?.value;

      if (
        typeof className !== 'string' ||
        !className.split(/\s+/).includes('feature-grid')
      ) {
        return;
      }

      foundFeatureGrid = true;

      visit(node, 'mdxJsxFlowElement', (child: MdxJsxFlowElement) => {
        if (child.name !== 'video' || eagerVideoBudgetExceeded) {
          return;
        }

        const mediaSrc = getMediaSource(child);

        if (!mediaSrc || !isLocalMediaSource(mediaSrc)) {
          return;
        }

        const mediaPath = getMediaPath(mediaSrc, file, staticDir);

        if (!fs.existsSync(mediaPath)) {
          return;
        }

        const mediaSize = fs.statSync(mediaPath).size;

        if (eagerVideoBytes + mediaSize > maxEagerVideoBytes) {
          eagerVideoBudgetExceeded = true;

          return;
        }

        eagerVideos.add(child);
        eagerVideoBytes += mediaSize;
      });
    });

    visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
      if (node.name === 'video' || node.name === 'img') {
        const mediaSrc = getMediaSource(node);
        const isLocalFile = mediaSrc && isLocalMediaSource(mediaSrc);

        if (isLocalFile) {
          const mediaPath = getMediaPath(mediaSrc, file, staticDir);

          if (fs.existsSync(mediaPath)) {
            const promise = getMediaDimensions(mediaPath).then((dimensions) => {
              if (dimensions.width && dimensions.height) {
                setAttribute(node, 'width', String(dimensions.width));
                setAttribute(node, 'height', String(dimensions.height));

                if (node.name === 'video') {
                  applyAspectRatio(node, dimensions.width, dimensions.height);
                }
              }
            });

            promises.push(promise);
          } else {
            throw new Error(`Media file does not exist (got ${mediaPath})`);
          }
        }

        if (node.name === 'img') {
          setAttribute(node, 'loading', 'lazy');
          setAttribute(node, 'decoding', 'async');
        } else {
          const autoPlay = node.attributes?.some(
            (attribute) =>
              attribute.type === 'mdxJsxAttribute' &&
              attribute.name === 'autoPlay'
          );

          node.attributes = node.attributes?.filter(
            (attribute) =>
              attribute.type !== 'mdxJsxAttribute' ||
              attribute.name !== 'autoPlay'
          );

          setAttribute(
            node,
            'preload',
            eagerVideos.has(node) ? 'auto' : 'none'
          );

          if (mediaSrc) {
            setAttribute(node, 'data-label', getMediaLabel(mediaSrc));
          }

          if (autoPlay) {
            setAttribute(node, 'data-auto-play', 'true');
          }
        }
      }
    });

    await Promise.all(promises);
  };
}

function getMediaSource(node: MdxJsxFlowElement) {
  const src = node.attributes?.find(
    (attribute) =>
      attribute.type === 'mdxJsxAttribute' && attribute.name === 'src'
  )?.value;

  if (typeof src === 'string') {
    return src;
  }

  const source = node.children?.find(
    (child) => child.type === 'mdxJsxFlowElement' && child.name === 'source'
  );

  const sourceSrc = source?.attributes?.find(
    (attribute) =>
      attribute.type === 'mdxJsxAttribute' && attribute.name === 'src'
  )?.value;

  return typeof sourceSrc === 'string' ? sourceSrc : null;
}

function isLocalMediaSource(mediaSrc: string) {
  return (
    !mediaSrc.startsWith('http://') &&
    !mediaSrc.startsWith('https://') &&
    !mediaSrc.startsWith('//')
  );
}

function getMediaPath(mediaSrc: string, file: VFileLike, staticDir: string) {
  return path.join(
    mediaSrc.startsWith('/') ? file.cwd : file.dirname,
    staticDir,
    mediaSrc
  );
}

function getMediaLabel(mediaSrc: string) {
  const filename = path.basename(
    mediaSrc.split(/[?#]/)[0],
    path.extname(mediaSrc.split(/[?#]/)[0])
  );
  const label = filename.replace(/[-_]+/g, ' ');

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function setAttribute(node: MdxJsxFlowElement, name: string, value: string) {
  const attribute: MdxJsxAttribute = {
    type: 'mdxJsxAttribute',
    name,
    value,
  };

  node.attributes = node.attributes || [];

  const existingIndex = node.attributes.findIndex(
    (item) => item.type === 'mdxJsxAttribute' && item.name === name
  );

  if (existingIndex === -1) {
    node.attributes.push(attribute);
  } else {
    node.attributes[existingIndex] = attribute;
  }
}

function applyAspectRatio(
  node: MdxJsxFlowElement,
  width: number,
  height: number
) {
  const data: StyleEstreeData = {
    estree: {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: { type: 'Identifier', name: 'aspectRatio' },
                value: { type: 'Literal', value: width / height },
                kind: 'init',
              },
            ],
          },
        },
      ],
    },
  };

  node.attributes = node.attributes || [];

  let styleAttr = node.attributes?.find(
    (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'style'
  );

  if (styleAttr && isAttributeValueExpression(styleAttr.value)) {
    const properties =
      styleAttr.value.data?.estree?.body?.[0]?.expression?.properties;

    if (Array.isArray(properties)) {
      data.estree.body[0].expression.properties.push(...properties);
    }
  }

  styleAttr = {
    type: 'mdxJsxAttribute',
    name: 'style',
    value: {
      type: 'mdxJsxAttributeValueExpression',
      data,
    },
  };

  const existingIndex = node.attributes.findIndex(
    (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'style'
  );

  if (existingIndex !== -1) {
    node.attributes[existingIndex] = styleAttr;
  } else {
    node.attributes.push(styleAttr);
  }
}

async function getMediaDimensions(filePath: string) {
  const cached = mediaDimensionsCache.get(filePath);

  if (cached) {
    return cached;
  }

  const dimensions = probeMediaDimensions(filePath);

  mediaDimensionsCache.set(filePath, dimensions);

  return dimensions;
}

async function probeMediaDimensions(filePath: string) {
  const { stdout } = await execFileAsync(ffprobe.path, [
    '-v',
    'error',
    '-of',
    'flat=s=_',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=height,width',
    filePath,
  ]);

  const lines = stdout.trim().split('\n');
  const dimensions: MediaDimensions = {};

  for (const line of lines) {
    if (line.includes('width')) {
      const width = Number(line.split('=')[1]);

      if (Number.isFinite(width) && width > 0) {
        dimensions.width = width;
      }
    } else if (line.includes('height')) {
      const height = Number(line.split('=')[1]);

      if (Number.isFinite(height) && height > 0) {
        dimensions.height = height;
      }
    }
  }

  return dimensions;
}
