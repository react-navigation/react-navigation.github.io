/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/content/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'React Navigation' /* title for your website */,
  tagline: 'Navigation for React Native',
  url: 'https://reactnavigation.org' /* your website url */,
  baseUrl: '/content/' /* base url for your project */,
  projectName: 'react-navigation',
  headerLinks: [
    {doc: 'getting-started', label: 'Docs'},
    {doc: 'doc4', label: 'API'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/react_white.png',
  footerIcon: 'img/react_white.png',
  favicon: 'img/favicon.ico',
  /* colors for website */
  colors: {
    primaryColor: '#6b52ae',
    secondaryColor: '#eee',
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: 'None',
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'github-gist',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/react-navigation/react-navigation',
};

module.exports = siteConfig;
