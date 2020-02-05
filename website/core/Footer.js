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
      <footer className="nav-footer" id="footer" style={{ paddingTop: 0 }}>
        <div
          style={{
            marginBottom: '2em',
            backgroundColor: '#fff',
            display: 'flex',
            flex: 1,
            position: 'relative',
            paddingTop: 35,
            paddingBottom: 35,
            maxHeight: 412,
            borderTopWidth: 1,
            borderTopColor: '#eee',
            borderTopStyle: 'solid',
          }}
        >
          <div
            style={{
              zIndex: 0,
              opacity: 0.4,
              position: 'absolute',
              bottom: 0,
              right: 0,
              top: 0,
              left: 0,
              backgroundImage: 'url(/img/expo_spiro.png)',
              backgroundRepeat: 'repeat',
              backgroundColor: '#fff',
              backgroundPositionX: 'center',
            }}
          />
          <p
            style={{
              justifyContent: 'center',
              flex: 1,
              marginBottom: 0,
              zIndex: 1,
              textAlign: 'center',
              paddingLeft: 20,
              paddingRight: 20,
              color: '#7b7b7b',
            }}
          >
            React Navigation is built and funded by{' '}
            <a href="https://expo.io" style={{ fontWeight: 'bold' }}>
              Expo
            </a>
            <span>{' '}&{' '}</span>
            <a href="https://swmansion.com/" style={{ fontWeight: 'bold' }}>
              Software Mansion
            </a>
            , with contributions from the{' '}
            <a
              style={{ fontWeight: 'bold' }}
              href="https://github.com/react-navigation/react-navigation/graphs/contributors"
            >
              community
            </a>
            .
          </p>
        </div>

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
            <h5>Docs</h5>
            <a
              href={`${this.props.config.baseUrl}docs/${this.props.language}/getting-started.html`}
            >
              Getting Started
            </a>
            <a
              href={`${this.props.config.baseUrl}docs/${this.props.language}/custom-navigator-overview.html`}
            >
              Building your own Navigator
            </a>
            <a
              href={`${this.props.config.baseUrl}docs/${this.props.language}/contributing.html`}
            >
              Contributing
            </a>
          </div>
          <div>
            <h5>Support</h5>
            <a href="https://discord.gg/4xEK3nD">Chat in our Discord channel</a>
            <a href="https://react-navigation.canny.io/feature-requests">
              Request a feature on Canny
            </a>
            <a href="https://github.com/react-navigation/react-navigation/issues">
              Report a bug on Github
            </a>
            <a
              href="https://stackoverflow.com/questions/tagged/react-navigation"
              target="_blank"
            >
              Get help on Stack Overflow
            </a>
          </div>
          <div>
            <h5>More</h5>
            {/* <a href={this.props.config.baseUrl + 'blog'}>Blog</a> */}
            <a href={this.props.config.repoUrl}>GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/react-navigation/react-navigation/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
