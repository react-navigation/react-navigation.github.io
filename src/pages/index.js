import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import sponsors from '../data/sponsors';

import Splash from './home/Splash';
import Features from './home/Features';
import Sponsors from './home/Sponsors';
import BLM from './home/BLM';

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
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Splash />
      <Features />
      <Sponsors />
      <BLM />
    </Layout>
  );
}

export default Home;
