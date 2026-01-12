import { visit } from 'unist-util-visit';

/**
 * Plugin to process codeblock meta
 *
 * @param {{ match: { [key: string]: string }, element: JSX.ElementType }} options
 */
export default function rehypeCodeblockMeta(options) {
  if (!options?.match) {
    throw new Error('rehype-codeblock-meta: `match` option is required');
  }

  return (tree) => {
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'pre' &&
        node.children?.length === 1 &&
        node.children[0].tagName === 'code'
      ) {
        const codeblock = node.children[0];
        const meta = codeblock.data?.meta;

        if (meta) {
          let segments = [];

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

          const attributes = segments.reduce((acc, attribute) => {
            const [key, value = 'true'] = attribute.split('=');

            return Object.assign(acc, {
              [`data-${key}`]: value.replace(/^"(.+(?="$))"$/, '$1'),
            });
          }, {});

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
