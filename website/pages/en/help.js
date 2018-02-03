/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          'Learn more using the [documentation on this site.](/content/docs/getting-started.html) and [reading the API reference](/content/docs/api-reference.html).',
        title: 'Browse Docs and API',
      },
      {
        content: 'Ask questions about the documentation and project in the `#react-navigation` channel on the [Reactiflux Discord](https://discord.gg/4xEK3nD).',
        title: 'Join the community',
      },
      {
        content:
          'Read the release notes for new versions of React Navigation in the [releases tab on the Github repository](https://github.com/react-navigation/react-navigation/releases).',
        title: 'Stay up to date',
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>Need help?</h2>
            </header>
            <p>
              If you've encountered a bug with React Navigation, please{' '}
              <a href="https://github.com/react-navigation/react-navigation/issues">
                post an issue
              </a>{' '}
              and be sure to fill out the issue template. If you believe there
              is a feature missing, please <a href="https://react-navigation.canny.io/feature-requests">create a feature request on
              Canny</a>, or if
              you're feeling up for the task of proposing an API for the
              feature, <a href="https://github.com/react-navigation/rfcs">submit a RFC!</a> If you just need some help, try joining us in the <code>#react-navigation</code> channel on <a href="https://discord.gg/4xEK3nD">Discord</a> or <a href="https://stackoverflow.com/questions/tagged/react-navigation">post a question to StackOverflow</a>.
            </p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
