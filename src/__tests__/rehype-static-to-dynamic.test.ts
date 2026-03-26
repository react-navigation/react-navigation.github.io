import dedent from 'dedent';
import assert from 'node:assert';
import { describe, test } from 'node:test';
import rehypeStaticToDynamic, {
  type RehypeStaticToDynamicElement as Element,
  type RehypeStaticToDynamicElementChild as ElementChild,
  type RehypeStaticToDynamicMdxEsm as MdxEsm,
  type RehypeStaticToDynamicRoot as Root,
  type RehypeStaticToDynamicText as Text,
  type RehypeStaticToDynamicTreeChild as TreeChild,
} from '../plugins/rehype-static-to-dynamic.ts';

/**
 * Helper function to create a test tree structure
 */
function createTestTree(code: string, extraChildren: MdxEsm[] = []): Root {
  const tree: Root = {
    type: 'root',
    children: [
      ...extraChildren,
      {
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: {},
            data: { meta: 'static2dynamic' },
            children: [
              {
                type: 'text',
                value: code,
              },
            ],
          },
        ],
      },
    ] as Root['children'],
  };

  return tree;
}

/**
 * Helper function to extract the transformed code from the tree
 */
function extractTransformedCode(tree: Root): string {
  // After transformation, the tree should have TabItem elements
  const tabsElement = tree.children.find(
    (child): child is Element => isElement(child) && child.tagName === 'Tabs'
  );

  if (!isElement(tabsElement) || tabsElement.tagName !== 'Tabs') {
    throw new Error('Expected Tabs element not found');
  }

  // Find the "Dynamic" tab
  const dynamicTab = tabsElement.children.find(
    (child): child is Element =>
      isElement(child) &&
      child.tagName === 'TabItem' &&
      child.properties?.value === 'dynamic'
  );

  if (!dynamicTab) {
    throw new Error('Dynamic tab not found');
  }

  // Extract the code from the dynamic tab
  const preElement = dynamicTab.children.find(
    (child): child is Element => isElement(child) && child.tagName === 'pre'
  );

  if (!preElement) {
    throw new Error('Pre element not found in dynamic tab');
  }

  const codeElement = preElement.children.find(
    (child): child is Element => isElement(child) && child.tagName === 'code'
  );

  if (!codeElement) {
    throw new Error('Code element not found');
  }

  const textNode = codeElement.children.find(isTextNode);

  return textNode?.value || '';
}

function isElement(
  node: TreeChild | ElementChild | undefined
): node is Element {
  return Boolean(node && node.type === 'element');
}

function isMdxEsmNode(node: TreeChild | undefined): node is MdxEsm {
  return Boolean(node && node.type === 'mdxjsEsm');
}

function isTextNode(node: ElementChild): node is Text {
  return node.type === 'text';
}

