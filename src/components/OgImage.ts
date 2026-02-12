import * as React from 'react';

const h = React.createElement;

export default function OgImage({ logoBase64 }: { logoBase64: string }) {
  return h(
    'div',
    { style: styles.container },
    h('img', { src: logoBase64, ...styles.logo })
  );
}

const styles = {
  container: {
    background: '#1e2530',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
} as const;
