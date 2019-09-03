/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Redirect = require('docusaurus/lib/core/Redirect');

function Next({ config }) {
  return <Redirect redirect="/docs/next/getting-started" config={config} />;
}

module.exports = Next;
