import type { LoadContext, Plugin } from '@docusaurus/types';

export default function disableFullySpecified(
  _context: LoadContext,
  _options: unknown
): Plugin {
  return {
    name: 'disable-fully-specified',
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.js$/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
      };
    },
  };
}
