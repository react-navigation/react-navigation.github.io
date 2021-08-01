import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';
import Spiro from '/img/spiro_header.svg';
import SplashLeftIllustration from './SplashLeftIllustration';
import SplashRightIllustration from './SplashRightIllustration';

export default function Splash() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <SplashLeftIllustration />
        <div className={styles.main}>
          <div className={styles.spiroContainer}>
            <Spiro />
          </div>
          <div className={styles.mainContent}>
            <h1 className={styles.mainText}>React Navigation</h1>
            <h3 className={styles.subText}>
              Routing and navigation for Expo and React Native apps.
            </h3>
            <div className={styles.buttonContainer}>
              <a
                href={useBaseUrl('/docs/getting-started')}
                className={styles.button}
              >
                Read Docs
              </a>
              <a
                href="https://github.com/react-navigation/react-navigation/tree/main/example"
                className={`${styles.button} ${styles.buttonPrimary}`}
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
        💡 Coming from v4? Check out our{' '}
        <Link
          to={useBaseUrl('/docs/5.x/upgrading-from-4.x')}
          className={styles.linkText}
        >
          v4 to v5 migration guide
        </Link>
        .
      </div>
    </section>
  );
}
