import npmToYarn from 'npm-to-yarn';
import { Parser } from 'acorn';
import acornJsx from 'acorn-jsx';
import type { Node } from 'unist';

const parser = Parser.extend(acornJsx());

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

type RemarkNpm2YarnOptions = {
  sync?: boolean;
  converters?: PackageManager[];
};

type MdxJsxAttributeValueExpression = {
  type: 'mdxJsxAttributeValueExpression';
  value: string;
  data: {
    estree: unknown;
  };
};

type MdxJsxAttribute = {
  type: 'mdxJsxAttribute';
  name: string;
  value?: string | MdxJsxAttributeValueExpression;
};

type MdxNode = Node & {
  value?: string;
  lang?: string;
  meta?: string;
  name?: string;
  attributes?: MdxJsxAttribute[];
  children?: MdxNode[];
  data?: {
    estree?: unknown;
  };
};

type CodeNode = MdxNode & {
  type: 'code';
  value: string;
};

type CreateTabItemOptions = {
  code: string;
  node: MdxNode;
  pm: PackageManager;
};

const defaultConverters: PackageManager[] = ['yarn', 'pnpm', 'bun'];

function parseExpression(code: string): unknown {
  return parser.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
}

function isCodeNode(node: MdxNode): node is CodeNode {
  return node.type === 'code' && typeof node.value === 'string';
}

function createLabelWithIcon(
  pm: PackageManager
): MdxJsxAttributeValueExpression {
  const value = `<><img className="pm-icon" src="/assets/pm/${pm}.svg" alt="" />${pm}</>`;

  return {
    type: 'mdxJsxAttributeValueExpression',
    value,
    data: { estree: parseExpression(value) },
  };
}

function createTabItem({ code, node, pm }: CreateTabItemOptions): MdxNode {
  return {
    type: 'mdxJsxFlowElement',
    name: 'TabItem',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'value', value: pm },
      {
        type: 'mdxJsxAttribute',
        name: 'label',
        value: createLabelWithIcon(pm),
      },
    ],
    children: [{ type: node.type, lang: node.lang, value: code }],
  };
}

function transformNode(
  node: CodeNode,
  sync: boolean,
  converters: PackageManager[]
): MdxNode {
  const npmCode = node.value;

  return {
    type: 'mdxJsxFlowElement',
    name: 'Tabs',
    attributes: sync
      ? [{ type: 'mdxJsxAttribute', name: 'groupId', value: 'npm2yarn' }]
      : [],
    children: [
      createTabItem({ code: npmCode, node, pm: 'npm' }),
      ...converters.map((pm) =>
        createTabItem({ code: npmToYarn(npmCode, pm), node, pm })
      ),
    ],
  };
}

function createImportNode(): MdxNode {
  const value =
    "import Tabs from '@theme/Tabs'\nimport TabItem from '@theme/TabItem'";

  return {
    type: 'mdxjsEsm',
    value,
    data: { estree: parseExpression(value) },
  };
}

export default function remarkNpm2Yarn(options: RemarkNpm2YarnOptions = {}) {
  const { sync = false, converters = defaultConverters } = options;

  return async (root: MdxNode) => {
    const { visit } = await import('unist-util-visit');

    let transformed = false;
    let alreadyImported = false;

    visit(root, (node: MdxNode) => {
      if (
        node.type === 'mdxjsEsm' &&
        typeof node.value === 'string' &&
        node.value.includes('@theme/Tabs')
      ) {
        alreadyImported = true;
      }

      if (Array.isArray(node.children)) {
        let i = 0;
        while (i < node.children.length) {
          const child = node.children[i];
          if (isCodeNode(child) && child.meta === 'npm2yarn') {
            node.children[i] = transformNode(child, sync, converters);
            transformed = true;
          }
          i++;
        }
      }
    });

    if (transformed && !alreadyImported && Array.isArray(root.children)) {
      root.children.unshift(createImportNode());
    }
  };
}
