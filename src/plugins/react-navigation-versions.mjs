export default function friendsPlugin(context, options) {
  return {
    name: 'react-navigation-versions',
    async contentLoaded({ content, actions }) {
      const queries = {
        7: {
          tag: 'next',
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
                const pkg = await fetch(
                  `https://registry.npmjs.org/${name}/${tag}`
                ).then((res) => res.json());

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
