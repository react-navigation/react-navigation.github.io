import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';

import Features from './home/Features';
import Footer from './home/Footer';
import Splash from './home/Splash';
import Sponsors from './home/Sponsors';

const features = [
  {
    title: `Easy to Use`,
    description: `
      Start quickly with built-in navigators that deliver a seamless
      out-of-the-box experience.
    `,
  },
  {
    title: `Components built for iOS and Android`,
    description: `
      Platform-specific look-and-feel with smooth animations and gestures.
    `,
  },
  {
    title: `Completely customizable`,
    description: `
      If you know how to write apps using JavaScript you can customize any
      part of React Navigation.
    `,
  },
  {
    title: `Extensible platform`,
    description: `
      React Navigation is extensible at every layer— you can write your own
      navigators or even replace the user-facing API.
    `,
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
      wrapperClassName="full-width"
    >
      <Splash />
      <Features />
      <Sponsors />
      <Footer />
    </Layout>
  );
}

export default Home;
