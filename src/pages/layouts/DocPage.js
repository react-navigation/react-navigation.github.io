import React from 'react';
import DefaultDocPage from '@theme/DocPage';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {
  initializeSnackObservers,
  removeSnackObservers,
} from '../../SnackHelpers';

function DocPage(props) {
  // make sure to not use the window on the SSR
  if(!ExecutionEnvironment.canUseDOM){
    return null;
  }
  React.useEffect(() => {
    // Tags in Head aren't immediately available when the snack script loads, so
    // instead let's just store this in a global...
    window.__reactNavigationVersion = props.versionMetadata.version;
  });

  React.useEffect(() => {
    initializeSnackObservers();

    return () => {
      removeSnackObservers();
    };
  }, []);

  return <DefaultDocPage {...props} />;
}

export default DocPage;
