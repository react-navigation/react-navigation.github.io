/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import clsx from 'clsx';

import DocusaurusContext from '@docusaurus/context';

import './styles.css';

/**
 * NOTE: @eriveltonelias
 * this isn't the better way to do that 
 * but currently docusarus v2 isn't working the filter
 * by version, so this will allow us to get the current version
 * and use to filter the search
 */
const VERSIONS  = ["1.x", "2.x", "3.x", "4.x"];

function getVersion(){
  const url = window.location.href;
  const index = VERSIONS.findIndex(e => url.includes(e));
  return index >= 0 ? VERSIONS[index] : '5.x';
}

const Search = props => {
  const [isEnabled, setIsEnabled] = useState(true);
  const searchBarRef = useRef(null);
  const context = useContext(DocusaurusContext);

  useEffect(() => {
    const {siteConfig = {}} = context;
    const {
      themeConfig: {algolia},
    } = siteConfig;

    // https://github.com/algolia/docsearch/issues/352
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      const version = getVersion();
     
      algolia.algoliaOptions.facetFilters = [`version:${version}`];
      import('docsearch.js').then(({default: docsearch}) => {
        docsearch({
          appId: algolia.appId,
          apiKey: algolia.apiKey,
          indexName: algolia.indexName,
          inputSelector: '#search_input_react',
          algoliaOptions: algolia.algoliaOptions,
        });
      });
    } else {
      console.warn('Search has failed to load and now is being disabled');
      setIsEnabled(false);
    }
  }, []);

  const toggleSearchIconClick = useCallback(
    e => {
      if (!searchBarRef.current.contains(e.target)) {
        searchBarRef.current.focus();
      }

      props.handleSearchBarToggle(!props.isSearchBarExpanded);
    },
    [props.isSearchBarExpanded],
  );

  return isEnabled ? (
    <div className="navbar__search" key="search-box">
      <span
        role="button"
        className={clsx('search-icon', {
          'search-icon-hidden': props.isSearchBarExpanded,
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={clsx(
          'navbar__search-input',
          {'search-bar-expanded': props.isSearchBarExpanded},
          {'search-bar': !props.isSearchBarExpanded},
        )}
        onFocus={toggleSearchIconClick}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
      />
    </div>
  ) : null;
};

export default Search;
