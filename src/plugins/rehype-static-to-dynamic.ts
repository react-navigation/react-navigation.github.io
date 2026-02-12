import * as t from '@babel/types';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import * as prettier from 'prettier/standalone';
import * as prettierBabel from 'prettier/plugins/babel';
import * as prettierEstree from 'prettier/plugins/estree';
import * as recast from 'recast';
import * as babelParser from 'recast/parsers/babel-ts.js';
import { visit } from 'unist-util-visit';
import { fileURLToPath } from 'url';
import type { Element, Root, Text } from 'hast';
import type { Parent } from 'unist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prettierConfig = JSON.parse(
  readFileSync(join(__dirname, '..', '..', '.prettierrc.json'), 'utf-8')
);

type TrackedComment = {
  value: string;
  type: t.Comment['type'];
};

export type RehypeStaticToDynamicRoot = Root;

export type RehypeStaticToDynamicElement = Element;

export type RehypeStaticToDynamicText = Text;

export type RehypeStaticToDynamicTreeChild = Root['children'][number];

export type RehypeStaticToDynamicElementChild = Element['children'][number];

type CommentWithMarkers = t.Comment & {
  leading?: boolean;
  trailing?: boolean;
};

type CommentedNode = t.Node & {
  comments?: CommentWithMarkers[];
};

type CommentTrackingEntry = {
  screenName?: string;
  navigatorProp?: string;
  screenConfigProperty?: string;
  leadingComments: TrackedComment[];
  trailingComments: TrackedComment[];
};

type NavigatorInfo = {
  componentName: string;
  type: string;
  config: t.ObjectExpression;
  comments: CommentWithMarkers[];
  trailingComments: CommentWithMarkers[];
  index: number;
};

type PropInfo = {
  key: string;
  value: t.Expression;
};

type ScreenConfig = {
  component: string;
  screenProps: Record<string, t.Expression>;
};

type GroupConfig = {
  screens: Record<string, ScreenConfig>;
  groupProps: Record<string, PropInfo>;
};

type ParsedNavigatorConfig = {
  screens: Record<string, ScreenConfig>;
  groups: Record<string, GroupConfig>;
  navigatorProps: Record<string, PropInfo>;
};

type Replacement = {
  parent: Parent;
  index: number;
  tabsElement: Element;
};

type CommentArrayKey = 'comments' | 'leadingComments' | 'trailingComments';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOwnProperty<T extends object, K extends PropertyKey>(
  value: T,
  key: K
): value is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isCommentWithMarkers(value: unknown): value is CommentWithMarkers {
  return isRecord(value) && hasOwnProperty(value, 'type');
}

function getCommentArray(
  node: t.Node,
  key: CommentArrayKey
): CommentWithMarkers[] {
  if (!hasOwnProperty(node, key)) {
    return [];
  }

  const value = node[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isCommentWithMarkers);
}

function toTrackedComments(comments: CommentWithMarkers[]): TrackedComment[] {
  return comments.map((comment) => ({
    value: comment.value,
    type: comment.type,
  }));
}

function getMeta(data: Element['data'] | undefined): string | undefined {
  if (!isRecord(data) || !hasOwnProperty(data, 'meta')) {
    return undefined;
  }

  return typeof data.meta === 'string' ? data.meta : undefined;
}

function getDataObject(
  data: Element['data'] | undefined
): Record<string, unknown> {
  return isRecord(data) ? data : {};
}

function getFirstChildElement(node: Element): Element | null {
  const [firstChild] = node.children;
  return firstChild?.type === 'element' ? firstChild : null;
}

function getTextNodeValue(node: Element): string | null {
  const [firstChild] = node.children;
  return firstChild?.type === 'text' ? firstChild.value : null;
}

/**
 * Plugin to automatically convert static config examples to dynamic config
 *
 * This plugin finds code blocks with the 'static2dynamic' meta tag and generates
 * corresponding dynamic configuration examples wrapped in tabs.
 */
export default function rehypeStaticToDynamic() {
  return async (tree: Root) => {
    const promises: Promise<void>[] = [];
    const replacements: Replacement[] = [];

    visit(tree, 'element', (node: Element, index, parent) => {
      // Look for code blocks with static2dynamic in meta
      if (
        node.tagName === 'pre' &&
        node.children?.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = getFirstChildElement(node);

        if (!codeNode) {
          return;
        }

        const meta = getMeta(codeNode.data);

        // Check if meta contains 'static2dynamic'
        if (!meta || !meta.includes('static2dynamic')) {
          return;
        }

        // Extract code from the code block
        const code = getTextNodeValue(codeNode);

        if (!code) {
          throw new Error(
            'rehype-static-to-dynamic: Unable to extract code from code block'
          );
        }

        // Queue async conversion
        const promise = convertStaticToDynamic(code).then((dynamicCode) => {
          const tabsElement = createTabsWithBothConfigs(
            code,
            dynamicCode,
            node
          );
          if (!parent || typeof index !== 'number') return;
          replacements.push({ parent, index, tabsElement });
        });
        promises.push(promise);
      }
    });

    // Wait for all conversions to complete
    await Promise.all(promises);

    // Apply all replacements
    replacements.forEach(({ parent, index, tabsElement }) => {
      parent.children[index] = tabsElement;
    });
  };
}

