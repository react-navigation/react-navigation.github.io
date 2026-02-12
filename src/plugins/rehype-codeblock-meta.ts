import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

type MatchMap = Record<string, string | boolean>;

type RehypeCodeblockMetaOptions = {
  match: MatchMap;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOwnProperty<T extends object, K extends PropertyKey>(
  value: T,
  key: K
): value is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function getMeta(data: Element['data'] | undefined): string | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  if (!hasOwnProperty(data, 'meta')) {
    return undefined;
  }

  return typeof data.meta === 'string' ? data.meta : undefined;
}

/**
 * Plugin to process codeblock meta
 *
 * @param {{ match: { [key: string]: string }, element: JSX.ElementType }} options
 */
export default function rehypeCodeblockMeta(
  options: RehypeCodeblockMetaOptions
) {
  if (!options?.match) {
    throw new Error('rehype-codeblock-meta: `match` option is required');
  }

  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'pre' &&
        node.children?.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeblock = node.children[0];
        const meta = getMeta(codeblock.data);

        if (meta) {
          let segments: string[] = [];

          // Walk through meta string and split it into segments based on space unless it's inside quotes
          for (let i = 0; i < meta.length; i++) {
            let segment = '';
            let quote = false;

            for (; i < meta.length; i++) {
              if (meta[i] === '"') {
                quote = !quote;
              } else if (meta[i] === ' ' && !quote) {
                break;
              }

              segment += meta[i];
            }

            segments.push(segment);
          }

          const attributes = segments.reduce<Record<string, string>>(
            (acc, attribute) => {
              const [key, value = 'true'] = attribute.split('=');

              return Object.assign(acc, {
                [`data-${key}`]: value.replace(/^"(.+(?="$))"$/, '$1'),
              });
            },
            {}
          );

          if (
            Object.entries(options.match).some(([key, value]) => {
              if (value === true) {
                return attributes[`data-${key}`];
              } else {
                return attributes[`data-${key}`] === value;
              }
            })
          ) {
            Object.assign(node.properties, attributes);
          }
        }
      }
    });
  };
}
