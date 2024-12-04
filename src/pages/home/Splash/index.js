import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import React from 'react';

import SplashLeftIllustration from './SplashLeftIllustration';
import SplashRightIllustration from './SplashRightIllustration';
import styles from './styles.module.css';

export default function Splash() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <SplashLeftIllustration />
        <div className={styles.main}>
          <div className={styles.mainContent}>
            <h1 className={styles.mainText}>React Navigation</h1>
            <h3 className={styles.subText}>
              Routing and navigation for React Native and Web apps.
            </h3>
            <div className={styles.buttonContainer}>
              <Link
                to={useBaseUrl('/docs/getting-started')}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Read Docs
              </Link>
              <a
                target="_blank"
                href="https://github.com/react-navigation/react-navigation/tree/main/example"
                className={`${styles.button}`}
              >
                Try It
              </a>
            </div>
          </div>
          <div className={styles.mainUnderlay} />
        </div>
        <SplashRightIllustration />
      </div>
      <div className={styles.migrationText}>
        💡 Coming from an older version? Check out our{' '}
        <Link
          to={useBaseUrl('/docs/migration-guides')}
          className={styles.linkText}
        >
          migration guides
        </Link>
        .
      </div>
    </section>
  );
}
