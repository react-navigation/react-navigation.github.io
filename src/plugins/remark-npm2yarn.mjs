import npmToYarn from 'npm-to-yarn';
import { Parser } from 'acorn';
import acornJsx from 'acorn-jsx';

const parser = Parser.extend(acornJsx());

function parseExpression(code) {
  return parser.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
}

function createLabelWithIcon(pm) {
  const value = `<><img className="pm-icon" src="/assets/pm/${pm}.svg" alt="" />${pm}</>`;

  return {
    type: 'mdxJsxAttributeValueExpression',
    value,
    data: { estree: parseExpression(value) },
  };
}

function createTabItem({ code, node, pm }) {
  return {
    type: 'mdxJsxFlowElement',
    name: 'TabItem',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'value', value: pm },
      { type: 'mdxJsxAttribute', name: 'label', value: createLabelWithIcon(pm) },
    ],
    children: [{ type: node.type, lang: node.lang, value: code }],
  };
}

function transformNode(node, sync, converters) {
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

function createImportNode() {
  const value =
    "import Tabs from '@theme/Tabs'\nimport TabItem from '@theme/TabItem'";

  return {
    type: 'mdxjsEsm',
    value,
    data: { estree: parseExpression(value) },
  };
}

export default function remarkNpm2Yarn(options = {}) {
  const { sync = false, converters = ['yarn', 'pnpm', 'bun'] } = options;

  return async (root) => {
    const { visit } = await import('unist-util-visit');

    let transformed = false;
    let alreadyImported = false;

    visit(root, (node) => {
      if (node.type === 'mdxjsEsm' && node.value.includes('@theme/Tabs')) {
        alreadyImported = true;
      }

      if (Array.isArray(node.children)) {
        let i = 0;
        while (i < node.children.length) {
          const child = node.children[i];
          if (child.type === 'code' && child.meta === 'npm2yarn') {
            node.children[i] = transformNode(child, sync, converters);
            transformed = true;
          }
          i++;
        }
      }
    });

    if (transformed && !alreadyImported) {
      root.children.unshift(createImportNode());
    }
  };
}
