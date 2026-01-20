import * as React from 'react';

const indigo = '#3F51B5';
const teal = '#009688';
const pink = '#E91E63';

type Route = {
  name: string;
  params?: Record<string, unknown>;
  state?: {
    routes: Route[];
  };
};

type Props = {
  routes: Route[];
  root?: boolean;
};

export default function RouteMap({ routes, root = true }: Props) {
  return (
    <div
      style={{
        ...styles.container,
        ...(root
          ? { overflowX: 'auto', padding: 'calc(var(--ifm-pre-padding) / 2)' }
          : null),
      }}
    >
      {routes.map((route, i) => (
        <div key={route.name} style={styles.item}>
          <div style={styles.route}>
            <div style={styles.name}>
              {route.name}
              {root ? null : i === 0 ? (
                <div style={styles.connectLeft} />
              ) : (
                <div style={styles.connectUpLeft} />
              )}
            </div>
            {route.params ? (
              <div style={styles.paramsContainer}>
                <table style={styles.params}>
                  <tbody>
                    {Object.entries(route.params).map(([key, value]) => (
                      <tr key={key} style={styles.row}>
                        <td style={styles.key}>{key}</td>
                        <td style={styles.colon}>:</td>
                        <td style={styles.value}>{JSON.stringify(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.connectUp} />
              </div>
            ) : null}
          </div>
          {route.state ? (
            <RouteMap routes={route.state.routes} root={false} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  route: {
    minWidth: 160,
  },
  name: {
    backgroundColor: indigo,
    color: 'white',
    fontSize: 'var(--ifm-code-font-size)',
    margin: 'calc(var(--ifm-pre-padding) / 2)',
    padding: 'calc(var(--ifm-pre-padding) / 2) var(--ifm-pre-padding)',
    borderRadius: 4,
    position: 'relative',
    textAlign: 'center',
  },
  paramsContainer: {
    position: 'relative',
  },
  params: {
    backgroundColor: 'rgba(3, 169, 244, 0.08)',
    border: `1px solid ${indigo}`,
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: 'var(--ifm-code-font-size)',
    margin: 'var(--ifm-pre-padding) calc(var(--ifm-pre-padding) / 2)',
    borderRadius: 4,
    padding: 3,
    width: 'auto',
    overflow: 'visible',
  },
  row: {
    border: 0,
    background: 'none',
  },
  key: {
    color: teal,
    border: 0,
    padding: '4px 6px',
    textAlign: 'right',
  },
  value: {
    color: pink,
    padding: '4px 6px',
    border: 0,
  },
  colon: {
    color: 'inherit',
    opacity: 0.3,
    border: 0,
    padding: 0,
  },
  connectLeft: {
    position: 'absolute',
    width: 16,
    height: 1,
    backgroundColor: indigo,
    right: '100%',
    top: '50%',
  },
  connectUpLeft: {
    position: 'absolute',
    width: 9,
    height: 52,
    border: `1px solid ${indigo}`,
    borderRadius: '0 0 0 3px',
    borderRight: 0,
    borderTop: 0,
    right: '100%',
    bottom: '50%',
  },
  connectUp: {
    position: 'absolute',
    width: 1,
    height: 16,
    backgroundColor: indigo,
    right: '50%',
    bottom: '100%',
  },
};
