/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import Redirect from 'docusaurus/lib/core/Redirect';

function Help ({ config }){
  return (
    <Redirect
      redirect='docs/en/next/getting-started.html'
      config={config}
    />
  )
}

module.exports = Help;