describe('rehype-static-to-dynamic', () => {
  test('basic screen transformation', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootStack = createNativeStackNavigator({
        screens: {
          Home: HomeScreen,
          Details: DetailsScreen,
        },
      });

      const Navigation = createStaticNavigation(RootStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function RootStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('adds Tabs imports when transforming static2dynamic code', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootStack = createNativeStackNavigator({
        screens: {
          Home: HomeScreen,
        },
      });

      const Navigation = createStaticNavigation(RootStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const importNode = tree.children.find(isMdxEsmNode);

    if (!importNode || !('value' in importNode)) {
      throw new Error('Expected MDX import node not found');
    }

    assert.strictEqual(
      importNode.value,
      "import Tabs from '@theme/Tabs'\nimport TabItem from '@theme/TabItem'"
    );
  });

  test('does not duplicate existing Tabs imports', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootStack = createNativeStackNavigator({
        screens: {
          Home: HomeScreen,
        },
      });

      const Navigation = createStaticNavigation(RootStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input, [
      {
        type: 'mdxjsEsm',
        value:
          "import Tabs from '@theme/Tabs'\nimport TabItem from '@theme/TabItem'",
      },
    ]);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const tabImportNodes = tree.children.filter(
      (child) =>
        isMdxEsmNode(child) &&
        child.value.includes("import Tabs from '@theme/Tabs'")
    );

    assert.strictEqual(tabImportNodes.length, 1);
  });

  test('screen with options', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootStack = createNativeStackNavigator({
        screens: {
          Home: createNativeStackScreen({
            screen: HomeScreen,
            options: { title: 'My Home' },
          }),
        },
      });

      const Navigation = createStaticNavigation(RootStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function RootStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'My Home' }}
            />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('highlight comment on screen property', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          Home: createNativeStackScreen({
            // highlight-next-line
            screen: HomeScreen,
            options: { title: 'My Home' },
          }),
          Details: createNativeStackScreen({
            screen: DetailsScreen,
          }),
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              // highlight-next-line
              component={HomeScreen}
              options={{ title: 'My Home' }}
            />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('highlight comment on screen options', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          Home: createNativeStackScreen({
            screen: HomeScreen,
            // highlight-start
            options: {
              title: 'My Home'
            },
            // highlight-end
          }),
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              // highlight-start
              options={{
                title: 'My Home',
              }}
              // highlight-end
            />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('highlight-start and highlight-end comments', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          // highlight-start
          Home: createNativeStackScreen({
            screen: HomeScreen,
            options: { title: 'My Home' },
          }),
          // highlight-end
          Details: createNativeStackScreen({
            screen: DetailsScreen,
          }),
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            // highlight-start
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'My Home' }}
            />
            // highlight-end
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('navigator props with highlight', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootStack = createNativeStackNavigator({
        // highlight-next-line
        initialRouteName: 'Home',
        screens: {
          Home: createNativeStackScreen({
            screen: HomeScreen,
          }),
          Details: createNativeStackScreen({
            screen: DetailsScreen,
          }),
        },
      });

      const Navigation = createStaticNavigation(RootStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function RootStack() {
        return (
          // highlight-next-line
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('multiple screens with mixed comments', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          // highlight-start
          Home: createNativeStackScreen({
            screen: HomeScreen,
          }),
          Profile: createNativeStackScreen({
            screen: ProfileScreen,
            options: { title: 'User Profile' },
          }),
          // highlight-end
          Details: createNativeStackScreen({
            screen: DetailsScreen,
          }),
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            // highlight-start
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'User Profile' }}
            />
            // highlight-end
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('groups with screens', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootStack = createNativeStackNavigator({
        groups: {
          App: {
            screens: {
              Home: HomeScreen,
              Profile: ProfileScreen,
            },
          },
          Modal: {
            screenOptions: { presentation: 'modal' },
            screens: {
              Settings: SettingsScreen,
            },
          },
        },
      });

      const Navigation = createStaticNavigation(RootStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function RootStack() {
        return (
          <Stack.Navigator>
            <Stack.Group navigationKey="App">
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Group>
            <Stack.Group
              navigationKey="Modal"
              screenOptions={{ presentation: 'modal' }}
            >
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Group>
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('listeners property with highlight', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          Home: createNativeStackScreen({
            screen: HomeScreen,
            // highlight-start
            listeners: {
              focus: () => console.log('focused'),
            },
            // highlight-end
          }),
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              // highlight-start
              listeners={{
                focus: () => console.log('focused'),
              }}
              // highlight-end
            />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('block comments', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          /* some comment */
          Home: createNativeStackScreen({
            screen: HomeScreen,
          }),
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            {/* some comment */}
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('screenOptions and screenListeners on navigator', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootStack = createNativeStackNavigator({
        // highlight-start
        screenOptions: {
          headerShown: false,
        },
        // highlight-end
        screenListeners: {
          focus: () => console.log('focused'),
        },
        screens: {
          Home: HomeScreen,
        },
      });

      const Navigation = createStaticNavigation(RootStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function RootStack() {
        return (
          <Stack.Navigator
            // highlight-start
            screenOptions={{
              headerShown: false,
            }}
            // highlight-end
            screenListeners={{
              focus: () => console.log('focused'),
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('options callback', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          Home: {
            screen: HomeScreen,
            // highlight-start
            options: ({ route }) => ({
              title: route.params?.name,
            }),
            // highlight-end
          },
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              // highlight-start
              options={({ route }) => ({
                title: route.params?.name,
              })}
              // highlight-end
            />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('options callback with createNativeStackScreen', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          Home: createNativeStackScreen({
            screen: HomeScreen,
            // highlight-start
            options: ({ route }) => ({
              title: route.params?.name,
            }),
            // highlight-end
          }),
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              // highlight-start
              options={({ route }) => ({
                title: route.params?.name,
              })}
              // highlight-end
            />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('navigator with `.with(...)` wrapper', async () => {
    const input = dedent /* javascript */ `
      import { useWindowDimensions } from 'react-native';
      import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
      import { createStaticNavigation } from '@react-navigation/native';

      const Tabs = createBottomTabNavigator({
        screens: {
          Home: HomeScreen,
          Profile: ProfileScreen,
        },
      }).with(({ Navigator }) => {
        const dimensions = useWindowDimensions();

        return (
          <Navigator
            screenOptions={{
              tabBarPosition: dimensions.width >= 768 ? 'left' : 'bottom',
            }}
            screenListeners={{
              state: () => console.log('state changed'),
            }}
          />
        );
      });

      const Navigation = createStaticNavigation(Tabs);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { useWindowDimensions } from 'react-native';
      import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
      import { NavigationContainer } from '@react-navigation/native';

      const Tab = createBottomTabNavigator();

      function Tabs() {
        const dimensions = useWindowDimensions();

        return (
          <Tab.Navigator
            screenOptions={{
              tabBarPosition: dimensions.width >= 768 ? 'left' : 'bottom',
            }}
            screenListeners={{
              state: () => console.log('state changed'),
            }}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <Tabs />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('navigator with `.with(...)` merges screenOptions and screenListeners from plain objects', async () => {
    const input = dedent /* javascript */ `
      import { useWindowDimensions } from 'react-native';
      import { createDrawerNavigator } from '@react-navigation/drawer';
      import { createStaticNavigation } from '@react-navigation/native';

      const DrawerRoot = createDrawerNavigator({
        screenOptions: {
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'tomato',
          },
        },
        screenListeners: {
          state: () => console.log('static state'),
        },
        screens: {
          Home: HomeScreen,
        },
      }).with(({ Navigator }) => {
        const dimensions = useWindowDimensions();

        return (
          <Navigator
            screenOptions={{
              drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
            }}
            screenListeners={{
              focus: () => console.log('dynamic focus'),
            }}
          />
        );
      });

      const Navigation = createStaticNavigation(DrawerRoot);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { useWindowDimensions } from 'react-native';
      import { createDrawerNavigator } from '@react-navigation/drawer';
      import { NavigationContainer } from '@react-navigation/native';

      const Drawer = createDrawerNavigator();

      function DrawerRoot() {
        const dimensions = useWindowDimensions();

        return (
          <Drawer.Navigator
            screenOptions={{
              headerTintColor: 'white',
              headerStyle: {
                backgroundColor: 'tomato',
              },
              drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
            }}
            screenListeners={{
              state: () => console.log('static state'),
              focus: () => console.log('dynamic focus'),
            }}
          >
            <Drawer.Screen name="Home" component={HomeScreen} />
          </Drawer.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <DrawerRoot />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('navigator with `.with(...)` merges static objects with wrapper functions', async () => {
    const input = dedent /* javascript */ `
        import { createDrawerNavigator } from '@react-navigation/drawer';
        import { createStaticNavigation } from '@react-navigation/native';

        const DrawerRoot = createDrawerNavigator({
          screenOptions: {
            headerShown: false,
          },
          screenListeners: {
            state: () => console.log('static state'),
          },
          screens: {
            Home: HomeScreen,
          },
        }).with(({ Navigator }) => {
          return (
            <Navigator
              screenOptions={({ route }) => ({
                title: route.name,
              })}
              screenListeners={({ route }) => ({
                focus: () => console.log(route.name),
              })}
            />
          );
        });

        const Navigation = createStaticNavigation(DrawerRoot);

        export default function App() {
          return <Navigation />;
        }
      `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
        import { createDrawerNavigator } from '@react-navigation/drawer';
        import { NavigationContainer } from '@react-navigation/native';

        const Drawer = createDrawerNavigator();

        function DrawerRoot() {
          return (
            <Drawer.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                title: route.name,
              })}
              screenListeners={({ route }) => ({
                state: () => console.log('static state'),
                focus: () => console.log(route.name),
              })}
            >
              <Drawer.Screen name="Home" component={HomeScreen} />
            </Drawer.Navigator>
          );
        }

        export default function App() {
          return (
            <NavigationContainer>
              <DrawerRoot />
            </NavigationContainer>
          );
        }
      `;

    assert.strictEqual(output, expected);
  });

  test('navigator with `.with(...)` merges static functions with wrapper objects', async () => {
    const input = dedent /* javascript */ `
        import { createDrawerNavigator } from '@react-navigation/drawer';
        import { createStaticNavigation } from '@react-navigation/native';

        const DrawerRoot = createDrawerNavigator({
          screenOptions: ({ route }) => ({
            title: route.name,
          }),
          screenListeners: ({ route }) => ({
            state: () => console.log(route.name),
          }),
          screens: {
            Home: HomeScreen,
          },
        }).with(({ Navigator }) => {
          return (
            <Navigator
              screenOptions={{
                headerShown: false,
              }}
              screenListeners={{
                focus: () => console.log('dynamic focus'),
              }}
            />
          );
        });

        const Navigation = createStaticNavigation(DrawerRoot);

        export default function App() {
          return <Navigation />;
        }
      `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
        import { createDrawerNavigator } from '@react-navigation/drawer';
        import { NavigationContainer } from '@react-navigation/native';

        const Drawer = createDrawerNavigator();

        function DrawerRoot() {
          return (
            <Drawer.Navigator
              screenOptions={({ route }) => ({
                title: route.name,
                headerShown: false,
              })}
              screenListeners={({ route }) => ({
                state: () => console.log(route.name),
                focus: () => console.log('dynamic focus'),
              })}
            >
              <Drawer.Screen name="Home" component={HomeScreen} />
            </Drawer.Navigator>
          );
        }

        export default function App() {
          return (
            <NavigationContainer>
              <DrawerRoot />
            </NavigationContainer>
          );
        }
      `;

    assert.strictEqual(output, expected);
  });

  test('navigator with `.with(...)` merges screenOptions and screenListeners when both are functions', async () => {
    const input = dedent /* javascript */ `
        import { createDrawerNavigator } from '@react-navigation/drawer';
        import { createStaticNavigation } from '@react-navigation/native';

        const DrawerRoot = createDrawerNavigator({
          screenOptions: ({ route }) => ({
            title: route.name,
          }),
          screenListeners: ({ route }) => ({
            state: () => console.log(route.name),
          }),
          screens: {
            Home: HomeScreen,
          },
        }).with(({ Navigator }) => {
          return (
            <Navigator
              screenOptions={({ navigation }) => ({
                headerRight: () => null,
              })}
              screenListeners={({ navigation }) => ({
                focus: () => navigation.goBack(),
              })}
            />
          );
        });

        const Navigation = createStaticNavigation(DrawerRoot);

        export default function App() {
          return <Navigation />;
        }
      `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
        import { createDrawerNavigator } from '@react-navigation/drawer';
        import { NavigationContainer } from '@react-navigation/native';

        const Drawer = createDrawerNavigator();

        function DrawerRoot() {
          return (
            <Drawer.Navigator
              screenOptions={({ route, navigation }) => ({
                title: route.name,
                headerRight: () => null,
              })}
              screenListeners={({ route, navigation }) => ({
                state: () => console.log(route.name),
                focus: () => navigation.goBack(),
              })}
            >
              <Drawer.Screen name="Home" component={HomeScreen} />
            </Drawer.Navigator>
          );
        }

        export default function App() {
          return (
            <NavigationContainer>
              <DrawerRoot />
            </NavigationContainer>
          );
        }
      `;

    assert.strictEqual(output, expected);
  });

  test('drawer navigator', async () => {
    const input = dedent /* javascript */ `
      import { createDrawerNavigator } from '@react-navigation/drawer';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootDrawer = createDrawerNavigator({
        screens: {
          Home: HomeScreen,
          Profile: ProfileScreen,
        },
      });

      const Navigation = createStaticNavigation(RootDrawer);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createDrawerNavigator } from '@react-navigation/drawer';
      import { NavigationContainer } from '@react-navigation/native';

      const Drawer = createDrawerNavigator();

      function RootDrawer() {
        return (
          <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
          </Drawer.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <RootDrawer />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('throws on colliding navigator component names', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const Stack = createNativeStackNavigator({
        screens: {
          Home: HomeScreen,
        },
      });

      const Navigation = createStaticNavigation(Stack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();

    await assert.rejects(
      plugin(tree),
      /Rename the static navigator to avoid colliding with the generated dynamic code\./
    );
  });

  test('nested navigator with highlight on screen property', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
      import { createStaticNavigation } from '@react-navigation/native';

      const SearchStack = createNativeStackNavigator({
        screens: {
          FruitsList: {
            screen: FruitsListScreen,
            options: {
              title: 'Search',
            },
          },
        },
      });

      const HomeTabs = createBottomTabNavigator({
        screens: {
          Home: {
            screen: HomeScreen,
            options: {
              tabBarIcon: {
                type: 'sfSymbol',
                name: 'house',
              },
            },
          },
          Search: {
            // highlight-next-line
            screen: SearchStack,
            options: {
              tabBarSystemItem: 'search',
            },
          },
        },
      });

      const Navigation = createStaticNavigation(HomeTabs);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function SearchStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="FruitsList"
              component={FruitsListScreen}
              options={{
                title: 'Search',
              }}
            />
          </Stack.Navigator>
        );
      }

      const Tab = createBottomTabNavigator();

      function HomeTabs() {
        return (
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: {
                  type: 'sfSymbol',
                  name: 'house',
                },
              }}
            />
            <Tab.Screen
              name="Search"
              // highlight-next-line
              component={SearchStack}
              options={{
                tabBarSystemItem: 'search',
              }}
            />
          </Tab.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <HomeTabs />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });

  test('mixed screen definitions', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const MyStack = createNativeStackNavigator({
        screens: {
          Home: HomeScreen,
          Profile: createNativeStackScreen({
            screen: ProfileScreen,
            options: { title: 'User Profile' },
          }),
          Settings: SettingsScreen,
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
    `;

    const tree = createTestTree(input);
    const plugin = rehypeStaticToDynamic();
    await plugin(tree);

    const output = extractTransformedCode(tree);

    const expected = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { NavigationContainer } from '@react-navigation/native';

      const Stack = createNativeStackNavigator();

      function MyStack() {
        return (
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'User Profile' }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        );
      }

      export default function App() {
        return (
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
  });
});
