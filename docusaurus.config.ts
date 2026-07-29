import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

import clientModules from './src/plugins/client-modules.ts';
import codeSplitVideoCss from './src/plugins/code-split-video-css.ts';
import disableFullySpecified from './src/plugins/disable-fully-specified.ts';
import googleAnalyticsDeferred from './src/plugins/google-analytics-deferred.ts';
import latestAnnouncement from './src/plugins/latest-announcement.ts';
import llmsTxt from './src/plugins/llms-txt.ts';
import ogImage from './src/plugins/og-image.ts';
import reactNavigationVersions from './src/plugins/react-navigation-versions.ts';
import rehypeCodeblockMeta from './src/plugins/rehype-codeblock-meta.ts';
import rehypeMediaAttributes from './src/plugins/rehype-media-attributes.ts';
import remarkNpm2Yarn from './src/plugins/remark-npm2yarn.ts';
import remarkStaticToDynamic from './src/plugins/remark-static-to-dynamic.ts';
import darkTheme from './src/themes/react-navigation-dark';
import lightTheme from './src/themes/react-navigation-light';

const latestVersion = '7.x';

const config: Config = {
  title: 'React Navigation',
  tagline: 'Routing and navigation for your React Native apps',
  url: process.env.URL || 'https://reactnavigation.org',
  baseUrl: '/',
  favicon: 'img/spiro.svg',
  organizationName: 'react-navigation',
  projectName: 'react-navigation.github.io',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',
  future: {
    v4: true,
    faster: true,
  },
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
      additionalLanguages: ['bash', 'java', 'toml'],
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
        width: 294,
        height: 300,
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
    codeSplitVideoCss,
    clientModules,
    googleAnalyticsDeferred,
    disableFullySpecified,
    reactNavigationVersions,
    [llmsTxt, { latestVersion }],
    latestAnnouncement,
    ogImage,
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/next',
            to: '/docs/upgrade-guides',
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
          remarkPlugins: [
            [remarkNpm2Yarn, { sync: true }],
            remarkStaticToDynamic,
          ],
          rehypePlugins: [
            [
              rehypeCodeblockMeta,
              { match: { snack: true, lang: true, tabs: true } },
            ],
            [rehypeMediaAttributes, { staticDir: 'static' }],
          ],
        },
        blog: {
          remarkPlugins: [
            [remarkNpm2Yarn, { sync: true }],
            remarkStaticToDynamic,
          ],
          rehypePlugins: [
            [
              rehypeCodeblockMeta,
              { match: { snack: true, lang: true, tabs: true } },
            ],
            [rehypeMediaAttributes, { staticDir: 'static' }],
          ],
        },
        pages: {
          remarkPlugins: [[remarkNpm2Yarn, { sync: true }]],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
};

export default config;