/**
 * Convert static config code to dynamic config code.
 *
 * Strategy:
 * 1. Parse code to AST with comment attachment
 * 2. First pass: Transform imports and collect navigator information
 *    - Remove createStaticNavigation and createXScreen imports
 *    - Add NavigationContainer import if needed
 *    - Collect navigator declarations and their comments
 * 3. Second pass: Transform navigator declarations
 *    - Create const Stack = createStackNavigator() declarations
 *    - Create function components with JSX (Stack.Navigator, Stack.Screen)
 *    - Track comments for later injection
 * 4. Format with Prettier
 * 5. Post-process: Inject comments into formatted code
 *    - Comments are injected as strings since Prettier may move/remove AST comments
 */
async function convertStaticToDynamic(code: string): Promise<string> {
  // Parse the code into AST using recast with comment attachment enabled
  const ast = recast.parse(code, {
    parser: {
      parse(source, options) {
        return babelParser.parse(source, {
          ...options,
          tokens: true,
          attachComment: true,
        });
      },
    },
  });

  let navigatorInfos: NavigatorInfo[] = [];
  let staticNavigationIndices: number[] = [];

  // Track comments throughout the transformation
  // We collect comments from the AST during transformation, then inject them
  // after Prettier formatting (since Prettier may reformat/move AST comments)
  const commentTracking = new Set<CommentTrackingEntry>();

  // First pass: Collect navigator info and transform imports
  recast.visit(ast, {
    visitImportDeclaration(path: any) {
      const source = path.node.source.value;

      // Transform @react-navigation/native imports
      if (source === '@react-navigation/native') {
        const specifiers = path.node.specifiers;

        let hasNavigationContainer = false;
        let hasCreateStaticNavigation = false;

        specifiers.forEach((spec) => {
          if (!t.isImportSpecifier(spec)) return;

          const importedName = getPropertyKeyName(spec.imported);

          if (importedName === 'NavigationContainer') {
            hasNavigationContainer = true;
          }
          if (importedName === 'createStaticNavigation') {
            hasCreateStaticNavigation = true;
          }
        });

        // Remove createStaticNavigation and add NavigationContainer if needed
        if (hasCreateStaticNavigation) {
          path.node.specifiers = specifiers.filter((spec) => {
            if (!t.isImportSpecifier(spec)) return true;
            return (
              getPropertyKeyName(spec.imported) !== 'createStaticNavigation'
            );
          });

          if (!hasNavigationContainer) {
            path.node.specifiers.push(
              t.importSpecifier(
                t.identifier('NavigationContainer'),
                t.identifier('NavigationContainer')
              )
            );
          }
        }
      }

      // Remove createXScreen imports from navigator packages
      // e.g., createNativeStackScreen from @react-navigation/native-stack
      if (source.startsWith('@react-navigation/')) {
        path.node.specifiers = path.node.specifiers.filter((spec) => {
          if (t.isImportSpecifier(spec)) {
            const importedName = getPropertyKeyName(spec.imported);
            // Remove imports that match createXScreen pattern
            return !(
              importedName.startsWith('create') &&
              importedName.endsWith('Screen')
            );
          }
          return true;
        });
      }

      this.traverse(path);
    },

    visitProgram(path: any) {
      // Find declarations by index to avoid scope issues
      path.node.body.forEach((node, index) => {
        if (t.isVariableDeclaration(node)) {
          node.declarations.forEach((declarator) => {
            if (
              t.isCallExpression(declarator.init) &&
              t.isIdentifier(declarator.init.callee) &&
              declarator.init.callee.name.startsWith('create') &&
              declarator.init.callee.name.endsWith('Navigator') &&
              declarator.init.arguments.length > 0 &&
              t.isObjectExpression(declarator.init.arguments[0])
            ) {
              if (!t.isIdentifier(declarator.id)) {
                return;
              }

              const navigatorVariable = declarator.id.name; // e.g., "MyStack"
              const navigatorType = declarator.init.callee.name; // e.g., "createStackNavigator"
              const config = declarator.init.arguments[0];

              navigatorInfos.push({
                componentName: navigatorVariable, // Keep original name for the component
                type: navigatorType,
                config: config,
                // Store leading/trailing comments to preserve codeblock-focus
                comments: getCommentArray(node, 'comments'),
                trailingComments: getCommentArray(node, 'trailingComments'),
                index: index,
              });
            }

            // Find createStaticNavigation usage
            if (
              t.isCallExpression(declarator.init) &&
              t.isIdentifier(declarator.init.callee) &&
              declarator.init.callee.name === 'createStaticNavigation'
            ) {
              staticNavigationIndices.push(index);
            }
          });
        }
      });

      this.traverse(path);
    },

    visitJSXElement(path: any) {
      // Find <Navigation /> (created by createStaticNavigation)
      if (
        t.isJSXIdentifier(path.node.openingElement.name) &&
        path.node.openingElement.name.name === 'Navigation' &&
        path.node.children.length === 0 &&
        navigatorInfos.length > 0
      ) {
        // Preserve any props passed to Navigation
        const navigationProps = path.node.openingElement.attributes;

        // Use the last navigator (which is passed to createStaticNavigation)
        const mainNavigator = navigatorInfos[navigatorInfos.length - 1];

        // Replace with <NavigationContainer><MyStack /></NavigationContainer>
        // Pass the props from Navigation to NavigationContainer
        const newElement = t.jsxElement(
          t.jsxOpeningElement(
            t.jsxIdentifier('NavigationContainer'),
            navigationProps
          ),
          t.jsxClosingElement(t.jsxIdentifier('NavigationContainer')),
          [
            t.jsxText('\n  '),
            t.jsxElement(
              t.jsxOpeningElement(
                t.jsxIdentifier(mainNavigator.componentName),
                [],
                true
              ),
              null,
              [],
              true
            ),
            t.jsxText('\n'),
          ],
          false
        );

        path.replace(newElement);
      }

      this.traverse(path);
    },
  });

  // Second pass: Transform navigator declarations into const + function components
  // Example: const MyStack = createStackNavigator({ screens: {...} })
  //   becomes: const Stack = createStackNavigator();
  //            function MyStack() { return <Stack.Navigator>...</Stack.Navigator> }
  if (navigatorInfos.length > 0) {
    const replacements = [];
    const navigatorConstNames = new Map(); // Track usage of navigator constant names

    navigatorInfos.forEach((navigatorInfo) => {
      const { componentName, type, config, comments, trailingComments, index } =
        navigatorInfo;

      const baseNavigatorConstName = deriveNavigatorConstName(type);
      const navigatorConstName = getUniqueNavigatorConstName(
        baseNavigatorConstName,
        navigatorConstNames
      );

      // Parse the config object
      const parsedConfig = parseNavigatorConfig(config, commentTracking);

      // Create: const Stack = createStackNavigator();
      const navigatorConstDeclaration: CommentedNode = t.variableDeclaration(
        'const',
        [
          t.variableDeclarator(
            t.identifier(navigatorConstName),
            t.callExpression(t.identifier(type), [])
          ),
        ]
      );

      // Create the navigator component function (e.g., function MyStack() {...})
      const navigatorComponent: CommentedNode = createNavigatorComponent(
        componentName, // function name: MyStack
        navigatorConstName, // Stack.Navigator, Stack.Screen
        parsedConfig
      );

      // Preserve all comments from the original node
      if (comments.length > 0) {
        // Separate leading and trailing comments based on recast markers
        const leadingComments: CommentWithMarkers[] = [];
        const trailingCommentsFromNode: CommentWithMarkers[] = [];

        comments.forEach((comment) => {
          if (comment.trailing) {
            trailingCommentsFromNode.push(comment);
          } else {
            leadingComments.push(comment);
          }
        });

        attachCommentsToNode(navigatorConstDeclaration, leadingComments, false);
        attachCommentsToNode(
          navigatorComponent,
          trailingCommentsFromNode,
          true
        );
      }

      // Attach any additional trailing comments
      if (trailingComments && trailingComments.length > 0) {
        attachCommentsToNode(navigatorComponent, trailingComments, true);
      }

      // Store the replacement info
      replacements.push({
        index: index,
        navigatorConstDeclaration,
        navigatorComponent,
      });
    });

    // Replace declarations in reverse order to maintain correct indices
    replacements.sort((a, b) => b.index - a.index);

    const programBody = ast.program.body;

    replacements.forEach(
      ({ index, navigatorConstDeclaration, navigatorComponent }) => {
        // Replace 1 node with 2 nodes
        programBody.splice(
          index,
          1,
          navigatorConstDeclaration,
          navigatorComponent
        );
      }
    );

    // Adjust indices for createStaticNavigation declarations
    // Account for the fact that we replaced each navigator (1 node) with 2 nodes
    // So indices after each replacement need to be shifted by 1
    staticNavigationIndices = staticNavigationIndices.map((idx) => {
      let shift = 0;
      replacements.forEach(({ index }) => {
        if (idx > index) shift++;
      });
      return idx + shift;
    });
  }

  // Remove createStaticNavigation declarations (in reverse to maintain correct indices)
  staticNavigationIndices.sort((a, b) => b - a);
  staticNavigationIndices.forEach((index) => {
    ast.program.body.splice(index, 1);
  });

  // Generate code from AST using recast
  const output = recast.print(ast, {
    tabWidth: 2,
    quote: 'single',
    trailingComma: true,
  });

  // Format with prettier first
  let formattedCode = await prettier.format(output.code, {
    ...prettierConfig,
    parser: 'babel',
    singleQuote: true,
    plugins: [prettierBabel, prettierEstree],
  });

  // Remove trailing newline that prettier adds
  formattedCode = formattedCode.trimEnd();

  // Post-process: Inject tracked comments into the formatted code
  // We do this after Prettier to ensure comments aren't moved/removed during formatting
  // Comments are injected by searching for patterns in the string output
  commentTracking.forEach((commentObj) => {
    const {
      screenName,
      leadingComments,
      trailingComments,
      navigatorProp,
      screenConfigProperty,
    } = commentObj;

    // Handle navigator property comments (e.g., screenOptions on Navigator)
    if (navigatorProp) {
      const lines = formattedCode.split('\n');

      // Find the property line within a Navigator element context
      const propLineIndex = findPropertyLine(
        lines,
        (line) =>
          line.includes(navigatorProp) &&
          (line.includes('=') || line.includes(':')),
        (line) => line.includes('.Navigator'),
        5 // Search 5 lines before/after for context
      );

      if (propLineIndex !== -1) {
        const indent = getIndentation(lines[propLineIndex]);

        // Inject leading comments before the property
        const updatedLineIndex = injectComments(
          lines,
          leadingComments,
          propLineIndex,
          indent,
          true // JSX context
        );

        // Find where the property value ends (}} for objects)
        const closingIndex = findPropertyClosingLine(lines, updatedLineIndex);

        // Inject trailing comments after the closing
        injectComments(lines, trailingComments, closingIndex + 1, indent, true);

        formattedCode = lines.join('\n');
      }
      return;
    }

    // Handle screen config property comments (options, listeners, etc.)
    if (screenConfigProperty) {
      const lines = formattedCode.split('\n');

      // Map 'screen' property to 'component' in JSX
      const jsxPropName =
        screenConfigProperty === 'screen' ? 'component' : screenConfigProperty;

      // Find the property line within the correct Screen element
      const propLineIndex = findPropertyLine(
        lines,
        (line) =>
          line.includes(`${jsxPropName}=`) || line.includes(`${jsxPropName}:{`),
        (line) => lineMatchesScreenName(line, screenName),
        10 // Search 10 lines before for screen context
      );

      if (propLineIndex !== -1) {
        const indent = getIndentation(lines[propLineIndex], '        ');

        // Inject leading comments before the property
        const updatedLineIndex = injectComments(
          lines,
          leadingComments,
          propLineIndex,
          indent
        );

        // Find where the property value ends (}} or })})
        const closingIndex = findPropertyClosingLine(lines, updatedLineIndex);

        // Inject trailing comments after the closing
        injectComments(lines, trailingComments, closingIndex + 1, indent);

        formattedCode = lines.join('\n');
      }
      return;
    }

    // Process leading comments for screen elements (highlight-next-line, highlight-start)
    if (leadingComments.length > 0) {
      const lines = formattedCode.split('\n');
      const screenLineIndex = findScreenElementLine(lines, screenName);

      if (screenLineIndex !== -1) {
        const indent = getIndentation(lines[screenLineIndex]);
        injectComments(lines, leadingComments, screenLineIndex, indent, true);
        formattedCode = lines.join('\n');
      }
    }

    // Process trailing comments for screen elements (highlight-end)
    if (trailingComments.length > 0) {
      const lines = formattedCode.split('\n');
      const screenLineIndex = findScreenClosingLine(lines, screenName);

      if (screenLineIndex !== -1) {
        const indent = getIndentation(lines[screenLineIndex]);
        // Inject after the closing tag
        injectComments(
          lines,
          trailingComments,
          screenLineIndex + 1,
          indent,
          true
        );
        formattedCode = lines.join('\n');
      }
    }
  });

  return formattedCode;
}

