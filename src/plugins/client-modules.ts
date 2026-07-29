import { fileURLToPath } from 'url';
import type { Plugin } from '@docusaurus/types';

export default function clientModules(): Plugin {
  return {
    name: 'client-modules',

    getClientModules() {
      return [fileURLToPath(new URL('../client/index.ts', import.meta.url))];
    },
  };
}
