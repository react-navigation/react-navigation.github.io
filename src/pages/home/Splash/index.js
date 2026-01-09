import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

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
        ✨ React Navigation 8 is coming. Check out the{' '}
        <Link
          to={useBaseUrl('/blog/2025/12/19/react-navigation-8.0-alpha')}
          className={styles.linkText}
        >
          announcement
        </Link>
        .
      </div>
    </section>
  );
}