function getPropertyKeyName(key: t.Expression | t.PrivateName): string {
  if (t.isIdentifier(key)) return key.name;
  if (t.isStringLiteral(key)) return key.value;
  if (t.isNumericLiteral(key)) return String(key.value);
  return '';
}

function getObjectPropertyValue(
  prop: t.ObjectProperty | t.ObjectMethod
): t.Expression | null {
  if (t.isObjectProperty(prop)) {
    return t.isExpression(prop.value) ? prop.value : null;
  }

  return t.functionExpression(
    null,
    prop.params,
    prop.body,
    prop.generator,
    prop.async
  );
}

/**
 * Extract screen config from a screen value node.
 * Handles both direct object expressions and createXScreen function calls.
 */
function extractScreenConfig(screenValue: t.Node): t.Node {
  // Handle createXScreen function calls
  // e.g., createNativeStackScreen({ screen: ProfileScreen, ... })
  if (
    t.isCallExpression(screenValue) &&
    t.isIdentifier(screenValue.callee) &&
    screenValue.callee.name.startsWith('create') &&
    screenValue.callee.name.endsWith('Screen') &&
    screenValue.arguments.length > 0 &&
    t.isObjectExpression(screenValue.arguments[0])
  ) {
    // Extract the object argument from the createXScreen call
    return screenValue.arguments[0];
  }

  // Return the value as-is for other cases
  return screenValue;
}

