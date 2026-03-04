import dedent from 'dedent';
import assert from 'node:assert';
import { describe, test } from 'node:test';
import { processMarkdown } from '../plugins/process-markdown.ts';

describe('processMarkdown', () => {
  test('strips MDX import statements', async () => {
    const input = dedent`
      import Tabs from '@theme/Tabs';
      import TabItem from '@theme/TabItem';

      Some content here.
    `;

    const { content: result } = await processMarkdown(input);
    assert.ok(!result.includes('import'));
    assert.ok(result.includes('Some content here.'));
  });

  test('transforms Tabs with two TabItems into labeled sections', async () => {
    const input = dedent`
      Before tabs.

      <Tabs groupId="config" queryString="config">
      <TabItem value="static" label="Static" default>

      Static content here.

      </TabItem>
      <TabItem value="dynamic" label="Dynamic">

      Dynamic content here.

      </TabItem>
      </Tabs>

      After tabs.
    `;

    const { content: result } = await processMarkdown(input);

    assert.ok(!result.includes('<Tabs'));
    assert.ok(!result.includes('<TabItem'));
    assert.ok(!result.includes('</Tabs>'));
    assert.ok(!result.includes('</TabItem>'));
    assert.ok(result.includes('**Static:**'));
    assert.ok(result.includes('Static content here.'));
    assert.ok(result.includes('**Dynamic:**'));
    assert.ok(result.includes('Dynamic content here.'));
    assert.ok(result.includes('Before tabs.'));
    assert.ok(result.includes('After tabs.'));
  });

  test('transforms nested Tabs', async () => {
    const input = dedent`
      <Tabs groupId='framework' queryString="framework">
      <TabItem value='expo' label='Expo' default>

      Expo instructions.

      </TabItem>
      <TabItem value='community-cli' label='Community CLI'>

      CLI instructions.

      <Tabs>
      <TabItem value='kotlin' label='Kotlin' default>

      Kotlin code.

      </TabItem>
      <TabItem value='java' label='Java'>

      Java code.

      </TabItem>
      </Tabs>

      More CLI content.

      </TabItem>
      </Tabs>
    `;

    const { content: result } = await processMarkdown(input);

    assert.ok(!result.includes('<Tabs'));
    assert.ok(!result.includes('<TabItem'));
    assert.ok(result.includes('**Expo:**'));
    assert.ok(result.includes('Expo instructions.'));
    assert.ok(result.includes('**Community CLI:**'));
    assert.ok(result.includes('CLI instructions.'));
    assert.ok(result.includes('**Kotlin:**'));
    assert.ok(result.includes('Kotlin code.'));
    assert.ok(result.includes('**Java:**'));
    assert.ok(result.includes('Java code.'));
  });

  test('handles single TabItem without label', async () => {
    const input = dedent`
      <Tabs>
      <TabItem value="only" label="Only Option">

      Only content.

      </TabItem>
      </Tabs>
    `;

    const { content: result } = await processMarkdown(input);

    assert.ok(!result.includes('<Tabs'));
    // Single tab should not have a label
    assert.ok(!result.includes('**Only Option:**'));
    assert.ok(result.includes('Only content.'));
  });

  test('transforms static2dynamic code fences', async () => {
    const input = dedent`
      Before code.

      \`\`\`js name="Example" snack static2dynamic
      import * as React from 'react';
      import { createStaticNavigation } from '@react-navigation/native';
      import { createNativeStackNavigator } from '@react-navigation/native-stack';

      function HomeScreen() {
        return null;
      }

      const MyStack = createNativeStackNavigator({
        screens: {
          Home: HomeScreen,
        },
      });

      const Navigation = createStaticNavigation(MyStack);

      export default function App() {
        return <Navigation />;
      }
      \`\`\`

      After code.
    `;

    const { content: result } = await processMarkdown(input);

    assert.ok(result.includes('**Static:**'));
    assert.ok(result.includes('**Dynamic:**'));
    // The dynamic version should have NavigationContainer
    assert.ok(result.includes('NavigationContainer'));
    // Meta attributes should be stripped from fence lines
    assert.ok(!result.includes('static2dynamic'));
    // Check that 'snack' doesn't appear in fence meta (it may appear in code content)
    assert.ok(!result.match(/^```\w*.*snack/m));
    assert.ok(!result.match(/^```\w*.*name=/m));
    assert.ok(result.includes('Before code.'));
    assert.ok(result.includes('After code.'));
  });

  test('strips code fence meta attributes', async () => {
    const input = dedent`
      \`\`\`js name="Test" snack
      const x = 1;
      \`\`\`

      \`\`\`bash npm2yarn
      npm install something
      \`\`\`
    `;

    const { content: result } = await processMarkdown(input);

    assert.ok(!result.includes('name='));
    assert.ok(!result.includes('snack'));
    assert.ok(!result.includes('npm2yarn'));
    assert.ok(result.includes('```js'));
    assert.ok(result.includes('```bash'));
    assert.ok(result.includes('const x = 1;'));
    assert.ok(result.includes('npm install something'));
  });

  test('converts admonitions to blockquotes', async () => {
    const input = dedent`
      Some text.

      :::warning

      This is a warning.

      ::::

      More text.
    `;

    const { content: result } = await processMarkdown(input);

    assert.ok(!result.includes(':::'));
    assert.ok(result.includes('> **Warning:**'));
    assert.ok(result.includes('> This is a warning.'));
    assert.ok(result.includes('Some text.'));
    assert.ok(result.includes('More text.'));
  });

  test('converts info admonitions', async () => {
    const input = dedent`
      :::info

      Some info here.

      ::::
    `;

    const { content: result } = await processMarkdown(input);

    assert.ok(result.includes('> **Info:**'));
    assert.ok(result.includes('> Some info here.'));
  });

  test('cleans up extra blank lines', async () => {
    const input = 'Line 1.\n\n\n\n\nLine 2.';
    const { content: result } = await processMarkdown(input);

    assert.ok(!result.includes('\n\n\n'));
    assert.ok(result.includes('Line 1.\n\nLine 2.'));
  });

  test('handles Tabs with code blocks inside', async () => {
    const input = dedent`
      <Tabs groupId="config" queryString="config">
      <TabItem value="static" label="Static" default>

      \`\`\`js
      const x = createStackNavigator({});
      \`\`\`

      </TabItem>
      <TabItem value="dynamic" label="Dynamic">

      \`\`\`js
      function MyStack() {
        return <Stack.Navigator />;
      }
      \`\`\`

      </TabItem>
      </Tabs>
    `;

    const { content: result } = await processMarkdown(input);

    assert.ok(result.includes('**Static:**'));
    assert.ok(result.includes('createStackNavigator'));
    assert.ok(result.includes('**Dynamic:**'));
    assert.ok(result.includes('Stack.Navigator'));
    assert.ok(!result.includes('<Tabs'));
  });

  test('preserves content outside of MDX constructs', async () => {
    const input = dedent`
      # Title

      Regular paragraph with **bold** and [links](https://example.com).

      - List item 1
      - List item 2

      > A blockquote.
    `;

    const { content: result } = await processMarkdown(input);

    assert.strictEqual(result, input);
  });

  test('strips frontmatter and returns parsed data', async () => {
    const input = dedent`
      ---
      id: getting-started
      title: Getting started
      description: Learn how to get started
      ---

      Some content here.
    `;

    const { frontmatter, content } = await processMarkdown(input);

    assert.strictEqual(frontmatter.title, 'Getting started');
    assert.strictEqual(frontmatter.description, 'Learn how to get started');
    assert.strictEqual(frontmatter.id, 'getting-started');
    assert.ok(!content.includes('---'));
    assert.ok(content.includes('Some content here.'));
  });
});
