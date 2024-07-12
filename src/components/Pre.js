import { useColorMode } from '@docusaurus/theme-common';
import MDXPre from '@theme-original/MDXComponents/Pre';
import React from 'react';

const peers = {
  'react-native-safe-area-context': '*',
  'react-native-screens': '*',
};

const versions = {
  7: {
    '@react-navigation/bottom-tabs': [
      '7.0.0-rc.20',
      {
        ...peers,
        '@react-navigation/native': '*',
      },
    ],
    '@react-navigation/core': '7.0.0-rc.10',
    '@react-navigation/native': '7.0.0-rc.13',
    '@react-navigation/drawer': [
      '7.0.0-rc.18',
      {
        ...peers,
        '@react-navigation/native': '*',
        'react-native-gesture-handler': '*',
        'react-native-reanimated': '*',
      },
    ],
    '@react-navigation/elements': [
      '2.0.0-rc.14',
      {
        ...peers,
        '@react-navigation/native': '*',
      },
    ],
    '@react-navigation/material-top-tabs': [
      '7.0.0-rc.14',
      {
        ...peers,
        '@react-navigation/native': '*',
        'react-native-pager-view': '*',
      },
    ],
    '@react-navigation/native-stack': [
      '7.0.0-rc.15',
      {
        ...peers,
        '@react-navigation/native': '*',
      },
    ],
    '@react-navigation/routers': '7.0.0-rc.6',
    '@react-navigation/stack': [
      '7.0.0-rc.15',
      {
        ...peers,
        '@react-navigation/native': '*',
        'react-native-gesture-handler': '*',
      },
    ],
    'react-native-drawer-layout': [
      '4.0.0-rc.7',
      {
        'react-native-gesture-handler': '*',
        'react-native-reanimated': '*',
      },
    ],
    'react-native-tab-view': [
      '4.0.0-rc.7',
      {
        'react-native-pager-view': '*',
      },
    ],
  },
};