/**
 * Track comments on screen config properties (options, screen, listeners, etc.)
 */
function trackScreenConfigComments(
  screenValue: t.Node,
  screenName: string,
  commentTracking: Set<CommentTrackingEntry>
) {
  const configObject = extractScreenConfig(screenValue);

  if (t.isObjectExpression(configObject)) {
    configObject.properties.forEach((configProp) => {
      if (
        t.isObjectProperty(configProp) &&
        (getCommentArray(configProp, 'leadingComments').length > 0 ||
          getCommentArray(configProp, 'trailingComments').length > 0)
      ) {
        const propName = getPropertyKeyName(configProp.key);
        commentTracking.add({
          screenName,
          screenConfigProperty: propName,
          leadingComments: toTrackedComments(
            getCommentArray(configProp, 'leadingComments')
          ),
          trailingComments: toTrackedComments(
            getCommentArray(configProp, 'trailingComments')
          ),
        });
      }
    });
  }
}

/**
 * Track comments on screen elements themselves
 */
function trackScreenComments(
  screenProp: t.ObjectProperty,
  screenName: string,
  commentTracking: Set<CommentTrackingEntry>
) {
  if (
    getCommentArray(screenProp, 'leadingComments').length > 0 ||
    getCommentArray(screenProp, 'trailingComments').length > 0
  ) {
    commentTracking.add({
      screenName,
      leadingComments: toTrackedComments(
        getCommentArray(screenProp, 'leadingComments')
      ),
      trailingComments: toTrackedComments(
        getCommentArray(screenProp, 'trailingComments')
      ),
    });
  }
}

