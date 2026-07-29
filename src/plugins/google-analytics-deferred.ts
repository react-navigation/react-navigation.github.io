import { fileURLToPath } from 'url';
import type { Plugin } from '@docusaurus/types';

export default function googleAnalyticsDeferred(): Plugin | null {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return {
    name: 'deferred-google-analytics',

    getClientModules() {
      return [
        fileURLToPath(new URL('./google-analytics-client.ts', import.meta.url)),
      ];
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
              window.ga = window.ga || function() {
                (window.ga.q = window.ga.q || []).push(arguments);
              };
              window.ga.l = Date.now();
              window.ga('create', 'UA-10128745-16', 'auto');
              window.ga('send', 'pageview');

              var loadAnalytics = function() {
                if (loadAnalytics.done) {
                  return;
                }

                loadAnalytics.done = true;
                clearTimeout(analyticsTimer);
                window.removeEventListener('pointerdown', loadAnalytics);
                window.removeEventListener('keydown', loadAnalytics);
                window.removeEventListener('scroll', loadAnalytics);

                var script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.google-analytics.com/analytics.js';
                document.head.appendChild(script);
              };

              window.addEventListener('pointerdown', loadAnalytics, { once: true });
              window.addEventListener('keydown', loadAnalytics, { once: true });
              window.addEventListener('scroll', loadAnalytics, { once: true, passive: true });

              var analyticsTimer = setTimeout(loadAnalytics, 5000);
            `,
          },
        ],
      };
    },
  };
}
