const path = require('path');
const versions = require('./versions.json');

module.exports = {
  title: 'React Navigation',
  tagline: 'Routing and navigation for your React Native apps',
  url: 'https://reactnavigation.org/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'react-navigation',
  projectName: 'react-navigation.github.io',
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-block-buttons.js',
  ],
  themeConfig: {
    sidebarCollapsible: false,
    googleAnalytics: {
      trackingID: 'UA-10128745-16',
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    algolia: {
      apiKey: '2378e3838ac984c220a994bfc0e0420f',
      indexName: 'react-navigation',
      algoliaOptions: {},
    },
    navbar: {
      title: 'React Navigation',
      logo: {
        alt: 'React Navigation Logo',
        src: 'img/spiro.svg',
      },
      items: [
        { to: 'docs/getting-started', label: 'Docs', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/react-navigation',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: 'help',
          label: 'Help',
        },
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: '/versions',
              label: 'All versions',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/getting-started',
            },
            {
              label: 'Building your own Navigator',
              to: 'docs/custom-navigators',
            },
            {
              label: 'Contributing',
              to: 'docs/contributing',
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Chat in our Discord channel',
              href: 'https://discord.gg/4xEK3nD',
            },
            {
              label: 'Get help on Stack Overflow',
              href:
                'https://stackoverflow.com/questions/tagged/react-navigation',
            },
            {
              label: 'Request a feature on Canny',
              href: 'https://react-navigation.canny.io/feature-requests',
            },
            {
              label: 'Report a bug on Github',
              href:
                'https://github.com/react-navigation/react-navigation/issues/new/choose',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/react-navigation/react-navigation',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/reactnavigation',
            },
          ],
        },
        {
          title: 'Built with',
          items: [
            {
              label: 'Docusaurus',
              to: 'https://docusaurus.io/',
            },
            {
              label: 'GitHub Pages',
              href: 'https://pages.github.com/',
            },
            {
              label: 'Netlify',
              href: 'https://www.netlify.com/',
            },
          ],
        },
      ],
    },
  },
  plugins: [
    path.resolve(__dirname, './src/plugins/docusaurus-plugin-redirect-html'),
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          docLayoutComponent: require.resolve('./src/layouts/DocPage.js'),
          docItemComponent: require.resolve('./src/layouts/DocItem.js'),
          editUrl:
            'https://github.com/react-navigation/react-navigation.github.io/edit/main/',
          remarkPlugins: [require('./src/plugins/remark-npm2yarn')],
          includeCurrentVersion: false,
          lastVersion: '5.x',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
