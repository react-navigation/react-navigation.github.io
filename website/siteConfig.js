const users = [
  {
    caption: 'User1',
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'React Navigation',
  tagline: 'Routing and navigation for your React Native apps',
  url: 'https://reactnavigation.org',
  baseUrl: '/',
  organizationName: 'react-navigation',
  projectName: 'react-navigation.github.io',
  headerLinks: [
    { doc: 'getting-started', label: 'Docs' },
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
  scripts: [
    'https://buttons.github.io/buttons.js',
    '/js/snack.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-block-buttons.js'
  ],
  stylesheets: ['/css/code-block-buttons.css'],
  repoUrl: 'https://github.com/react-navigation/react-navigation',
  editUrl:
    'https://github.com/react-navigation/react-navigation.github.io/tree/source/website/versioned_docs/version-5.x/',

  gaTrackingId: 'UA-10128745-16',
  docsSideNavCollapsible: true,
  algolia: {
    apiKey: 'c967b4a1491b9cb486d3dca087b771e6',
    indexName: 'reactnavigation',
  },
};

module.exports = siteConfig;
