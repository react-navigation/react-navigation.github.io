import * as t from '@babel/types';
import * as recast from 'recast';
import { visit } from 'unist-util-visit';

/**
 * Plugin to automatically convert static config examples to dynamic config
 *
 * This plugin finds code blocks with the 'static2dynamic' meta tag and generates
 * corresponding dynamic configuration examples wrapped in tabs.
 */
export default function rehypeStaticToDynamic() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Look for code blocks with static2dynamic in meta
      if (
        node.tagName === 'pre' &&
        node.children?.length === 1 &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0];
        const meta = codeNode.data?.meta;

        // Check if meta contains 'static2dynamic'
        if (!meta || !meta.includes('static2dynamic')) {
          return;
        }

        // Extract code from the code block
        const code = codeNode?.children?.[0]?.value;

        if (!code) {
          throw new Error(
            'rehype-static-to-dynamic: Unable to extract code from code block'
          );
        }

        const dynamicCode = convertStaticToDynamic(code);
        const tabsElement = createTabsWithBothConfigs(code, dynamicCode, node);

        // Replace the current pre element with the tabs
        parent.children[index] = tabsElement;
      }
    });
  };
}

/**
 * Convert static config code to dynamic config code
 */
function convertStaticToDynamic(code) {
  // Parse the code into AST using recast
  const ast = recast.parse(code, {
    parser: require('recast/parsers/babel-ts'),
  });

  let navigatorInfos = [];
  let staticNavigationIndices = [];

  // First pass: collect information and transform imports
  recast.visit(ast, {
    visitImportDeclaration(path) {
      const source = path.node.source.value;

      // Transform @react-navigation/native imports
      if (source === '@react-navigation/native') {
        const specifiers = path.node.specifiers;

        let hasNavigationContainer = false;
        let hasCreateStaticNavigation = false;

        specifiers.forEach((spec) => {
          if (
            t.isImportSpecifier(spec) &&
            spec.imported.name === 'NavigationContainer'
          ) {
            hasNavigationContainer = true;
          }
          if (
            t.isImportSpecifier(spec) &&
            spec.imported.name === 'createStaticNavigation'
          ) {
            hasCreateStaticNavigation = true;
          }
        });

        // Remove createStaticNavigation and add NavigationContainer if needed
        if (hasCreateStaticNavigation) {
          path.node.specifiers = specifiers.filter(
            (spec) =>
              !(
                t.isImportSpecifier(spec) &&
                spec.imported.name === 'createStaticNavigation'
              )
          );

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

      this.traverse(path);
    },

    visitProgram(path) {
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
              const navigatorVariable = declarator.id.name; // e.g., "MyStack"
              const navigatorType = declarator.init.callee.name; // e.g., "createStackNavigator"
              const config = declarator.init.arguments[0];

              navigatorInfos.push({
                componentName: navigatorVariable, // Keep original name for the component
                type: navigatorType,
                config: config,
                // Store leading/trailing comments to preserve codeblock-focus
                leadingComments: node.comments || [],
                trailingComments: node.trailingComments || [],
                originalNode: node, // Keep reference to original node
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

    visitJSXElement(path) {
      // Find <Navigation /> (created by createStaticNavigation)
      if (
        t.isJSXIdentifier(path.node.openingElement.name) &&
        path.node.openingElement.name.name === 'Navigation' &&
        path.node.children.length === 0 &&
        navigatorInfos.length > 0
      ) {
        // Preserve any props passed to Navigation
        const navigationProps = path.node.openingElement.attributes || [];

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

  // Second pass: manually transform the AST body
  // Process all navigators
  if (navigatorInfos.length > 0) {
    const replacements = [];
    const navigatorConstNames = new Map(); // Track usage of navigator constant names

    navigatorInfos.forEach((navigatorInfo) => {
      const {
        componentName,
        type,
        config,
        leadingComments,
        trailingComments,
        originalNode,
        index,
      } = navigatorInfo;

      // Extract navigator constant name from the type
      // Get the last word before "Navigator"
      // e.g., "createStackNavigator" -> "Stack"
      // e.g., "createNativeStackNavigator" -> "Stack"
      // e.g., "createBottomTabNavigator" -> "Tab"
      // e.g., "createMaterialTopTabNavigator" -> "Tab"
      const withoutCreate = type.replace(/^create/, ''); // "StackNavigator"
      const withoutNavigator = withoutCreate.replace(/Navigator$/, ''); // "Stack"
      // Find the last capitalized word (e.g., "NativeStack" -> "Stack", "MaterialTopTab" -> "Tab")
      const match = withoutNavigator.match(/([A-Z][a-z]+)$/);
      const baseNavigatorConstName = match ? match[1] : withoutNavigator;

      // Handle multiple navigators of the same type by adding suffixes (A, B, C, etc.)
      let navigatorConstName = baseNavigatorConstName;
      const currentCount = navigatorConstNames.get(baseNavigatorConstName) || 0;

      if (currentCount > 0) {
        // Add suffix: A for second occurrence, B for third, etc.
        const suffix = String.fromCharCode(65 + currentCount - 1); // 65 is 'A'
        navigatorConstName = baseNavigatorConstName + suffix;
      }

      navigatorConstNames.set(baseNavigatorConstName, currentCount + 1);

      // Parse the config object
      const parsedConfig = parseNavigatorConfig(config);

      // Create: const Stack = createStackNavigator();
      const navigatorConstDeclaration = t.variableDeclaration('const', [
        t.variableDeclarator(
          t.identifier(navigatorConstName),
          t.callExpression(t.identifier(type), [])
        ),
      ]);

      // Create the navigator component function (e.g., function MyStack() {...})
      const navigatorComponent = createNavigatorComponent(
        componentName, // function name: MyStack
        navigatorConstName, // Stack.Navigator, Stack.Screen
        parsedConfig
      );

      // Preserve all comments from the original node
      if (originalNode.comments && originalNode.comments.length > 0) {
        // Separate leading and trailing comments
        const leadingComments = [];
        const trailingCommentsFromNode = [];

        originalNode.comments.forEach((comment) => {
          // Recast marks comments with leading/trailing properties
          if (comment.trailing) {
            trailingCommentsFromNode.push(comment);
          } else {
            leadingComments.push(comment);
          }
        });

        // Attach leading comments to the const declaration
        if (leadingComments.length > 0) {
          // Mark as leading comments for proper placement
          leadingComments.forEach((c) => {
            c.leading = true;
            c.trailing = false;
          });
          navigatorConstDeclaration.comments = leadingComments;
        }

        // Attach trailing comments to the function component (after the function body)
        if (trailingCommentsFromNode.length > 0) {
          // Mark as trailing comments for proper placement
          trailingCommentsFromNode.forEach((c) => {
            c.leading = false;
            c.trailing = true;
          });
          navigatorComponent.comments = trailingCommentsFromNode;
        }
      }

      // Also check for trailingComments property
      if (trailingComments && trailingComments.length > 0) {
        trailingComments.forEach((c) => {
          c.leading = false;
          c.trailing = true;
        });
        navigatorComponent.comments = [
          ...(navigatorComponent.comments || []),
          ...trailingComments,
        ];
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
    let indexShift = 0;

    replacements.forEach(
      ({ index, navigatorConstDeclaration, navigatorComponent }) => {
        // Replace 1 node with 2 nodes
        programBody.splice(
          index,
          1,
          navigatorConstDeclaration,
          navigatorComponent
        );

        // Track the shift for adjusting staticNavigation indices
        indexShift++;
      }
    );

    // Adjust indices for createStaticNavigation declarations
    // Account for the fact that we replaced each navigator (1 node) with 2 nodes
    staticNavigationIndices = staticNavigationIndices.map((idx) => {
      let shift = 0;
      replacements.forEach(({ index }) => {
        if (idx > index) shift++;
      });
      return idx + shift;
    });
  }

  // Remove createStaticNavigation declarations (in reverse order to maintain indices)
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

  // Parse with Babel to verify syntax
  recast.parse(output.code, {
    parser: require('recast/parsers/babel-ts'),
  });

  return output.code;
}

/**
 * Parse navigator configuration object
 */
function parseNavigatorConfig(configNode) {
  const result = {
    screens: {},
    groups: {}, // Store groups
    navigatorProps: {}, // Store all navigator-level props
  };

  if (!t.isObjectExpression(configNode)) {
    return result;
  }

  configNode.properties.forEach((prop) => {
    if (!t.isObjectProperty(prop) && !t.isObjectMethod(prop)) {
      return;
    }

    const keyName = prop.key.name || prop.key.value;

    if (keyName === 'groups' && t.isObjectExpression(prop.value)) {
      // Parse groups object
      prop.value.properties.forEach((groupProp) => {
        if (!t.isObjectProperty(groupProp)) return;

        const groupKey = groupProp.key.name || groupProp.key.value;
        const groupValue = groupProp.value;

        if (t.isObjectExpression(groupValue)) {
          const groupConfig = {
            screens: {},
            groupProps: {},
          };

          groupValue.properties.forEach((groupConfigProp) => {
            if (!t.isObjectProperty(groupConfigProp)) return;

            const configKey =
              groupConfigProp.key.name || groupConfigProp.key.value;

            if (
              configKey === 'screens' &&
              t.isObjectExpression(groupConfigProp.value)
            ) {
              // Parse screens within the group
              groupConfigProp.value.properties.forEach((screenProp) => {
                if (!t.isObjectProperty(screenProp)) return;

                const screenName = screenProp.key.name || screenProp.key.value;
                const screenValue = screenProp.value;

                if (t.isIdentifier(screenValue)) {
                  groupConfig.screens[screenName] = {
                    component: screenValue.name,
                    screenProps: {},
                  };
                } else if (t.isObjectExpression(screenValue)) {
                  let component = null;
                  const screenProps = {};

                  screenValue.properties.forEach((screenConfigProp) => {
                    if (!t.isObjectProperty(screenConfigProp)) return;

                    const key =
                      screenConfigProp.key.name || screenConfigProp.key.value;

                    if (
                      key === 'screen' &&
                      t.isIdentifier(screenConfigProp.value)
                    ) {
                      component = screenConfigProp.value.name;
                    } else {
                      screenProps[key] = screenConfigProp.value;
                    }
                  });

                  groupConfig.screens[screenName] = { component, screenProps };
                }
              });
            } else {
              // Store other group-level props (screenOptions, screenLayout, etc.)
              groupConfig.groupProps[configKey] = {
                key: configKey,
                value: groupConfigProp.value,
                isStringLiteral: t.isStringLiteral(groupConfigProp.value),
              };
            }
          });

          result.groups[groupKey] = groupConfig;
        }
      });
    } else if (keyName === 'screens' && t.isObjectExpression(prop.value)) {
      // Parse screens object
      prop.value.properties.forEach((screenProp) => {
        if (!t.isObjectProperty(screenProp)) return;

        const screenName = screenProp.key.name || screenProp.key.value;
        const screenValue = screenProp.value;

        if (t.isIdentifier(screenValue)) {
          // Simple screen: Home: HomeScreen
          result.screens[screenName] = {
            component: screenValue.name,
            screenProps: {}, // No additional props
          };
        } else if (t.isObjectExpression(screenValue)) {
          // Screen with config: Home: { screen: HomeScreen, options: {...}, listeners: {...} }
          let component = null;
          const screenProps = {};

          screenValue.properties.forEach((screenConfigProp) => {
            if (!t.isObjectProperty(screenConfigProp)) return;

            const configKey =
              screenConfigProp.key.name || screenConfigProp.key.value;

            if (
              configKey === 'screen' &&
              t.isIdentifier(screenConfigProp.value)
            ) {
              component = screenConfigProp.value.name;
            } else {
              // Store all other props (options, listeners, getId, etc.)
              screenProps[configKey] = screenConfigProp.value;
            }
          });

          result.screens[screenName] = { component, screenProps };
        }
      });
    } else {
      // All other props are navigator-level props
      // Store both the key name and the AST node value
      result.navigatorProps[keyName] = {
        key: keyName,
        value: prop.value,
        isStringLiteral: t.isStringLiteral(prop.value),
      };
    }
  });

  return result;
}

/**
 * Create navigator component function
 */
function createNavigatorComponent(functionName, componentName, config) {
  const navigatorProps = [];

  // Add all navigator-level props dynamically
  Object.values(config.navigatorProps).forEach((propInfo) => {
    if (propInfo.isStringLiteral) {
      // String literals can be used directly as JSX string attributes
      navigatorProps.push(
        t.jsxAttribute(
          t.jsxIdentifier(propInfo.key),
          t.stringLiteral(propInfo.value.value)
        )
      );
    } else {
      // All other values need to be wrapped in JSX expression containers
      navigatorProps.push(
        t.jsxAttribute(
          t.jsxIdentifier(propInfo.key),
          t.jsxExpressionContainer(propInfo.value)
        )
      );
    }
  });

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
      ];

      // Add group-level props (screenOptions, screenLayout, etc.)
      Object.values(groupConfig.groupProps).forEach((propInfo) => {
        if (propInfo.isStringLiteral) {
          groupProps.push(
            t.jsxAttribute(
              t.jsxIdentifier(propInfo.key),
              t.stringLiteral(propInfo.value.value)
            )
          );
        } else {
          groupProps.push(
            t.jsxAttribute(
              t.jsxIdentifier(propInfo.key),
              t.jsxExpressionContainer(propInfo.value)
            )
          );
        }
      });

      // Create screens for this group
      const groupScreenElements = [];

      Object.entries(groupConfig.screens).forEach(
        ([screenName, screenConfig]) => {
          const screenProps = [
            t.jsxAttribute(
              t.jsxIdentifier('name'),
              t.stringLiteral(screenName)
            ),
            t.jsxAttribute(
              t.jsxIdentifier('component'),
              t.jsxExpressionContainer(t.identifier(screenConfig.component))
            ),
          ];

          // Add all screen-level props
          Object.entries(screenConfig.screenProps).forEach(([key, value]) => {
            screenProps.push(
              t.jsxAttribute(
                t.jsxIdentifier(key),
                t.jsxExpressionContainer(value)
              )
            );
          });

          const screenElement = t.jsxElement(
            t.jsxOpeningElement(
              t.jsxMemberExpression(
                t.jsxIdentifier(componentName),
                t.jsxIdentifier('Screen')
              ),
              screenProps,
              true
            ),
            null,
            [],
            true
          );

          groupScreenElements.push(t.jsxText('\n    '));
          groupScreenElements.push(screenElement);
        }
      );

      groupScreenElements.push(t.jsxText('\n  '));

      // Create the Group element
      const groupElement = t.jsxElement(
        t.jsxOpeningElement(
          t.jsxMemberExpression(
            t.jsxIdentifier(componentName),
            t.jsxIdentifier('Group')
          ),
          groupProps
        ),
        t.jsxClosingElement(
          t.jsxMemberExpression(
            t.jsxIdentifier(componentName),
            t.jsxIdentifier('Group')
          )
        ),
        groupScreenElements,
        false
      );

      screenElements.push(t.jsxText('\n  '));
      screenElements.push(groupElement);
    });
  }

  // Handle standalone screens (not in groups)
  Object.entries(config.screens).forEach(([screenName, screenConfig]) => {
    const screenProps = [
      t.jsxAttribute(t.jsxIdentifier('name'), t.stringLiteral(screenName)),
      t.jsxAttribute(
        t.jsxIdentifier('component'),
        t.jsxExpressionContainer(t.identifier(screenConfig.component))
      ),
    ];

    // Add all screen-level props dynamically (options, listeners, getId, etc.)
    Object.entries(screenConfig.screenProps).forEach(([key, value]) => {
      screenProps.push(
        t.jsxAttribute(t.jsxIdentifier(key), t.jsxExpressionContainer(value))
      );
    });

    const screenElement = t.jsxElement(
      t.jsxOpeningElement(
        t.jsxMemberExpression(
          t.jsxIdentifier(componentName),
          t.jsxIdentifier('Screen')
        ),
        screenProps,
        true
      ),
      null,
      [],
      true
    );

    screenElements.push(t.jsxText('\n  '));
    screenElements.push(screenElement);
  });

  screenElements.push(t.jsxText('\n'));

  // Create Navigator element
  const navigatorElement = t.jsxElement(
    t.jsxOpeningElement(
      t.jsxMemberExpression(
        t.jsxIdentifier(componentName),
        t.jsxIdentifier('Navigator')
      ),
      navigatorProps
    ),
    t.jsxClosingElement(
      t.jsxMemberExpression(
        t.jsxIdentifier(componentName),
        t.jsxIdentifier('Navigator')
      )
    ),
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
 * Create a Tabs element with both static and dynamic TabItems
 */
function createTabsWithBothConfigs(staticCode, dynamicCode, originalCodeBlock) {
  const codeNode = originalCodeBlock.children[0];

  // Remove 'static2dynamic' from meta for the actual code blocks
  const cleanMeta =
    codeNode.data?.meta?.replace(/\bstatic2dynamic\b\s*/g, '').trim() || '';
  const cleanData = { ...codeNode.data, meta: cleanMeta };

  return {
    type: 'element',
    tagName: 'Tabs',
    properties: {
      groupId: 'config',
      queryString: 'config',
    },
    children: [
      {
        type: 'text',
        value: '\n',
      },
      // Static TabItem
      {
        type: 'element',
        tagName: 'TabItem',
        properties: {
          value: 'static',
          label: 'Static',
          default: true,
        },
        children: [
          {
            type: 'text',
            value: '\n\n',
          },
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
                children: [
                  {
                    type: 'text',
                    value: staticCode,
                  },
                ],
              },
            ],
          },
          {
            type: 'text',
            value: '\n\n',
          },
        ],
      },
      {
        type: 'text',
        value: '\n',
      },
      // Dynamic TabItem
      {
        type: 'element',
        tagName: 'TabItem',
        properties: {
          value: 'dynamic',
          label: 'Dynamic',
        },
        children: [
          {
            type: 'text',
            value: '\n\n',
          },
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
                children: [
                  {
                    type: 'text',
                    value: dynamicCode,
                  },
                ],
              },
            ],
          },
          {
            type: 'text',
            value: '\n\n',
          },
        ],
      },
      {
        type: 'text',
        value: '\n',
      },
    ],
  };
}
