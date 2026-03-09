import React from 'react';

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }

  if (typeof node === 'number') {
    return String(node);
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractText(node.props.children);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('\n');
  }

  return '';
}

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function ThemeColors({ title, children }: Props) {
  const text = extractText(children);

  const colors: { name: string; value: string }[] = [];

  for (const line of text.split('\n')) {
    const match = line.trim().match(/^(\w+):\s*(.+)$/);

    if (match) {
      colors.push({ name: match[1], value: match[2] });
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: 'var(--ifm-spacing-horizontal)',
        marginBottom: 'var(--ifm-spacing-vertical)',
      }}
    >
      {colors.map(({ name, value }) => (
        <div key={name}>
          <div
            style={{
              width: '100%',
              aspectRatio: '2 / 1',
              backgroundColor: value,
              borderRadius: 'var(--ifm-global-radius)',
              boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.16)',
              marginBottom: 'calc(var(--ifm-spacing-vertical) / 2)',
            }}
          />
          <div
            style={{
              fontFamily: 'var(--ifm-font-family-monospace)',
              fontSize: '.675rem',
            }}
          >
            <div style={{ fontWeight: 'var(--ifm-heading-font-weight)' }}>
              {name}
            </div>
            <div style={{ opacity: 0.7 }}>{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
