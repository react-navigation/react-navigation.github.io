const users = [
  {
    caption: 'User1',
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'React Navigation (v2)',
  tagline: 'Routing and navigation for your React Native apps',
  url: process.env.STABLE_RELEASE
    ? 'https://reactnavigation.org'
    : 'https://v2.react-navigation.org',
  baseUrl: '/',
  organizationName: process.env.STABLE_RELEASE
    ? 'react-navigation' 
    : 'react-navigation-v2',
  projectName: process.env.STABLE_RELEASE
    ? 'react-navigation.github.io'
    : 'react-navigation-v2.github.io',
  headerLinks: [
    { doc: 'getting-started', label: 'Docs' },
    { doc: 'api-reference', label: 'API' },
    { page: 'help', label: 'Help' },
    { blog: true, label: 'Blog' },
  ],
  users,
  /* TODO: update to use new icon */
  headerIcon: 'img/spiro_white.svg',
  footerIcon: 'img/spiro_white.svg',
  favicon: 'img/favicon.ico',
  colors: {
    primaryColor: '#6b52ae',
    secondaryColor: '#6b52ae',
  },
  copyright: 'None',
  highlight: {
    theme: 'github-gist',
  },
  usePrism: ['jsx', 'js'],
  onPageNav: 'separate',
  scripts: ['https://buttons.github.io/buttons.js'],
  repoUrl: 'https://github.com/react-navigation/react-navigation',
  editUrl:
    'https://github.com/react-navigation/react-navigation.github.io/edit/source/docs/',
  ...(process.env.STABLE_RELEASE
    ? {
        algolia: {
          apiKey: 'c967b4a1491b9cb486d3dca087b771e6',
          indexName: 'reactnavigation',
        },
      }
    : {}),
};

module.exports = siteConfig;
