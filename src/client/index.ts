import type { ClientModule } from '@docusaurus/types';

let helpers:
  | Promise<
      [
        typeof import('./snack-helpers.ts'),
        typeof import('./toc-fixes.ts'),
        typeof import('./video-playback.ts'),
      ]
    >
  | undefined;

const loadHelpers = () => {
  helpers ??= Promise.all([
    import('./snack-helpers.ts'),
    import('./toc-fixes.ts'),
    import('./video-playback.ts'),
  ]);

  return helpers;
};

const clientModule: ClientModule = {
  onRouteDidUpdate() {
    void loadHelpers().then(([, { syncToc }]) => {
      syncToc();
    });
  },
};

export default clientModule;
