import path from 'path';
import remarkNpm2Yarn from '@docusaurus/remark-plugin-npm2yarn';
import rehypeCodeblockMeta from './src/plugins/rehype-codeblock-meta.mjs';

export default {
  title: 'React Navigation',
  tagline: 'Routing and navigation for your React Native apps',
  url: 'https://reactnavigation.org/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'react-navigation',
  projectName: 'react-navigation.github.io',
  scripts: ['/js/snack-helpers.js'],
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.dracula,
    },
    algolia: {
      appId: 'QCWXRU195A',
      apiKey: 'bad995329370d9a9ba50cc4b840a3884',
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
        },
      ],
    },
    footer: {
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
              href: 'https://discord.gg/reactiflux',
            },
            {
              label: 'Get help on Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/react-navigation',
            },
            {
              label: 'Request a feature on Canny',
              href: 'https://react-navigation.canny.io/feature-requests',
            },
            {
              label: 'Report a bug on GitHub',
              href: 'https://github.com/react-navigation/react-navigation/issues/new/choose',
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
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/next',
            to: '/docs/7.x/getting-started',
          },
        ],
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          editUrl:
            'https://github.com/react-navigation/react-navigation.github.io/edit/main/',
          includeCurrentVersion: false,
          lastVersion: '6.x',
          breadcrumbs: false,
          remarkPlugins: [[remarkNpm2Yarn, { sync: true }]],
          rehypePlugins: [
            [rehypeCodeblockMeta, { match: { snack: true } }],
          ],
        },
        blog: {
          remarkPlugins: [[remarkNpm2Yarn, { sync: true }]],
        },
        pages: {
          remarkPlugins: [[remarkNpm2Yarn, { sync: true }]],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-10128745-16',
        },
      },
    ],
  ],
};
