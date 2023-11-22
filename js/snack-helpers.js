const DEFAULT_PLATFORM = 'android';
const DEPS_VERSIONS = {
  4: [
    '@expo/vector-icons@*',
    '@react-native-community/masked-view@*',
    'react-navigation@^4.4.0',
    'react-navigation-tabs@^2.9.0',
    'react-navigation-stack@^2.8.2',
    'react-navigation-drawer@^2.5.0',
    'react-native-reanimated@*',
    'react-native-gesture-handler@*',
    'react-native-safe-area-context@*',
    'react-native-screens@*',
  ],
  5: [
    '@expo/vector-icons@*',
    '@react-native-community/masked-view@*',
    '@react-navigation/bottom-tabs@^5.11.15',
    '@react-navigation/drawer@^5.12.9',
    '@react-navigation/material-bottom-tabs@^5.3.19',
    '@react-navigation/material-top-tabs@^5.3.19',
    '@react-navigation/native@^5.9.8',
    '@react-navigation/stack@^5.14.9',
    'react-native-paper@^4.0.1',
    'react-native-reanimated@*',
    'react-native-safe-area-context@*',
    'react-native-gesture-handler@*',
    'react-native-screens@*',
    'react-native-tab-view@^2.15.1',
  ],
  6: [
    '@expo/vector-icons@*',
    '@react-native-community/masked-view@*',
    'react-native-gesture-handler@*',
    'react-native-pager-view@*',
    'react-native-paper@^4.7.2',
    'react-native-reanimated@*',
    'react-native-safe-area-context@*',
    'react-native-screens@*',
    'react-native-tab-view@^3.0.0',
    '@react-navigation/bottom-tabs@6.3.1',
    '@react-navigation/drawer@6.4.1',
    '@react-navigation/elements@1.3.3',
    '@react-navigation/material-bottom-tabs@6.2.1',
    '@react-navigation/material-top-tabs@6.2.1',
    '@react-navigation/native-stack@6.6.1',
    '@react-navigation/native@6.0.10',
    '@react-navigation/stack@6.2.1',
  ],
  7: [
    '@expo/vector-icons@*',
    '@react-native-community/masked-view@*',
    'react-native-gesture-handler@*',
    'react-native-pager-view@*',
    'react-native-paper@^4.7.2',
    'react-native-reanimated@*',
    'react-native-safe-area-context@*',
    'react-native-screens@*',
    'react-native-tab-view@^3.0.0',
    '@react-navigation/bottom-tabs@7.0.0-alpha.1',
    '@react-navigation/drawer@7.0.0-alpha.1',
    '@react-navigation/elements@1.3.17',
    '@react-navigation/material-top-tabs@7.0.0-alpha.1',
    '@react-navigation/native-stack@7.0.0-alpha.1',
    '@react-navigation/native@7.0.0-alpha.1',
    '@react-navigation/stack@7.0.0-alpha.1',
  ],
};

function getVersion() {
  const maybeVersion = window.location.pathname.split('/')[1];

  if (/(\d+)\.x/.test(maybeVersion)) {
    return maybeVersion;
  }

  return '6.x';
}

function getSnackUrl(options) {
  let currentVersion = getVersion();
  let label = options.label || document.title;
  let code = options.code;
  let templateId = options.templateId;

  const currentMajorVersion = currentVersion.match(/(\d+)\./)[1];

  let baseUrl =
    `https://snack.expo.io?platform=${DEFAULT_PLATFORM}&name=` +
    encodeURIComponent(label) +
    '&dependencies=' +
    encodeURIComponent(DEPS_VERSIONS[currentMajorVersion].join(',')) +
    '&hideQueryParams=true';

  // todo: this is ridiculous but there's no other way i can see to get the
  // current version from the html or the url, given that the root url is
  // the latest version

  if (templateId) {
    let templateUrl = `${document.location.origin}/examples/${currentVersion}/${templateId}.js`;
    return `${baseUrl}&sourceUrl=${encodeURIComponent(templateUrl)}`;
  } else {
    return `${baseUrl}&code=${encodeURIComponent(code)}`;
  }
}

function findNearestCodeBlock(node) {
  let nextElement = node.nextElementSibling;
  if (!nextElement && node.parentElement.tagName === 'P') {
    nextElement = node.parentElement.nextElementSibling;
  }

  while (nextElement) {
    if (
      nextElement.tagName === 'DIV' &&
      (nextElement.className.includes('mdxCodeBlock') ||
        nextElement.className.includes('codeBlockContainer'))
    ) {
      return nextElement;
    } else {
      nextElement = nextElement.nextElementSibling;
    }
  }
}

let openIcon =
  '<svg width="14px" height="14px" viewBox="0 0 16 16" style="vertical-align: -1px"><g stroke="none" stroke-width="1" fill="none"><polyline stroke="currentColor" points="8.5 0.5 15.5 0.5 15.5 7.5"></polyline><path d="M8,8 L15.0710678,0.928932188" stroke="currentColor"></path><polyline stroke="currentColor" points="9.06944444 3.5 1.5 3.5 1.5 14.5 12.5 14.5 12.5 6.93055556"></polyline></g></svg>';

function appendSnackLink() {
  let samples = document.querySelectorAll('samp');

  if (!samples.length) {
    return;
  }

  samples.forEach((samp) => {
    if (samp.dataset.handled) {
      return;
    }

    let codeBlock = findNearestCodeBlock(samp);

    if (!codeBlock) {
      console.log(`Code block not found for <samp> element ${samp.innerText}`);
      return;
    }

    let code = codeBlock.innerText;
    let label = samp.innerText;
    let templateId = samp.getAttribute('id');

    let link = document.createElement('a');
    link.className = 'snack-sample-link';
    link.dataset.snack = true;
    link.target = '_blank';

    if (label) {
      link.innerHTML = `Try the "${label}" example on Snack ${openIcon}`;
    } else {
      link.innerHTML = `Try this example on Snack ${openIcon}`;
    }

    // Add the href and append the link element if we have some code
    let href = getSnackUrl({ code, templateId, label });

    if (link.href === href) {
      return;
    }

    link.href = href;

    // The code block seems to get removed from the DOM - messing up the position of the link
    // So we get a reference to the next element and insert the link before it
    const nextSibling = codeBlock.nextElementSibling;

    if (nextSibling) {
      nextSibling.insertAdjacentElement('beforebegin', link);
    } else {
      codeBlock.insertAdjacentElement('afterend', link);
    }

    // Don't try to add the link more than once!
    samp.remove()
  });
}

// This is used to update links like the following:
// [Full source of what we have built so far](#example/full-screen-modal)
function transformExistingSnackLinks() {
  document.querySelectorAll('a[href*="#example/"]').forEach((a) => {
    let urlParts = a.href.split('#example/');
    let templateId = urlParts[urlParts.length - 1];
    a.href = getSnackUrl({ templateId });
    a.target = '_blank';
  });
}

function initializeSnackObservers() {
  appendSnackLink();
  transformExistingSnackLinks();

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(appendSnackLink);
    mutations.forEach(transformExistingSnackLinks);
  });

  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

document.addEventListener('DOMContentLoaded', initializeSnackObservers);
