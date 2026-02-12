import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

import rehypeCodeblockMeta from './src/plugins/rehype-codeblock-meta.mjs';
import rehypeStaticToDynamic from './src/plugins/rehype-static-to-dynamic.mjs';
import rehypeVideoAspectRatio from './src/plugins/rehype-video-aspect-ratio.mjs';
import remarkNpm2Yarn from './src/plugins/remark-npm2yarn.mjs';
import remarkRawMarkdown from './src/plugins/remark-raw-markdown.mjs';
import darkTheme from './src/themes/react-navigation-dark';
import lightTheme from './src/themes/react-navigation-light';

const latestVersion = '7.x';

const config: Config = {
  title: 'React Navigation',
  tagline: 'Routing and navigation for your React Native apps',
  url: process.env.URL || 'https://reactnavigation.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'react-navigation',
  projectName: 'react-navigation.github.io',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: lightTheme,
      darkTheme: darkTheme,
      additionalLanguages: [
        'bash',
        'json',
        'java',
        'kotlin',
        'groovy',
        'ruby',
        'swift',
        'objectivec',
        'toml',
      ],
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
  } satisfies Preset.ThemeConfig,
  plugins: [
    './src/plugins/disable-fully-specified.mjs',
    './src/plugins/react-navigation-versions.mjs',
    ['./src/plugins/llms-txt.mjs', { latestVersion }],
    './src/plugins/og-image.ts',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/next',
            to: '/docs/migration-guides',
          },
        ],
        createRedirects(existingPath) {
          if (
            existingPath.includes('/docs/') &&
            !/\/docs\/\d+\.x/.test(existingPath)
          ) {
            return existingPath.replace('/docs/', '/docs/7.x/');
          }
        },
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
          lastVersion: latestVersion,
          versions: {
            [latestVersion]: {
              badge: false,
            },
          },
          breadcrumbs: false,
          sidebarCollapsed: false,
          remarkPlugins: [remarkRawMarkdown, [remarkNpm2Yarn, { sync: true }]],
          rehypePlugins: [
            [
              rehypeCodeblockMeta,
              { match: { snack: true, lang: true, tabs: true } },
            ],
            [rehypeVideoAspectRatio, { staticDir: 'static' }],
            rehypeStaticToDynamic,
          ],
        },
        blog: {
          remarkPlugins: [remarkRawMarkdown, [remarkNpm2Yarn, { sync: true }]],
        },
        pages: {
          remarkPlugins: [remarkRawMarkdown, [remarkNpm2Yarn, { sync: true }]],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        googleAnalytics: {
          trackingID: 'UA-10128745-16',
        },
      } satisfies Preset.Options,
    ],
  ],
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'true',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet',
      },
    },
  ],
  scripts: [
    '/js/snack-helpers.js',
    '/js/toc-fixes.js',
    '/js/video-playback.js',
  ],
};

export default config;
