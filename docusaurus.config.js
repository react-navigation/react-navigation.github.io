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
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        { className: 'code-block-diff-add-line', line: 'diff-add' },
        { className: 'code-block-diff-remove-line', line: 'diff-remove' },
      ],
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
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          to: 'docs/getting-started',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'right',
        },
        {
          type: 'dropdown',
          label: 'Help',
          items: [
            {
              label: 'Issues',
              href: 'https://github.com/react-navigation/react-navigation/issues',
            },
            {
              label: 'Feature Requests',
              href: 'https://react-navigation.canny.io/feature-requests',
            },
            {
              label: 'Reactiflux Discord',
              href: 'https://www.reactiflux.com',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/react-navigation',
            },
            {
              label: 'Troubleshooting',
              to: 'docs/troubleshooting',
            },
            {
              label: 'Contributing',
              to: 'docs/contributing',
            },
          ],
          position: 'right',
        },
        {
          href: 'https://x.com/reactnavigation',
          className: 'navbar-social-link navbar-social-link-x',
          'aria-label': 'X',
          position: 'right',
        },
        {
          href: 'https://github.com/react-navigation/react-navigation',
          className: 'navbar-social-link navbar-social-link-github',
          'aria-label': 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} React Navigation. Built with <a target="_blank" rel="noreferrer noopener" href="https://docusaurus.io/">Docusaurus</a>, <a target="_blank" rel="noreferrer noopener" href="https://pages.github.com/">GitHub Pages</a>, and <a target="_blank" rel="noreferrer noopener" href="https://www.netlify.com/">Netlify</a>.`,
    },
  },
  plugins: [
    './src/plugins/react-navigation-versions.mjs',
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
          sidebarCollapsed: false,
          remarkPlugins: [[remarkNpm2Yarn, { sync: true }]],
          rehypePlugins: [
            [rehypeCodeblockMeta, { match: { snack: true, lang: true } }],
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