/**
 * Find the line index of a Screen element's opening tag.
 * Handles both single-line and multi-line Screen elements.
 */
function findScreenElementLine(lines: string[], screenName: string) {
  for (let i = 0; i < lines.length; i++) {
    // Check if line contains Screen opening tag with the name attribute
    if (
      lines[i].includes('<') &&
      lines[i].includes('.Screen') &&
      lineMatchesScreenName(lines[i], screenName)
    ) {
      return i;
    }

    // For multiline Screen elements, check if opening tag is on this line
    // and name attribute is on a subsequent line
    if (lines[i].includes('<') && lines[i].includes('.Screen')) {
      for (let j = i; j < Math.min(i + 5, lines.length); j++) {
        if (lineMatchesScreenName(lines[j], screenName)) {
          return i; // Return opening tag line, not name line
        }
      }
    }
  }
  return -1;
}

/**
 * Find the line index of a Screen element's closing tag.
 * Looks for either self-closing /> or closing </X.Screen> tag.
 */
function findScreenClosingLine(lines: string[], screenName: string) {
  for (let i = 0; i < lines.length; i++) {
    if (
      (lines[i].includes('.Screen') && lines[i].includes('/>')) ||
      (lines[i].includes('.Screen') && lines[i].includes('</'))
    ) {
      // Verify this is the correct screen by checking backward for the name
      for (let j = Math.max(0, i - 10); j <= i; j++) {
        if (lineMatchesScreenName(lines[j], screenName)) {
          return i;
        }
      }
    }
  }
  return -1;
}

/**
 * Format a comment for injection into code
 */
function formatComment(
  comment: TrackedComment,
  indent: string,
  isJSXContext = false
) {
  const commentValue = comment.value.trim();
  if (comment.type === 'CommentLine') {
    return `${indent}// ${commentValue}`;
  }
  // Block comments in JSX need to be wrapped in braces
  return isJSXContext
    ? `${indent}{/* ${commentValue} */}`
    : `${indent}/* ${commentValue} */`;
}

/**
 * Inject comments into lines array at specified position
 */
function injectComments(
  lines: string[],
  comments: TrackedComment[],
  lineIndex: number,
  indent: string,
  isJSXContext = false
) {
  let currentIndex = lineIndex;
  comments.forEach((comment) => {
    const commentText = formatComment(comment, indent, isJSXContext);
    lines.splice(currentIndex, 0, commentText);
    currentIndex++;
  });
  return currentIndex;
}

/**
 * Check if a line contains a screen name attribute (with either quote style)
 */
function lineMatchesScreenName(line: string, screenName: string) {
  return (
    line.includes(`name='${screenName}'`) ||
    line.includes(`name="${screenName}"`)
  );
}

/**
 * Extract indentation from a line
 */
function getIndentation(line: string, defaultIndent = '      ') {
  return line.match(/^(\s*)/)?.[1] || defaultIndent;
}

/**
 * Derive navigator constant name from navigator type string.
 * Examples:
 * - "createStackNavigator" -> "Stack"
 * - "createNativeStackNavigator" -> "Stack"
 * - "createBottomTabNavigator" -> "Tab"
 * - "createMaterialTopTabNavigator" -> "Tab"
 */
function deriveNavigatorConstName(navigatorType: string) {
  // Remove "create" prefix and "Navigator" suffix
  const withoutCreate = navigatorType.replace(/^create/, '');
  const withoutNavigator = withoutCreate.replace(/Navigator$/, '');
  // Extract the last capitalized word (e.g., "NativeStack" -> "Stack", "MaterialTopTab" -> "Tab")
  const match = withoutNavigator.match(/([A-Z][a-z]+)$/);
  return match ? match[1] : withoutNavigator;
}

/**
 * Generate unique navigator constant name by adding suffix if needed.
 * Second occurrence gets 'A', third gets 'B', etc.
 */
function getUniqueNavigatorConstName(
  baseNavigatorConstName: string,
  navigatorConstNames: Map<string, number>
) {
  const currentCount = navigatorConstNames.get(baseNavigatorConstName) || 0;
  navigatorConstNames.set(baseNavigatorConstName, currentCount + 1);

  if (currentCount === 0) {
    return baseNavigatorConstName;
  }
  // Add suffix: A for second occurrence, B for third, etc.
  const suffix = String.fromCharCode(65 + currentCount - 1); // 65 is 'A'
  return baseNavigatorConstName + suffix;
}

