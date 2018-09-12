/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            <img
              src={this.props.config.baseUrl + this.props.config.footerIcon}
              alt={this.props.config.title}
              width="66"
              height="58"
            />
          </a>
          <div>
            <h5><translate>Docs</translate></h5>
            <a
              href={
                `${this.props.config.baseUrl}docs/${this.props.language}/getting-started.html`
              }>
              <translate>Getting Started</translate>
            </a>
            <a
              href={
                `${this.props.config.baseUrl}docs/${this.props.language}/api-reference.html`
              }>
              <translate>API Reference</translate>
            </a>
            <a
              href={
                `${this.props.config.baseUrl}docs/${this.props.language}/custom-navigator-overview.html`
              }>
              <translate>Building your own Navigator</translate>
            </a>
            <a
              href={
                `${this.props.config.baseUrl}docs/${this.props.language}/contributing.html`
              }>
              <translate>Contributing</translate>
            </a>
          </div>
          <div>
            <h5><translate>Versions</translate></h5>
            <a href="https://reactnavigation.org/docs/getting-started.html">
              <translate>Version 2 docs</translate>
            </a>
            <a href="https://v1.reactnavigation.org/docs/getting-started.html">
              <translate>Version 1 docs</translate>
            </a>
          </div>
          <div>
            <h5><translate>Support</translate></h5>
            <a href="https://discord.gg/4xEK3nD">
              <translate>Chat in our Discord channel</translate>
            </a>
            <a href="https://react-navigation.canny.io/feature-requests">
              <translate>Request a feature on Canny</translate>
            </a>
            <a href="https://github.com/react-navigation/react-navigation/issues">
              <translate>Report a bug on Github</translate>
            </a>
            <a
              href="https://stackoverflow.com/questions/tagged/react-navigation"
              target="_blank"
            >
              <translate>Get help on Stack Overflow</translate>
            </a>
          </div>
          <div>
            <h5><translate>More</translate></h5>
            {/* <a href={this.props.config.baseUrl + 'blog'}>Blog</a> */}
            <a href={this.props.config.repoUrl}>
              GitHub
            </a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/react-community/react-navigation/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
