import * as React from 'react';
import { getStateFromPath } from '@react-navigation/core';
import escape from 'escape-html';
import Editor from 'react-simple-code-editor';
import Highlight, { defaultProps } from 'prism-react-renderer';
import github from 'prism-react-renderer/themes/github';
import dracula from 'prism-react-renderer/themes/dracula';
import ThemeContext from '@theme/ThemeContext';
import RouteMap from './RouteMap';

const parse = (value) => eval(`(function() { return ${value}; }())`);

export default function LinkingTester() {
  const { isDarkTheme } = React.useContext(ThemeContext);
  const theme = isDarkTheme ? dracula : github;

  const [rawConfig, setRawConfig] = React.useState(
    `{
  screens: {
    Home: {
      initialRouteName: 'Feed',
      screens: {
        Profile: {
          path: 'user/:id',
          parse: {
            id: id => id.replace(/^@/, ''),
          },
          screens: {
            Settings: 'edit',
          },
        },
      },
    },
    NoMatch: '*',
  }
}`
  );

  const [path, setPath] = React.useState('/user/@vergil/edit');
  const [config, setConfig] = React.useState(() => parse(rawConfig));
  const [showJSON, setShowJSON] = React.useState(false);

  let state;

  try {
    state = getStateFromPath(path.replace(/(^\w+:|^)\/\//, ''), config);
  } catch (e) {
    // Ignore
  }

  return (
    <>
      <input
        type="text"
        value={path}
        placeholder="Type a path, e.g. /user/@vergil/edit"
        onChange={(e) => setPath(e.target.value)}
        style={{ ...styles.code, ...styles.input }}
      />
      <Editor
        value={rawConfig}
        placeholder="Type linking config"
        onValueChange={(value) => {
          setRawConfig(value);

          try {
            const config = parse(value);

            setConfig(config);
          } catch (e) {
            // Ignore
          }
        }}
        highlight={(code) => (
          <Highlight {...defaultProps} code={code} theme={theme} language="jsx">
            {({ tokens, getLineProps, getTokenProps }) =>
              tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))
            }
          </Highlight>
        )}
        padding={16}
        style={{ ...styles.code, ...styles.editor }}
      />
      <div style={styles.preview}>
        <button
          type="button"
          style={styles.button}
          onClick={() => setShowJSON((show) => !show)}
        >
          {showJSON ? 'Chart' : 'JSON'}
        </button>
        {showJSON ? (
          <Highlight
            {...defaultProps}
            code={JSON.stringify(state, null, 2) || ''}
            theme={theme}
            language="json"
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={{ ...style, ...styles.json }}>
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        ) : state ? (
          <RouteMap routes={state.routes} />
        ) : <p style={styles.error}>Failed to parse the path. Make sure that the path matches the patterns specified in the config.</p>}
      </div>
    </>
  );
}

const styles = {
  code: {
    display: 'block',
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: 'var(--ifm-code-font-size)',
    borderRadius: 'var(--ifm-pre-border-radius)',
    margin: 'var(--ifm-spacing-vertical) 0',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: 'var(--ifm-pre-padding)',
    backgroundColor: 'transparent',
    color: 'inherit',
    border: '1px solid var(--ifm-contents-border-color)',
  },
  editor: {
    border: '1px solid var(--ifm-contents-border-color)',
  },
  preview: {
    position: 'relative',
    border: '1px solid var(--ifm-contents-border-color)',
    borderRadius: 'var(--ifm-pre-border-radius)',
    minHeight: 70
  },
  json: {
    margin: 0,
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: 'var(--ifm-code-font-size)',
    borderRadius: 'var(--ifm-pre-border-radius)',
    padding: 'var(--ifm-pre-padding)',
    minHeight: 70
  },
  button: {
    position: 'absolute',
    right: 0,
    border: '1px solid var(--ifm-contents-border-color)',
    borderRadius: '0 var(--ifm-pre-border-radius)',
    borderRight: 0,
    borderTop: 0,
    cursor: 'pointer',
    display: 'block',
    fontSize: 12,
    padding: '4px 8px',
    color: 'inherit',
    background: 'none',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
  },
  error: {
    margin: 24,
    color: '#A12027'
  }
};
