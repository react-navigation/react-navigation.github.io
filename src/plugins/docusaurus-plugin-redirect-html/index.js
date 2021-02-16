const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const writeFileAsync = promisify(fs.writeFile);

module.exports = function(context) {
  return {
    name: 'docusaurus-plugin-redirect-html',

    postBuild({ siteConfig = {}, routesPaths = [], outDir }) {
      routesPaths.forEach(async routesPath => {
        if (
          routesPath.endsWith('/') ||
          routesPath.endsWith('.html') ||
          !routesPath.includes('/docs/')
        ) {
          return;
        }

        const permalink = siteConfig.url.concat(routesPath.replace(/^\//, ''));

        const html = `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=${routesPath}">
    <link rel="canonical" href="${permalink}">
    <title>Redirecting to ${permalink}</title>
  </head>
  <body>
    If you are not redirected automatically, follow <a href="${routesPath}">this link</a>.
    <script>
      <!--
      window.location.href = "${routesPath}";
      // -->
    </script>
  </body>
</html>
        `;

        const redirects = [
          `${routesPath}.html/index.html`,
          `${routesPath.replace('/docs/', '/docs/en/')}.html`,
          `${routesPath.replace('/docs/', '/docs/en/next/')}.html`,
        ];

        for (redirect of redirects) {
          const file = path.join(outDir, redirect);

          await mkdirp(path.dirname(file));
          await writeFileAsync(file, html);
        }
      });
    },
  };
};
