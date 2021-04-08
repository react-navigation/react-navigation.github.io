import React from 'react';
import DefaultDocItem from '@theme/DocItem';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function DocItem(props) {
  // make sure to not use the window on the SSR
  if(!ExecutionEnvironment.canUseDOM){
    return null;
  }
  return <DefaultDocItem {...props} />;
}

export default DocItem;
