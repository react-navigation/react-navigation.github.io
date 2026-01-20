import sponsors from '../../../data/sponsors';
import styles from './styles.module.css';

export default function Sponsors() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <p>
          React Navigation relies on the support from the community. Thanks to{' '}
          <a href="https://swmansion.com/">Software Mansion</a>,{' '}
          <a href="https://www.callstack.com/">Callstack</a>,{' '}
          <a href="https://expo.dev">Expo</a>, and our amazing{' '}
          <a href="https://github.com/react-navigation/react-navigation/graphs/contributors">
            contributors
          </a>{' '}
          & <a href="https://github.com/sponsors/react-navigation">sponsors</a>:
        </p>
        <div className={styles.sponsorsContainer}>
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.username}
              href={`https://github.com/${sponsor.username}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                alt={`${sponsor.name} (${sponsor.username})`}
                src={sponsor.avatarUrl}
                className={styles.avatar}
              />
            </a>
          ))}
        </div>
        <div>
          If React Navigation is helpful to you, consider{' '}
          <a
            style={{ fontWeight: 'bold' }}
            href="https://github.com/sponsors/react-navigation"
          >
            supporting the project by sponsoring it 💜
          </a>
        </div>
      </div>
    </section>
  );
}
