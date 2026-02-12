import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type {
  LoadContext,
  Plugin,
  PluginContentLoadedActions,
} from '@docusaurus/types';

const CACHE_DIR = join(
  process.cwd(),
  'node_modules',
  '.cache',
  'react-navigation-versions'
);

type NpmPackage = {
  version: string;
  peerDependencies?: Record<string, string>;
};

type VersionQuery = {
  tag: string;
  packages: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === 'string');
}

function isNpmPackage(value: unknown): value is NpmPackage {
  if (!isRecord(value)) {
    return false;
  }

  if (typeof value.version !== 'string') {
    return false;
  }

  if (
    'peerDependencies' in value &&
    value.peerDependencies !== undefined &&
    !isStringRecord(value.peerDependencies)
  ) {
    return false;
  }

  return true;
}

const query = async (name: string, tag: string): Promise<NpmPackage> => {
  const cached = join(CACHE_DIR, `${name}-${tag}.json`);

  let pkg: NpmPackage;

  try {
    const response = await fetch(`https://registry.npmjs.org/${name}/${tag}`);
    const data: unknown = await response.json();

    if (!isNpmPackage(data)) {
      throw new Error(`Invalid package response for ${name}@${tag}`);
    }

    pkg = data;

    await mkdir(dirname(cached), { recursive: true });
    await writeFile(cached, JSON.stringify(pkg));
  } catch (e) {
    const data = await readFile(cached, 'utf-8');
    const parsed: unknown = JSON.parse(data);

    if (!isNpmPackage(parsed)) {
      throw new Error(`Invalid cached package response for ${name}@${tag}`);
    }

    pkg = parsed;
  }

  return pkg;
};

export default function reactNavigationVersionsPlugin(
  _context: LoadContext,
  _options: unknown
): Plugin {
  return {
    name: 'react-navigation-versions',
    async contentLoaded({ actions }: { actions: PluginContentLoadedActions }) {
      const queries: Record<string, VersionQuery> = {
        '7.x': {
          tag: 'latest',
          packages: [
            '@react-navigation/bottom-tabs',
            '@react-navigation/core',
            '@react-navigation/drawer',
            '@react-navigation/elements',
            '@react-navigation/material-top-tabs',
            '@react-navigation/native-stack',
            '@react-navigation/native',
            '@react-navigation/routers',
            '@react-navigation/stack',
            'react-native-drawer-layout',
            'react-native-tab-view',
          ],
        },
      };

      const versions = Object.fromEntries(
        await Promise.all(
          Object.entries(queries).map(async ([version, { tag, packages }]) => {
            const items = await Promise.all(
              packages.map(async (name) => {
                const pkg = await query(name, tag);
                const peers = Object.fromEntries(
                  Object.entries(pkg.peerDependencies || {}).map(([name]) => [
                    name,
                    '*',
                  ])
                );

                return [name, [pkg.version, peers]];
              })
            );

            return [version, Object.fromEntries(items)];
          })
        )
      );

      actions.setGlobalData({ versions });
    },
  };
}
