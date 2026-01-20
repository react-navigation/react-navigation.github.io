import type { PrismTheme } from 'prism-react-renderer';

const theme: PrismTheme = {
  plain: {
    color: 'hsl(212, 13%, 16%)',
    backgroundColor: 'hsl(256, 12%, 98%)',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: 'hsl(212, 9%, 47%)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'hsl(212, 13%, 16%)',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['tag', 'operator', 'number'],
      style: {
        color: 'hsl(212, 92%, 35%)',
      },
    },
    {
      types: ['property', 'function'],
      style: {
        color: 'hsl(256, 54%, 50%)',
      },
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: {
        color: 'hsl(26, 100%, 29%)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: 'hsl(212, 92%, 35%)',
      },
    },
    {
      types: [
        'boolean',
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'atrule',
      ],
      style: {
        color: 'hsl(356, 75%, 47%)',
      },
    },
    {
      types: ['placeholder', 'variable'],
      style: {
        color: 'hsl(26, 100%, 29%)',
      },
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through',
        color: 'hsl(356, 75%, 47%)',
      },
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline',
        color: 'hsl(139, 66%, 29%)',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['important'],
      style: {
        color: 'hsl(356, 75%, 47%)',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: 'hsl(26, 100%, 29%)',
      },
    },
    {
      types: ['builtin', 'char', 'constant'],
      style: {
        color: 'hsl(212, 92%, 35%)',
      },
    },
    {
      types: ['symbol'],
      style: {
        color: 'hsl(139, 66%, 29%)',
      },
    },
    {
      types: ['template-string', 'string'],
      style: {
        color: 'hsl(139, 66%, 32%)',
      },
    },
  ],
};

export default theme;
