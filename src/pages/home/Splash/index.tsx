import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { usePluginData } from '@docusaurus/useGlobalData';

import type { LatestAnnouncement } from '../../../plugins/latest-announcement.ts';
import SplashLeftIllustration from './SplashLeftIllustration';
import SplashRightIllustration from './SplashRightIllustration';
import styles from './styles.module.css';

function isLatestAnnouncement(value: unknown): value is LatestAnnouncement {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    typeof value.title === 'string' &&
    'permalink' in value &&
    typeof value.permalink === 'string'
  );
}

export default function Splash() {
  const data = usePluginData('latest-announcement');
  const announcement = isLatestAnnouncement(data) ? data : null;

  console.log('Announcement:', data);

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
      {announcement && (
        <div className={styles.migrationText}>
          ✨{' '}
          <Link
            to={useBaseUrl(announcement.permalink)}
            className={styles.linkText}
          >
            {announcement.title}
          </Link>
        </div>
      )}
    </section>
  );
}
