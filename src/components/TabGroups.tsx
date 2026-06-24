import type { ReactNode } from 'react';
import Tabs from '@theme/Tabs';

const configTabs = [
  { value: 'static', label: 'Static', default: true },
  { value: 'dynamic', label: 'Dynamic' },
];

const frameworkTabs = [
  { value: 'expo', label: 'Expo', default: true },
  { value: 'community-cli', label: 'Community CLI' },
];

const androidLanguageTabs = [
  { value: 'kotlin', label: 'Kotlin', default: true },
  { value: 'java', label: 'Java' },
];

const iosLanguageTabs = [
  { value: 'swift', label: 'Swift', default: true },
  { value: 'objc', label: 'Objective-C' },
];

type TabGroupProps = {
  children: ReactNode;
};

export function ConfigTabs({ children }: TabGroupProps) {
  return (
    <Tabs groupId="config" queryString="config" values={configTabs}>
      {children}
    </Tabs>
  );
}

export function ExampleTabs({ children }: TabGroupProps) {
  return (
    <Tabs groupId="example" queryString="example" values={configTabs}>
      {children}
    </Tabs>
  );
}

export function FrameworkTabs({ children }: TabGroupProps) {
  return (
    <Tabs groupId="framework" queryString="framework" values={frameworkTabs}>
      {children}
    </Tabs>
  );
}

export function AndroidLanguageTabs({ children }: TabGroupProps) {
  return (
    <Tabs groupId="android-lang" values={androidLanguageTabs}>
      {children}
    </Tabs>
  );
}

export function IosLanguageTabs({ children }: TabGroupProps) {
  return (
    <Tabs groupId="ios-lang" values={iosLanguageTabs}>
      {children}
    </Tabs>
  );
}
