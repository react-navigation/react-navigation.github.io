import type { ClientModule } from '@docusaurus/types';

declare global {
  interface Window {
    ga: (...args: string[]) => void;
  }
}

const clientModule: ClientModule = {
  onRouteDidUpdate({ location, previousLocation }) {
    if (
      previousLocation &&
      (location.pathname !== previousLocation.pathname ||
        location.search !== previousLocation.search ||
        location.hash !== previousLocation.hash)
    ) {
      window.ga(
        'set',
        'page',
        location.pathname + location.search + location.hash
      );
      window.ga('send', 'pageview');
    }
  },
};

export default clientModule;
