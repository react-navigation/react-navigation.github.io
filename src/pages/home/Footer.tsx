import React from 'react';

const links = [
  { title: 'Docusaurus', href: 'https://docusaurus.io/' },
  { title: 'GitHub Pages', href: 'https://pages.github.com/' },
  { title: 'Netlify', href: 'https://www.netlify.com/' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container container-fluid">
        <div className="footer__bottom text--center">
          <div className="footer__copyright">
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
