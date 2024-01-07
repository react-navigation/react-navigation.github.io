import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import sponsors from '../data/sponsors';

import Splash from './home/Splash';
import Features from './home/Features';
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

function Logo() {
  return (
    <>
    <div className="logo_outercircle logo_outeranimate">
      <div className="logo_innercircle logo_inner1"/>
      <div className="logo_innercircle logo_inner2"/>
      <div className="logo_innercircle logo_inner3"/>
    </div>
    <div className="logo_outercircle logo_outeranimate">
      <div className="logo_innercircle logo_inner1c"/>
      <div className="logo_innercircle logo_inner2c"/>
      <div className="logo_innercircle logo_inner3c"/>
    </div>
    <div className="logo_outercircle">
      <div className="logo_innercircle"/>
    </div>
    </>
  )
}
function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Splash />
      <Logo/>
      <Features />
      <Sponsors />
    </Layout>
  );
}

export default Home;
