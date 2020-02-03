/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const translate = require("../../server/translate.js").translate;
const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          <translate>Learn more using the [documentation on this site](/docs/en/getting-started.html).</translate>,
        title: <translate>Browse Docs and API</translate>,
      },
      {
        content: <translate>Ask questions about the documentation and project in the `#react-navigation` channel on the [Reactiflux Discord](https://discord.gg/4xEK3nD).</translate>,
        title: <translate>Join the community</translate>,
      },
      {
        content:
          <translate>Read the release notes for new versions of React Navigation in the [releases tab on the Github repository](https://github.com/react-navigation/react-navigation/releases).</translate>,
        title: <translate>Stay up to date</translate>,
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>
                <translate>Need help?</translate>
              </h2>
            </header>
            <p>
              <translate>If you've encountered a bug with React Navigation, please</translate>{' '}
              <a href="https://github.com/react-navigation/react-navigation-4/issues">
                <translate>post an issue</translate>
              </a>{' '}
              <translate>and be sure to fill out the issue template. If you believe there is a feature missing, please</translate>{' '}
              <a href="https://react-navigation.canny.io/feature-requests">
                <translate> create a feature request on Canny</translate>
              </a>
              <translate>, or if you're feeling up for the task of proposing an API for the feature, </translate>{' '}
              <a href="https://github.com/react-navigation/rfcs">
                <translate>submit a RFC!</translate>
              </a>{' '}
              <translate> If you just need some help, try joining us in the</translate>
              {' '}<code>react-navigation</code>{' '}
              <translate>channel on</translate>
              <a href="https://discord.gg/4xEK3nD"> Discord </a>
              <translate>or</translate>{' '}
              <a href="https://stackoverflow.com/questions/tagged/react-navigation">
                <translate> post a question to StackOverflow</translate>
              </a>.
            </p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
