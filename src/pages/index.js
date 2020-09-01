import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import sponsors from '../data/sponsors';

const features = [
  {
    title: `Easy to Use`,
    description: `
      Start quickly with built-in navigators that deliver a seamless
      out-of-the-box experience.
    `
  },
  {
    title: `Components built for iOS and Android`,
    description: `
      Platform-specific look-and-feel with smooth animations and gestures.
    `
  },
  {
    title: `Completely customizable`,
    description: `
      If you know how to write apps using JavaScript you can customize any
      part of React Navigation.
    `
  },
  {
    title: `Extensible platform`,
    description: `
      React Navigation is extensible at every layer— you can write your own
      navigators or even replace the user-facing API.
    `
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <div className={styles.blm}>
        Black Lives Matter.{' '}
        <a
          target="_blank"
          rel="noopener"
          rel="noreferrer"
          href="https://support.eji.org/give/153413/#!/donation/checkout"
        >
          Support the Equal Justice Initiative
        </a>
        .
      </div>
      <header className="hero text--center">
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>

          <div>
            <Link
              className={classnames(
                'button button--secondary button--outline button--lg margin-right--sm',
                styles.heroButton
              )}
              to={useBaseUrl('/docs/getting-started')}
            >
              Read docs
            </Link>

            <Link
              className={classnames(
                'button button--secondary button--outline button--lg',
                styles.heroButton
              )}
              to={
                'https://github.com/react-navigation/react-navigation/tree/main/example'
              }
            >
              Try the demo app
            </Link>
          </div>

          <div style={{ marginTop: 30, opacity: 0.8 }}>
            💡 Coming from v4? Check out our{' '}
            <Link
              to={useBaseUrl('/docs/upgrading-from-4.x')}
              style={{ color: '#fff', fontWeight: 'bold' }}
            >
              v4 to v5 migration guide
            </Link>
            .
          </div>
        </div>
      </header>

      {features && features.length && (
        <section className="margin-vert--xl">
          <div className="container">
            <div className="row">
              {features.map(({ title, description }, i) => (
                <div key={i} className="col col--3">
                  <h3>{title}</h3>
                  <p className="margin--none">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className={styles.sponsoredBanner}>
        <p>
          React Navigation is built and funded by <a href="https://expo.io" style={{ fontWeight: 'bold' }}>Expo</a> &amp; <a href="https://swmansion.com/" style={{ fontWeight: 'bold' }}>Software Mansion</a>
          , with contributions from the{' '} <a style={{ fontWeight: 'bold' }} href="https://github.com/react-navigation/react-navigation/graphs/contributors">community</a>{' '}
          and <a href="https://github.com/sponsors/react-navigation" style={{ fontWeight: 'bold' }}>sponsors</a>
        </p>
        :
        <div
          style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}
        >
          {sponsors.map((sponsor) => {
            return (
              <a
                href={`https://github.com/${sponsor.username}`}
                target="_blank"
              >
                <img
                  alt={`${sponsor.name} (${sponsor.username})`}
                  src={sponsor.avatarUrl}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    opacity: 0.8,
                    display: 'inline-block',
                    marginLeft: 10,
                  }}
                />
              </a>
            );
          })}
        </div>
        <div style={{ marginTop: 20 }}>
          If React Navigation is helpful to you, consider{' '}
          <a
            style={{ fontWeight: 'bold' }}
            href="https://github.com/sponsors/react-navigation"
          >
            supporting the project by sponsoring it 💜
          </a>
        </div>
      </section>
    </Layout>
  );
}

export default Home;
