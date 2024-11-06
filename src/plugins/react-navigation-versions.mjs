import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const CACHE_DIR = join(
  process.cwd(),
  'node_modules',
  '.cache',
  'react-navigation-versions'
);

const query = async (name, tag) => {
  const cached = join(CACHE_DIR, `${name}-${tag}.json`);

  let pkg;

  try {
    pkg = await fetch(`https://registry.npmjs.org/${name}/${tag}`).then((res) =>
      res.json()
    );

    await mkdir(dirname(cached), { recursive: true });
    await writeFile(cached, JSON.stringify(pkg));
  } catch (e) {
    const data = await readFile(cached, 'utf-8');

    pkg = JSON.parse(data);
  }

  return pkg;
};

export default function reactNavigationVersionsPlugin(context, options) {
  return {
    name: 'react-navigation-versions',
    async contentLoaded({ content, actions }) {
      const queries = {
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
