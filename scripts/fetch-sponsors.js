const { graphql } = require('@octokit/graphql');
const path = require('path');
const fs = require('fs');

const query = `{
  organization(login: "react-navigation") {
    sponsorshipsAsMaintainer(first: 100) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          sponsorEntity {
            __typename
            ... on User {
              avatarUrl
              login
              name
            }
            ... on Organization {
              avatarUrl
              login
              name
            }
          }
        }
      }
    }
  }
}`;

function organizationToSponsors(organization) {
  const edges = organization.sponsorshipsAsMaintainer.edges;
  return edges.map((edge) => {
    const { sponsorEntity } = edge.node;

    return {
      avatarUrl: sponsorEntity.avatarUrl,
      username: sponsorEntity.login,
      name: sponsorEntity.name,
    };
  });
}

async function fetchSponsorsAsync() {
  let { organization } = await graphql(query, {
    headers: {
      authorization: `token ${process.env.REACT_NAV_GITHUB_TOKEN || process.env.GITHUB_TOKEN}`,
    },
  });

  return organizationToSponsors(organization);
}

async function fetchAndWriteSponsorsAsync() {
  const sponsors = await fetchSponsorsAsync();
  const sponsorsFilePath = path.join(
    __dirname,
    '..',
    'src',
    'data',
    'sponsors.js'
  );
  fs.writeFileSync(
    sponsorsFilePath,
    `export default ${JSON.stringify(sponsors, null, 2)}`
  );
  console.log(`Wrote updated sponsors to ${sponsorsFilePath}`);
}

fetchAndWriteSponsorsAsync();
