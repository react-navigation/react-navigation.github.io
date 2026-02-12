import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Features from './home/Features';
import Footer from './home/Footer';
import Splash from './home/Splash';
import Sponsors from './home/Sponsors';

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig } = context;

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
