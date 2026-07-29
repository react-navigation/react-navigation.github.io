import type { Plugin } from '@docusaurus/types';

const globalCssExceptVideoPlayer = /^(?!.*video-playback\.module\.css)/;

export default function codeSplitVideoCss(): Plugin {
  return {
    name: 'code-split-video-css',

    configureWebpack(_config, isServer) {
      if (isServer) {
        return {};
      }

      return {
        optimization: {
          splitChunks: {
            cacheGroups: {
              styles: {
                test: globalCssExceptVideoPlayer,
              },
            },
          },
        },
      };
    },
  };
}
