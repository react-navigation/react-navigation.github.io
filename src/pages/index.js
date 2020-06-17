import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Easy to Use</>,
    description: (
      <>
        Start quickly with built-in navigators that deliver a seamless
        out-of-the-box experience.
      </>
    ),
  },
  {
    title: <>Components built for iOS and Android</>,
    description: (
      <>Platform-specific look-and-feel with smooth animations and gestures.</>
    ),
  },
  {
    title: <>Completely customizable</>,
    description: (
      <>
        If you know how to write apps using JavaScript you can customize any
        part of React Navigation.
      </>
    ),
  },
  {
    title: <>Extensible platform</>,
    description: (
      <>
        React Navigation is extensible at every layer— you can write your own
        navigators or even replace the user-facing API.
      </>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
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
                'https://github.com/react-navigation/react-navigation/tree/master/example'
              }
            >
              Try the demo app
            </Link>
          </div>
        </div>
      </header>
      <section className="margin-vert--xl text--center">
        <div className="container">
          <div className="row">
            <div className="col col--12">
              <h4>
                Coming from v4? Check out our{' '}
                <Link to={useBaseUrl('/docs/upgrading-from-4.x')}>
                  v4 to v5 migration guide
                </Link>
                .
              </h4>
            </div>
          </div>
        </div>
      </section>
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
        React Navigation is built and funded by{' '}
        <a href="https://expo.io" style={{ fontWeight: 'bold' }}>
          Expo
        </a>{' '}
        &{' '}
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
      </section>
    </Layout>
  );
}

export default Home;
