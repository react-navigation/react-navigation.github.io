import { useColorMode } from '@docusaurus/theme-common';
import { getActionFromState, getStateFromPath } from '@react-navigation/core';
import { Highlight, themes } from 'prism-react-renderer';
import * as React from 'react';
import Editor from 'react-simple-code-editor';
import RouteMap from './RouteMap';

const parse = (value) => eval(`(function() { return ${value}; }())`);

function Code({ code, theme, language }) {
  return (
    <Highlight code={code} theme={theme} language={language}>
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
  );
}

export default function LinkingTester() {
  const { colorMode } = useColorMode();
  const theme = colorMode === 'dark' ? themes.dracula : themes.github;

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
  const [pane, setPane] = React.useState('chart');

  let state, action;

  try {
    state = getStateFromPath(path.replace(/(^\w+:|^)\/\//, ''), config);
    action = getActionFromState(state, config);
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
          <Highlight code={code} theme={theme} language="jsx">
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
        <div style={styles.toggles}>
          <button
            type="button"
            style={styles.button}
            onClick={() => setPane('chart')}
          >
            Chart
          </button>
          <button
            type="button"
            style={styles.button}
            onClick={() => setPane('state')}
          >
            State
          </button>
          <button
            type="button"
            style={styles.button}
            onClick={() => setPane('action')}
          >
            Action
          </button>
        </div>
        {pane === 'state' ? (
          <Code
            theme={theme}
            code={JSON.stringify(state, null, 2) || ''}
            language="json"
          />
        ) : pane === 'action' ? (
          <Code
            theme={theme}
            code={JSON.stringify(action, null, 2) || ''}
            language="json"
          />
        ) : pane === 'chart' ? (
          state ? (
            <RouteMap routes={state.routes} />
          ) : (
            <p style={styles.error}>
              Failed to parse the path. Make sure that the path matches the
              patterns specified in the config.
            </p>
          )
        ) : null}
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
    minHeight: 70,
  },
  json: {
    margin: 0,
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: 'var(--ifm-code-font-size)',
    borderRadius: 'var(--ifm-pre-border-radius)',
    padding: 'var(--ifm-pre-padding)',
    minHeight: 70,
  },
  toggles: {
    position: 'absolute',
    flexDirection: 'row',
    right: 0,
    top: 0,
    borderBottom: '1px solid var(--ifm-contents-border-color)',
  },
  button: {
    border: 0,
    borderLeft: '1px solid var(--ifm-contents-border-color)',
    borderRadius: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 12,
    margin: 0,
    padding: '4px 8px',
    color: 'inherit',
    background: 'none',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
  },
  error: {
    margin: 24,
    color: '#A12027',
  },
};
