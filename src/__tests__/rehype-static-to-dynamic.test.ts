import dedent from 'dedent';
import assert from 'node:assert';
import { describe, test } from 'node:test';
import rehypeStaticToDynamic, {
  type RehypeStaticToDynamicElement as Element,
  type RehypeStaticToDynamicElementChild as ElementChild,
  type RehypeStaticToDynamicRoot as Root,
  type RehypeStaticToDynamicText as Text,
  type RehypeStaticToDynamicTreeChild as TreeChild,
} from '../plugins/rehype-static-to-dynamic.ts';

/**
 * Helper function to create a test tree structure
 */
function createTestTree(code: string): Root {
  const tree: Root = {
    type: 'root',
    children: [
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
    ],
  };

  return tree;
}

/**
 * Helper function to extract the transformed code from the tree
 */
function extractTransformedCode(tree: Root): string {
  // After transformation, the tree should have TabItem elements
  const tabsElement = tree.children[0];

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
    (child): child is Element =>
      isElement(child) && child.tagName === 'pre'
  );

  if (!preElement) {
    throw new Error('Pre element not found in dynamic tab');
  }

  const codeElement = preElement.children.find(
    (child): child is Element =>
      isElement(child) && child.tagName === 'code'
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

  test('screenOptions on navigator', async () => {
    const input = dedent /* javascript */ `
      import { createNativeStackNavigator } from '@react-navigation/native-stack';
      import { createStaticNavigation } from '@react-navigation/native';

      const RootStack = createNativeStackNavigator({
        // highlight-start
        screenOptions: {
          headerShown: false,
        },
        // highlight-end
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

  test('drawer navigator', async () => {
    const input = dedent /* javascript */ `
      import { createDrawerNavigator } from '@react-navigation/drawer';
      import { createStaticNavigation } from '@react-navigation/native';

      const Drawer = createDrawerNavigator({
        screens: {
          Home: HomeScreen,
          Profile: ProfileScreen,
        },
      });

      const Navigation = createStaticNavigation(Drawer);

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

      function Drawer() {
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
            <Drawer />
          </NavigationContainer>
        );
      }
    `;

    assert.strictEqual(output, expected);
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
