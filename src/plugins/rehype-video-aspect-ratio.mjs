import ffprobe from '@ffprobe-installer/ffprobe';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { visit } from 'unist-util-visit';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Rehype plugin to add aspect ratio preservation to video tags
 */
export default function rehypeVideoAspectRatio({ staticDir }) {
  return async (tree, file) => {
    const promises = [];

    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'video') {
        // Find video source - check src attribute or source children
        let videoSrc = null;

        // Look for src in attributes
        if (node.attributes) {
          const srcAttr = node.attributes.find(
            (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'src'
          );

          if (srcAttr) {
            videoSrc = srcAttr.value;
          }
        }

        // If no src attribute, look for source children
        if (!videoSrc && node.children) {
          const sourceNode = node.children.find(
            (child) =>
              child.type === 'mdxJsxFlowElement' && child.name === 'source'
          );

          if (sourceNode?.attributes) {
            const srcAttr = sourceNode.attributes.find(
              (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'src'
            );

            if (srcAttr) {
              videoSrc = srcAttr.value;
            }
          }
        }

        const isLocalFile =
          videoSrc &&
          !videoSrc.startsWith('http://') &&
          !videoSrc.startsWith('https://') &&
          !videoSrc.startsWith('//');

        if (isLocalFile) {
          const videoPath = path.join(
            videoSrc.startsWith('/') ? file.cwd : file.dirname,
            staticDir,
            videoSrc
          );

          if (fs.existsSync(videoPath)) {
            const promise = getVideoDimensions(videoPath).then((dimensions) => {
              if (dimensions.width && dimensions.height) {
                applyAspectRatio(node, dimensions.width, dimensions.height);
              }
            });

            promises.push(promise);
          } else {
            throw new Error(`Video file does not exist (got ${videoPath})`);
          }
        }
      }
    });

    await Promise.all(promises);
  };
}

/**
 * Apply aspect ratio styles to a video node
 */
function applyAspectRatio(node, width, height) {
  const data = {
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

  if (styleAttr) {
    const properties =
      styleAttr.value?.data?.estree?.body?.[0]?.expression?.properties ?? [];

    data.estree.body[0].expression.properties.push(...properties);
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

/**
 * Get video dimensions using ffprobe
 */
async function getVideoDimensions(filePath) {
  const { stdout } = await execAsync(
    `${ffprobe.path} -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width "${filePath}"`
  );

  const lines = stdout.trim().split('\n');
  const dimensions = {};

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
