import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { CopyButton } from '@site/src/components/CopyMarkdownButton';
import Heading from '@theme-original/Heading';
import MDXContent from '@theme-original/MDXContent';
import clsx from 'clsx';
import { type ReactNode } from 'react';
import styles from './styles.module.css';

function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';

  if (!shouldRender) {
    return null;
  }

  return metadata.title;
}

type Props = {
  children: ReactNode;
};

export default function DocItemContent({ children }: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header className={styles.header}>
          <Heading as="h1">{syntheticTitle}</Heading>
          <CopyButton />
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
