export default function disableFullySpecified(context, options) {
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
