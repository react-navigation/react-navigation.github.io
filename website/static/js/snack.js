const DEFAULT_PLATFORM = 'android';
const DEPS_VERSIONS = {
  '4': [
    'react-navigation@^4.0.10',
    'react-navigation-tabs@^2.5.6',
    'react-navigation-stack@^1.10.3',
    'react-navigation-drawer@^2.3.3',
  ],
  next: [
    '@react-native-community/masked-view@^0.1.1',
    '@react-navigation/native@^5.0.0',
    '@react-navigation/bottom-tabs@^5.0.0',
    '@react-navigation/drawer@^5.0.0',
    '@react-navigation/material-bottom-tabs@^5.0.0',
    '@react-navigation/material-top-tabs@^5.0.0',
    '@react-navigation/native-stack@^5.0.0',
    '@react-navigation/stack@^5.0.0',
    'react-native-gesture-handler@1.5.2',
    'react-native-reanimated@1.4.0',
    'react-native-safe-area-context@0.6.0',
    'react-native-screens@2.0.0',
  ],
};

// todo: should get the version somewhere, maybe within the page html,
// and match the appropriate version of react-navigation/stack/tabs/drawer
// based on that
function getSnackUrl(options) {
  let currentVersion = document.querySelector('header a h3').innerText;
  let label = options.label || document.title;
  let code = options.code;
  let templateId = options.templateId;
  const currentMajorVersion =
    currentVersion === 'next' ? 'next' : currentVersion.match(/(\d+)\./)[1];

  let baseUrl =
    `https://snack.expo.io?platform=${DEFAULT_PLATFORM}&name=` +
    encodeURIComponent(label) +
    '&dependencies=' +
    encodeURIComponent(DEPS_VERSIONS[currentMajorVersion].join(','));

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

function findNearestPreElement(node) {
  let nextElement = node.nextElementSibling;
  if (!nextElement && node.parentElement.tagName === 'P') {
    nextElement = node.parentElement.nextElementSibling;
  }

  while (nextElement) {
    if (
      nextElement.tagName === 'PRE' &&
      nextElement.firstChild &&
      nextElement.firstChild.tagName === 'CODE' &&
      (nextElement.firstChild.className.includes('language-js') ||
        nextElement.firstChild.className.includes('language-ts'))
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

  samples.forEach(samp => {
    let pre = findNearestPreElement(samp);

    if (!pre) {
      console.log(
        `<pre> tag with <code> child not found for <samp> element ${samp.innerText}`
      );
      return;
    }

    let code = pre.innerText;
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
    pre.insertAdjacentElement('afterend', link);

    // Don't try to add the link more than once!
    samp.remove();
  });
}

// This is used to update links like the following:
// [Full source of what we have built so far](#example/full-screen-modal)
function transformExistingSnackLinks() {
  document.querySelectorAll('a[href*="#example/"]').forEach(a => {
    let urlParts = a.href.split('#example/');
    let templateId = urlParts[urlParts.length - 1];
    a.href = getSnackUrl({ templateId });
    a.target = '_blank';
  });
}

appendSnackLink();
transformExistingSnackLinks();

var mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(appendSnackLink);
  mutations.forEach(transformExistingSnackLinks);
});

mutationObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
