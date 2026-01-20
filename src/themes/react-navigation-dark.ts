import type { PrismTheme } from 'prism-react-renderer';

const theme: PrismTheme = {
  plain: {
    color: 'hsl(212, 45%, 90%)',
    backgroundColor: 'hsl(240, 5%, 10%)',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: 'hsl(212, 9%, 58%)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'hsl(212, 45%, 90%)',
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
        color: 'hsl(212, 100%, 74%)',
      },
    },
    {
      types: ['property', 'function'],
      style: {
        color: 'hsl(256, 54%, 70%)',
      },
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: {
        color: 'hsl(29, 100%, 67%)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: 'hsl(212, 100%, 74%)',
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
        color: 'hsl(4, 100%, 72%)',
      },
    },
    {
      types: ['placeholder', 'variable'],
      style: {
        color: 'hsl(29, 100%, 67%)',
      },
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through',
        color: 'hsl(4, 100%, 72%)',
      },
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline',
        color: 'hsl(139, 66%, 66%)',
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
        color: 'hsl(4, 100%, 72%)',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: 'hsl(29, 100%, 67%)',
      },
    },
    {
      types: ['builtin', 'char', 'constant'],
      style: {
        color: 'hsl(212, 100%, 74%)',
      },
    },
    {
      types: ['symbol'],
      style: {
        color: 'hsl(139, 66%, 66%)',
      },
    },
    {
      types: ['template-string', 'string'],
      style: {
        color: 'hsl(139, 66%, 66%)',
      },
    },
  ],
};

export default theme;
