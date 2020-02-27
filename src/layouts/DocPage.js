import React from 'react';
import DefaultDocPage from '@theme/DocPage';

function DocPage(props) {
  React.useEffect(() => {
    // Tags in Head aren't immediately available when the snack script loads, so
    // instead let's just store this in a global...
    window.__reactNavigationVersion = props.docsMetadata.version;
  });

  return <DefaultDocPage {...props} />;
}

export default DocPage;
