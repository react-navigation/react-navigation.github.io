import styles from './styles.module.css';

const features = [
  {
    image: '/img/home_smile.svg',
    title: `Easy to Use`,
    description: `
      Start quickly with built-in navigators that deliver a seamless
      out-of-the-box experience.
    `,
  },
  {
    image: '/img/home_devices.svg',
    title: `Components built for iOS and Android`,
    description: `
      Platform-specific look-and-feel with smooth animations and gestures.
    `,
  },
  {
    image: '/img/home_star.svg',
    title: `Completely customizable`,
    description: `
      If you know how to write apps using JavaScript you can customize any
      part of React Navigation.
    `,
  },
  {
    image: '/img/home_extend.svg',
    title: `Extensible platform`,
    description: `
      React Navigation is extensible at every layer— you can write your own
      navigators or even replace the user-facing API.
    `,
  },
];

export default function Features() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {features.map((feature) => (
          <div key={feature.title} className={styles.feature}>
            <img src={feature.image} alt="" />
            <h5 className={styles.title}>{feature.title}</h5>
            <p className={styles.description}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