/**
 * Attach comments to AST nodes with proper leading/trailing markers
 */
function attachCommentsToNode(
  node: CommentedNode,
  comments: CommentWithMarkers[],
  isTrailing = false
) {
  if (comments.length === 0) return;

  comments.forEach((c) => {
    c.leading = !isTrailing;
    c.trailing = isTrailing;
  });
  node.comments = [...(node.comments || []), ...comments];
}

/**
 * Find a property line within a context (searches lines before for context marker)
 */
function findPropertyLine(
  lines: string[],
  propMatcher: (line: string) => boolean,
  contextMatcher: (line: string) => boolean,
  searchRange: number
) {
  for (let i = 0; i < lines.length; i++) {
    if (propMatcher(lines[i])) {
      // Check if this is within the right context by searching lines before only
      // We only look backwards because name= comes before component= in the output JSX
      const startIdx = Math.max(0, i - searchRange);

      for (let j = startIdx; j <= i; j++) {
        if (contextMatcher(lines[j])) {
          return i;
        }
      }
    }
  }
  return -1;
}

/**
 * Find the closing line for a JSX property value (looks for }} or })})
 */
function findPropertyClosingLine(
  lines: string[],
  startLine: number,
  maxSearchLines = 10
) {
  for (
    let i = startLine;
    i < Math.min(startLine + maxSearchLines, lines.length);
    i++
  ) {
    const line = lines[i];
    // Look for closing patterns but not the Screen element closing
    if (line.includes('}}') && !line.includes('/>')) {
      return i;
    }
    // Also check for arrow function returning object: })}
    if (line.includes('})}')) {
      return i;
    }
  }
  return startLine;
}

/**
 * Create a JSX member expression (e.g., Stack.Navigator, Stack.Screen)
 */
function createJsxMemberExpression(componentName: string, memberName: string) {
  return t.jsxMemberExpression(
    t.jsxIdentifier(componentName),
    t.jsxIdentifier(memberName)
  );
}

/**
 * Create JSX attributes from propInfo objects
 */
function createJsxAttributesFromProps(propsObject: Record<string, PropInfo>) {
  return Object.values(propsObject).map((propInfo) => {
    if (t.isStringLiteral(propInfo.value)) {
      return t.jsxAttribute(
        t.jsxIdentifier(propInfo.key),
        t.stringLiteral(propInfo.value.value)
      );
    }
    return t.jsxAttribute(
      t.jsxIdentifier(propInfo.key),
      t.jsxExpressionContainer(propInfo.value)
    );
  });
}

/**
 * Create a Screen JSX element
 */
function createScreenElement(
  componentName: string,
  screenName: string,
  screenConfig: ScreenConfig
) {
  const screenProps = [
    t.jsxAttribute(t.jsxIdentifier('name'), t.stringLiteral(screenName)),
    t.jsxAttribute(
      t.jsxIdentifier('component'),
      t.jsxExpressionContainer(t.identifier(screenConfig.component))
    ),
  ];

  // Add all screen-level props
  Object.entries(screenConfig.screenProps).forEach(([key, value]) => {
    screenProps.push(
      t.jsxAttribute(t.jsxIdentifier(key), t.jsxExpressionContainer(value))
    );
  });

  return t.jsxElement(
    t.jsxOpeningElement(
      createJsxMemberExpression(componentName, 'Screen'),
      screenProps,
      true
    ),
    null,
    [],
    true
  );
}

/**
 * Parse a screen value and return component and screenProps.
 * Handles identifiers, object expressions, and createXScreen calls.
 */
function parseScreenValue(screenValue: t.Node): ScreenConfig | null {
  if (t.isIdentifier(screenValue)) {
    // Simple screen: Home: HomeScreen
    return {
      component: screenValue.name,
      screenProps: {},
    };
  }

  // Extract config from createXScreen calls if present
  const configNode = extractScreenConfig(screenValue);

  if (t.isObjectExpression(configNode)) {
    // Screen with config: Home: { screen: HomeScreen, options: {...}, listeners: {...} }
    let component: string | null = null;
    const screenProps = {};

    configNode.properties.forEach((screenConfigProp) => {
      if (
        !t.isObjectProperty(screenConfigProp) &&
        !t.isObjectMethod(screenConfigProp)
      ) {
        return;
      }

      const configKey = getPropertyKeyName(screenConfigProp.key);

      if (
        configKey === 'screen' &&
        t.isObjectProperty(screenConfigProp) &&
        t.isIdentifier(screenConfigProp.value)
      ) {
        component = screenConfigProp.value.name;
        return;
      }

      // Store all other props (options, listeners, getId, linking, etc.)
      // But skip 'linking' as it's only for static config
      if (configKey !== 'linking') {
        const propValue = getObjectPropertyValue(screenConfigProp);

        if (propValue) {
          screenProps[configKey] = propValue;
        }
      }
    });

    if (!component) {
      return null;
    }

    return { component, screenProps };
  }

  return null;
}

