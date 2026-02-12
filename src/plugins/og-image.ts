import type { LoadContext, Plugin } from '@docusaurus/types';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import * as React from 'react';
import satori from 'satori';

import OgImage from '../components/OgImage';

const WIDTH = 1200;
const HEIGHT = 630;
const OG_IMAGE_PATH = 'img/og-image.png';

function findHtmlFiles(dir: string): string[] {
  const results: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.name === 'index.html') {
      results.push(fullPath);
    }
  }

  return results;
}

export default function ogImagePlugin(context: LoadContext): Plugin {
  return {
    name: 'og-image',

    async postBuild({ outDir }) {
      const logoSvg = await fs.promises.readFile(
        path.join(context.siteDir, 'static/img/spiro_white.svg'),
        'utf-8'
      );

      const logoBase64 = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;

      const svg = await satori(React.createElement(OgImage, { logoBase64 }), {
        width: WIDTH,
        height: HEIGHT,
        fonts: [],
      });

      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: WIDTH },
      });

      const png = new Uint8Array(resvg.render().asPng());
      const imgPath = path.join(outDir, OG_IMAGE_PATH);
      await fs.promises.writeFile(imgPath, png);

      const ogUrl = `${context.siteConfig.url}/${OG_IMAGE_PATH}`;
      const htmlFiles = findHtmlFiles(outDir);

      let injected = 0;

      await Promise.all(
        htmlFiles.map(async (htmlFile) => {
          const html = await fs.promises.readFile(htmlFile, 'utf-8');

          if (html.includes('og:image')) return;

          const metaTags = [
            `<meta property="og:image" content="${ogUrl}">`,
            ...(!html.includes('twitter:card')
              ? [`<meta name="twitter:card" content="summary_large_image">`]
              : []),
            `<meta name="twitter:image" content="${ogUrl}">`,
          ].join('\n    ');

          const updatedHtml = html.replace(
            '</head>',
            `    ${metaTags}\n  </head>`
          );
          await fs.promises.writeFile(htmlFile, updatedHtml);

          injected++;
        })
      );

      console.log(
        `${util.styleText(['magenta', 'bold'], '[og-image]')} Generated image for ${injected} pages`
      );
    },
  };
}
