import React from 'react';

const links = [
  { title: 'Docusaurus', href: 'https://docusaurus.io/' },
  { title: 'GitHub Pages', href: 'https://pages.github.com/' },
  { title: 'Netlify', href: 'https://www.netlify.com/' },
];

export default function Footer() {
  return (
    <footer class="footer">
      <div class="container container-fluid">
        <div class="footer__bottom text--center">
          <div class="footer__copyright">
            Copyright © 2024 React Navigation. Built with{' '}
            {links.map((link, index) => (
              <React.Fragment key={link.href}>
                {index > 0 && ', '}
                <a target="_blank" rel="noreferrer noopener" href={link.href}>
                  {link.title}
                </a>
              </React.Fragment>
            ))}
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