/**
 * Parse navigator configuration object.
 * Extracts screens, groups, and navigator-level properties.
 * Also tracks comments for later injection into the dynamic code.
 */
function parseNavigatorConfig(
  configNode: t.ObjectExpression,
  commentTracking: Set<CommentTrackingEntry>
): ParsedNavigatorConfig {
  const result: ParsedNavigatorConfig = {
    screens: {}, // Standalone screens (not in groups)
    groups: {}, // Screen groups with their own screens and props
    navigatorProps: {}, // Navigator-level props (screenOptions, initialRouteName, etc.)
  };

  if (!t.isObjectExpression(configNode)) {
    return result;
  }

  // Get all properties from the navigator config object
  const props = configNode.properties.filter(
    (prop): prop is t.ObjectProperty | t.ObjectMethod =>
      t.isObjectProperty(prop) || t.isObjectMethod(prop)
  );

  props.forEach((prop, index) => {
    const keyName = getPropertyKeyName(prop.key);
    const propValue = getObjectPropertyValue(prop);

    // Track comments on navigator-level properties (but not on screens/groups)
    if (keyName !== 'screens' && keyName !== 'groups') {
      const leadingComments = toTrackedComments(
        getCommentArray(prop, 'leadingComments')
      );

      // Collect trailing comments from both the property and its value
      const trailingComments = [
        ...toTrackedComments(getCommentArray(prop, 'trailingComments')),
        ...(t.isObjectProperty(prop)
          ? toTrackedComments(getCommentArray(prop.value, 'trailingComments'))
          : []),
      ];

      // Heuristic: Check if the next property has leading comments that are actually
      // trailing comments for this property (detected by -end or end suffix)
      // This handles cases where Babel attaches multiline trailing comments as leading
      const nextProp = props[index + 1];

      if (nextProp) {
        getCommentArray(nextProp, 'leadingComments').forEach((c) => {
          // Only treat as trailing if the comment ends with -end or similar markers
          if (
            c.value.trim().endsWith('-end') ||
            c.value.trim().endsWith('end')
          ) {
            trailingComments.push({
              value: c.value,
              type: c.type,
            });
          }
        });
      }

      if (leadingComments.length > 0 || trailingComments.length > 0) {
        const commentObj = {
          navigatorProp: keyName,
          leadingComments,
          trailingComments,
        };
        commentTracking.add(commentObj);
      }
    }

    // Parse groups object (e.g., groups: { modal: { screens: {...}, screenOptions: {...} } })
    if (
      keyName === 'groups' &&
      t.isObjectProperty(prop) &&
      t.isObjectExpression(prop.value)
    ) {
      // Parse groups object
      prop.value.properties.forEach((groupProp) => {
        if (!t.isObjectProperty(groupProp)) return;

        const groupKey = getPropertyKeyName(groupProp.key);
        const groupValue = groupProp.value;

        if (t.isObjectExpression(groupValue)) {
          const groupConfig = {
            screens: {},
            groupProps: {},
          };

          groupValue.properties.forEach((groupConfigProp) => {
            if (
              !t.isObjectProperty(groupConfigProp) &&
              !t.isObjectMethod(groupConfigProp)
            ) {
              return;
            }

            const configKey = getPropertyKeyName(groupConfigProp.key);
            const groupPropValue = getObjectPropertyValue(groupConfigProp);

            if (
              configKey === 'screens' &&
              t.isObjectProperty(groupConfigProp) &&
              t.isObjectExpression(groupConfigProp.value)
            ) {
              // Parse screens within the group
              groupConfigProp.value.properties.forEach((screenProp) => {
                if (!t.isObjectProperty(screenProp)) return;

                const screenName = getPropertyKeyName(screenProp.key);
                const screenValue = screenProp.value;

                // Track comments on any property inside the screen config
                trackScreenConfigComments(
                  screenValue,
                  screenName,
                  commentTracking
                );

                // Track comments on the screen element itself
                trackScreenComments(screenProp, screenName, commentTracking);

                const parsed = parseScreenValue(screenValue);

                if (parsed) {
                  groupConfig.screens[screenName] = parsed;
                }
              });
            } else {
              // Store other group-level props (screenOptions, screenLayout, etc.)
              if (groupPropValue) {
                groupConfig.groupProps[configKey] = {
                  key: configKey,
                  value: groupPropValue,
                };
              }
            }
          });

          result.groups[groupKey] = groupConfig;
        }
      });
      // Parse top-level screens object (e.g., screens: { Home: HomeScreen, Profile: {...} })
    } else if (
      keyName === 'screens' &&
      t.isObjectProperty(prop) &&
      t.isObjectExpression(prop.value)
    ) {
      // Parse screens object
      prop.value.properties.forEach((screenProp) => {
        if (!t.isObjectProperty(screenProp)) return;

        const screenName = getPropertyKeyName(screenProp.key);
        const screenValue = screenProp.value;

        // Track comments on any property inside the screen config
        trackScreenConfigComments(screenValue, screenName, commentTracking);

        // Track comments on the screen element itself
        trackScreenComments(screenProp, screenName, commentTracking);

        const parsed = parseScreenValue(screenValue);

        if (parsed) {
          result.screens[screenName] = parsed;
        }
      });
    } else {
      // Store all other navigator-level props (screenOptions, initialRouteName, etc.)
      // Keep track of whether the value is a string literal to determine JSX attribute format
      if (propValue) {
        result.navigatorProps[keyName] = {
          key: keyName,
          value: propValue,
        };
      }
    }
  });

  return result;
}

