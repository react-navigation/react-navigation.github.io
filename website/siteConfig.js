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
  url: 'https://react-navigation.github.io/website',
  baseUrl: '/',
  organizationName: 'react-navigation',
  projectName: 'website',
  headerLinks: [
    {doc: 'getting-started', label: 'Docs'},
    {doc: 'api-reference', label: 'API'},
    {page: 'help', label: 'Help'},
    // {blog: true, label: 'Blog'},
  ],
  users,
  /* TODO: update to use new icon */
  headerIcon: 'img/spiro_white.svg',
  footerIcon: 'img/spiro_white.svg',
  favicon: 'img/favicon.ico',
  colors: {
    primaryColor: '#6b52ae',
    secondaryColor: '#6b52ae'
  },
  copyright: 'None',
  highlight: {
    theme: 'github-gist',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  repoUrl: 'https://github.com/react-navigation/react-navigation',
//   algolia: {
//     apiKey: "my-search-only-api-key-1234",
//     indexName: "my-index-name"
//   },
};

module.exports = siteConfig;