export default function Pre({
  children,
  'data-name': name,
  'data-snack': snack,
  'data-version': version,
  'data-dependencies': deps,
  'data-lang': lang,
  ...rest
}) {
  const { colorMode } = useColorMode();
  const child = React.Children.only(children);

  // Handle diffs with language
  if (child.props.className === 'language-diff' && lang) {
    const code = child.props.children;

    if (typeof code !== 'string') {
      throw new Error(
        'Diff code must be a string, but received ' + typeof code
      );
    }

    // Replace + and - with magic comments
    // Need to add following in docusaurus.config.js
    // themeConfig.prims.magicComments: [
    //   { className: 'code-block-diff-add-line', line: 'diff-add' },
    //   { className: 'code-block-diff-remove-line', line: 'diff-remove' },
    // ],
    const content = code
      .split('\n')
      .map((line) => {
        if (line.startsWith('+ ')) {
          return `// diff-add\n${line.replace(/^\+ /, '')}`;
        } else if (line.startsWith('- ')) {
          return `// diff-remove\n${line.replace(/^- /, '')}`;
        }

        return line;
      })
      .join('\n');

    children = React.cloneElement(child, {
      className: `language-${lang}`,
      children: content,
    });

    return <MDXPre {...rest}>{children}</MDXPre>;
  }

  // Handle snack demos
  if (snack) {
    const code = child.props.children;

    if (typeof code !== 'string') {
      throw new Error(
        'Playground code must be a string, but received ' + typeof code
      );
    }

    const dependencies = deps
      ? Object.fromEntries(
          deps.split(',').map((entry) => {
            let prefix = '';

            // Handles scoped packages, e.g. @expo/vector-icons
            if (entry.startsWith('@')) {
              prefix = '@';
              entry = entry.slice(1);
            }

            const [name, version = '*'] = entry.split('@');

            return [prefix + name, version];
          })
        )
      : {};

    Object.assign(
      dependencies,
      Object.entries(versions[version]).reduce((acc, [key, value]) => {
        if (code.includes(`from '${key}'`)) {
          if (Array.isArray(value)) {
            const [v, peers] = value;

            Object.assign(acc, {
              [key]: v,
              ...Object.fromEntries(
                Object.entries(peers).map(([key, value]) => {
                  const meta = versions[version][key];

                  if (value === '*' && meta) {
                    const v = Array.isArray(meta) ? meta[0] : meta;

                    return [key, v];
                  }

                  return [key, value];
                })
              ),
            });
          } else {
            acc[key] = value;
          }
        }

        return acc;
      }, {})
    );

    const url = new URL('https://snack.expo.dev');

    if (name) {
      url.searchParams.set('name', name);
    }

    url.searchParams.set(
      'code',
      // Remove highlight and codeblock focus comments from code
      code
        .split('\n')
        .filter((line) =>
          [
            '// highlight-start',
            '// highlight-end',
            '// highlight-next-line',
            '// codeblock-focus-start',
            '// codeblock-focus-end',
          ].every((comment) => line.trim() !== comment)
        )
        .join('\n')
        // Use expo/vector-icons instead of react-native-vector-icons for snack
        .replace(
          /import (.*) from 'react-native-vector-icons\/(.*)'/g,
          'import $1 from "@expo/vector-icons/$2"'
        )
    );

    url.searchParams.set(
      'dependencies',
      Object.entries(dependencies)
        .map(([key, value]) => `${key}@${value}`)
        .join(',')
    );

    url.searchParams.set('platform', 'web');
    url.searchParams.set('supportedPlatforms', 'ios,android,web');
    url.searchParams.set('preview', 'true');
    url.searchParams.set('hideQueryParams', 'true');

    if (snack === 'embed') {
      url.searchParams.set('theme', colorMode === 'dark' ? 'dark' : 'light');
      url.pathname = 'embedded';

      return (
        <iframe
          src={url.href}
          style={{
            width: '100%',
            height: 660,
            border: 'none',
            border: '1px solid var(--ifm-table-border-color)',
            borderRadius: 'var(--ifm-global-radius)',
            overflow: 'hidden',
          }}
        />
      );
    }

    // Only keep the lines between `// codeblock-focus-{start,end} comments
    if (code.includes('// codeblock-focus-start')) {
      const lines = code.split('\n');

      let content = '';
      let focus = false;
      let indent;

      for (const line of lines) {
        if (line.trim() === '// codeblock-focus-start') {
          focus = true;
        } else if (line.trim() === '// codeblock-focus-end') {
          focus = false;
        } else if (focus) {
          if (indent === undefined) {
            indent = line.match(/^\s*/)[0];
          }

          if (line.startsWith(indent)) {
            content += line.slice(indent.length) + '\n';
          } else {
            content += line + '\n';
          }
        }
      }

      children = React.Children.map(children, (c) =>
        React.cloneElement(c, { children: content })
      );
    }

    return (
      <>
        <MDXPre {...rest}>{children}</MDXPre>
        <a
          className="snack-sample-link"
          data-snack="true"
          target="_blank"
          href={url.href}
        >
          Try on <b>Snack</b>
          <svg
            width="14px"
            height="14px"
            viewBox="0 0 16 16"
            style={{ verticalAlign: '-1px' }}
          >
            <g stroke="none" strokeWidth="1" fill="none">
              <polyline
                stroke="currentColor"
                points="8.5 0.5 15.5 0.5 15.5 7.5"
              />
              <path d="M8,8 L15.0710678,0.928932188" stroke="currentColor" />
              <polyline
                stroke="currentColor"
                points="9.06944444 3.5 1.5 3.5 1.5 14.5 12.5 14.5 12.5 6.93055556"
              />
            </g>
          </svg>
        </a>
      </>
    );
  }

  return <MDXPre {...rest}>{children}</MDXPre>;
}