/**
 * Create navigator component function
 */
function createNavigatorComponent(
  functionName: string,
  componentName: string,
  config: ParsedNavigatorConfig
) {
  // Add all navigator-level props dynamically
  const navigatorProps = createJsxAttributesFromProps(config.navigatorProps);

  // Create screen elements
  const screenElements = [];

  // Handle groups if they exist
  if (Object.keys(config.groups).length > 0) {
    Object.entries(config.groups).forEach(([groupKey, groupConfig]) => {
      const groupProps = [
        t.jsxAttribute(
          t.jsxIdentifier('navigationKey'),
          t.stringLiteral(groupKey)
        ),
        ...createJsxAttributesFromProps(groupConfig.groupProps),
      ];

      // Create screens for this group
      const groupScreenElements = [];

      Object.entries(groupConfig.screens).forEach(
        ([screenName, screenConfig]) => {
          groupScreenElements.push(t.jsxText('\n    '));
          groupScreenElements.push(
            createScreenElement(componentName, screenName, screenConfig)
          );
        }
      );

      groupScreenElements.push(t.jsxText('\n  '));

      // Create the Group element
      const groupElement = t.jsxElement(
        t.jsxOpeningElement(
          createJsxMemberExpression(componentName, 'Group'),
          groupProps
        ),
        t.jsxClosingElement(createJsxMemberExpression(componentName, 'Group')),
        groupScreenElements,
        false
      );

      screenElements.push(t.jsxText('\n  '));
      screenElements.push(groupElement);
    });
  }

  // Handle standalone screens (not in groups)
  Object.entries(config.screens).forEach(([screenName, screenConfig]) => {
    screenElements.push(t.jsxText('\n  '));
    screenElements.push(
      createScreenElement(componentName, screenName, screenConfig)
    );
  });

  screenElements.push(t.jsxText('\n'));

  // Create Navigator element
  const navigatorElement = t.jsxElement(
    t.jsxOpeningElement(
      createJsxMemberExpression(componentName, 'Navigator'),
      navigatorProps
    ),
    t.jsxClosingElement(createJsxMemberExpression(componentName, 'Navigator')),
    screenElements,
    false
  );

  // Create return statement with parentheses for multiline JSX
  const returnStatement = t.returnStatement(navigatorElement);

  // Create function declaration
  const functionDeclaration = t.functionDeclaration(
    t.identifier(functionName),
    [],
    t.blockStatement([returnStatement])
  );

  return functionDeclaration;
}

/**
 * Create a TabItem element with code block
 */
function createTabItem(
  value: string,
  label: string,
  code: string,
  codeNode: Element,
  originalCodeBlock: Element,
  cleanData: Record<string, unknown>,
  isDefault = false
): Element {
  const children: Element['children'] = [
    { type: 'text', value: '\n\n' },
    {
      type: 'element',
      tagName: 'pre',
      properties: originalCodeBlock.properties || {},
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: codeNode.properties || {},
          data: cleanData,
          children: [{ type: 'text', value: code }],
        },
      ],
    },
    { type: 'text', value: '\n\n' },
  ];

  return {
    type: 'element',
    tagName: 'TabItem',
    properties: {
      value,
      label,
      ...(isDefault && { default: true }),
    },
    children,
  };
}

/**
 * Create a Tabs element with both static and dynamic TabItems
 */
function createTabsWithBothConfigs(
  staticCode: string,
  dynamicCode: string,
  originalCodeBlock: Element
): Element {
  const codeNode = getFirstChildElement(originalCodeBlock);

  if (!codeNode) {
    throw new Error(
      'rehype-static-to-dynamic: Expected code element in code block'
    );
  }

  // Remove 'static2dynamic' from meta for the actual code blocks
  const rawMeta = getMeta(codeNode.data) ?? '';
  const cleanMeta = rawMeta.replace(/\bstatic2dynamic\b\s*/g, '').trim();
  const cleanData = { ...getDataObject(codeNode.data), meta: cleanMeta };

  const tabItems = [
    { value: 'static', label: 'Static', code: staticCode, isDefault: true },
    { value: 'dynamic', label: 'Dynamic', code: dynamicCode, isDefault: false },
  ];

  const children: Element['children'] = [];

  tabItems.forEach((item) => {
    children.push({ type: 'text', value: '\n' });
    children.push(
      createTabItem(
        item.value,
        item.label,
        item.code,
        codeNode,
        originalCodeBlock,
        cleanData,
        item.isDefault
      )
    );
  });

  children.push({ type: 'text', value: '\n' });

  return {
    type: 'element',
    tagName: 'Tabs',
    properties: {
      groupId: 'config',
      queryString: 'config',
    },
    children,
  };
}
