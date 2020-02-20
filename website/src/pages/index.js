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
    // TODO: add image
    //imageUrl: '',
    description: (
      <>
        Start quickly with built-in navigators that deliver a seamless out-of-the-box experience.
      </>
    ),
  },
  {
    title: <>Components built for iOS and Android</>,
    // TODO: add image
    //imageUrl: '',
    description: (
      <>
        Platform-specific look-and-feel with smooth animations and gestures.
      </>
    ),
  },
  {
    title: <>Completely customizable</>,
    // TODO: add image
    //imageUrl: '',
    description: (
      <>
        If you know how to write apps using JavaScript you can customize any part of React Navigation.
      </>
    ),
  },
  {
    title: <>Extensible platform</>,
    // TODO: add image
    //imageUrl: '',
    description: (
      <>
        React Navigation is extensible at every layer— you can write your own navigators or even replace the user-facing API.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--3', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>

          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              style={{color: '#fff'}}
              to={useBaseUrl('/docs/getting-started')}>
              Read guides
            </Link>

            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              style={{color: '#fff'}}
              to={'https://github.com/react-navigation/react-navigation/tree/master/example'}>
              Try the demo app
            </Link>
          </div>

          <div className="section">
            <p><translate>React Navigation 5 has a new dynamic API</translate> 🎉. <a style={{color: 'white'}} href="https://reactnavigation.org/blog/2020/02/06/react-navigation-5.0.html"><translate>Read about it here</translate></a>.</p>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <div
        style={{
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
    </Layout>
  );
}

export default Home;
