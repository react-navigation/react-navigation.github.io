import React from 'react';

import Layout from '@theme/Layout';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import versions from '../../versions.json';

function Version() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const latestVersion = '6.x';
  const pastVersions = versions.slice(versions.indexOf(latestVersion) + 1, versions.length);
  const nextVersions = versions.slice(0, versions.indexOf(latestVersion));
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}`;

  return (
    <Layout
      permalink="/versions"
      description="React Navigation Versions page listing all documented site versions">
      <div className="container margin-vert--xl">
        <h1>React Navigation documentation versions</h1>
        <div className="margin-bottom--lg">
          <h3 id="latest">Latest version (Stable)</h3>
          <p>Here you can find the latest documentation.</p>
          <table>
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <Link to={useBaseUrl('/docs/getting-started')}>
                    Documentation
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {nextVersions.length > 0 && (
          <div className="margin-bottom--lg">
            <h3 id="archive">Upcoming versions (Unstable)</h3>
            <p>
              Here you can find the documentation for the next unstable version of
              React Navigation.
            </p>
            <table>
              <tbody>
                {nextVersions.map(version => (
                  <tr key={version}>
                    <th>{version}</th>
                    <td>
                      <Link to={useBaseUrl(`/docs/${version}/getting-started`)}>
                        Documentation
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pastVersions.length > 0 && (
          <div className="margin-bottom--lg">
            <h3 id="archive">Past versions</h3>
            <p>
              Here you can find the documentation for previous versions of
              React Navigation.
            </p>
            <table>
              <tbody>
                {pastVersions.map(version => (
                  <tr key={version}>
                    <th>{version}</th>
                    <td>
                      <Link to={useBaseUrl(`/docs/${version}/getting-started`)}>
                        Documentation
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Version;
