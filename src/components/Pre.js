import { useActiveVersion } from '@docusaurus/plugin-content-docs/client';
import { useColorMode } from '@docusaurus/theme-common';
import { usePluginData } from '@docusaurus/useGlobalData';
import MDXPre from '@theme-original/MDXComponents/Pre';
import React from 'react';

const COMMENTS = {
  HIGHLIGHT_START: '// highlight-start',
  HIGHLIGHT_END: '// highlight-end',
  HIGHLIGHT_NEXT_LINE: '// highlight-next-line',
  FOCUS_START: '// codeblock-focus-start',
  FOCUS_END: '// codeblock-focus-end',
};

export default function Pre({
  children,
  'data-name': name,
  'data-snack': snack,
  'data-dependencies': deps,
  'data-lang': lang,
  ...rest
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const { colorMode } = useColorMode();
  const activeVersion = useActiveVersion();
  const { versions } = usePluginData('react-navigation-versions');

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
        if (line.startsWith('+')) {
          return `// diff-add\n${line.replace(/^\+\s?/, '')}`;
        } else if (line.startsWith('-')) {
          return `// diff-remove\n${line.replace(/^-\s?/, '')}`;
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

  const buttons = [];

  if (child.props.children.includes?.(COMMENTS.FOCUS_START)) {
    buttons.push(
      <button
        key="expand-button"
        className="code-block-expand"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg
          width="14px"
          height="14px"
          viewBox="0 0 16 16"
          style={{ verticalAlign: '-2px', marginRight: '4px' }}
        >
          <g stroke="currentColor" fill="currentColor">
            <polyline
              points={isExpanded ? '5 0 8 3 11 0' : '5 3 8 0 11 3'}
              strokeWidth="1.5"
              fill="none"
            />
            <line x1="8" y1="1" x2="8" y2="5" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="1" stroke="none" />
            <circle cx="4" cy="8" r="1" stroke="none" />
            <circle cx="12" cy="8" r="1" stroke="none" />
            <line x1="8" y1="11" x2="8" y2="15" strokeWidth="1.5" />
            <polyline
              points={isExpanded ? '5 16 8 13 11 16' : '5 13 8 16 11 13'}
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        </svg>
        {isExpanded ? 'Show relevant lines' : 'Show full code'}
      </button>
    );
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

    const version = activeVersion?.name;

    if (version == null || versions[version] == null) {
      throw new Error(`Invalid version: ${version}`);
    }

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
          Object.values(COMMENTS).every((comment) => line.trim() !== comment)
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

    buttons.push(
      <a
        key="snack-link"
        className="code-block-snack-link"
        data-snack="true"
        target="_blank"
        href={url.href}
      >
        <span>
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
        </span>
      </a>
    );
  }

  return (
    <>
      <FocusedCodeBlock expanded={isExpanded} {...rest}>
        {children}
      </FocusedCodeBlock>
      {buttons.length ? (
        <div className="code-block-footer">{buttons}</div>
      ) : null}
    </>
  );
}

function FocusedCodeBlock({ children, expanded, ...rest }) {
  const child = React.Children.only(children);
  const code = child.props.children;

  // Only keep the lines between `// codeblock-focus-{start,end}` comments
  if (code.includes(COMMENTS.FOCUS_START)) {
    let content = '';

    if (expanded) {
      content = code
        .split('\n')
        .filter((line) =>
          [COMMENTS.FOCUS_START, COMMENTS.FOCUS_END].every(
            (comment) => line.trim() !== comment
          )
        )
        .join('\n');
    } else {
      const lines = code.split('\n');

      let focus = false;
      let indent;

      for (const line of lines) {
        if (line.trim() === COMMENTS.FOCUS_START) {
          focus = true;
        } else if (line.trim() === COMMENTS.FOCUS_END) {
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
    }

    children = React.Children.map(children, (c) =>
      React.cloneElement(c, { children: content })
    );
  }

  return <MDXPre {...rest}>{children}</MDXPre>;
}
