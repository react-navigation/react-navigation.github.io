import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Help() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  const supportLinks = [
    {
      content: (
        <p>
          Learn more using the{' '}
          <Link to={useBaseUrl('/docs/getting-started')}>
            {' '}
            documentation on this site
          </Link>
          .
        </p>
      ),
      title: <p>Browse Docs and API</p>,
    },
    {
      content: (
        <p>
          Ask questions about the documentation and project in the
          `#react-navigation` channel on the{' '}
          <Link to={useBaseUrl('https://discord.gg/4xEK3nD')}>
            {' '}
            Reactiflux Discord
          </Link>
          .
        </p>
      ),
      title: <p>Join the community</p>,
    },
    {
      content: (
        <p>
          Read the release notes for new versions of React Navigation in the{' '}
          <Link
            to={useBaseUrl(
              'https://github.com/react-navigation/react-navigation/releases'
            )}
          >
            releases tab on the Github repository
          </Link>
          .
        </p>
      ),
      title: <p>Stay up to date</p>,
    },
  ];

  return (
    <Layout title={`${siteConfig.title}`}>
      <div className="docMainWrapper wrapper">
        <div className="container margin-vert--xl">
          <header className="postHeader">
            <h2>Need help?</h2>
          </header>
          <p>
            {`If you've encountered a bug with React Navigation, please `}
            <a href="https://github.com/react-navigation/react-navigation/issues">
              post an issue
            </a>{' '}
            and be sure to fill out the issue template. If you believe there is
            a feature missing, please{' '}
            <a href="https://react-navigation.canny.io/feature-requests">
              create a feature request on Canny
            </a>
            ,{' '}
            {`or if you're feeling up for the task of proposing an API for the feature, `}
            <a href="https://github.com/react-navigation/rfcs">submit a RFC!</a>{' '}
            If you just need some help, try joining us in the{' '}
            <code>react-navigation</code> channel on
            <a href="https://discord.gg/4xEK3nD"> Discord </a>
            or{' '}
            <a href="https://stackoverflow.com/questions/tagged/react-navigation">
              post a question to StackOverflow
            </a>
            .
          </p>
        </div>
        {supportLinks && supportLinks.length && (
          <section className="margin-vert--xl">
            <div className="container">
              <div className="row">
                {supportLinks.map(({ content, title }, i) => (
                  <div key={i} className="col col--4">
                    <h3>{title}</h3>
                    {content}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
