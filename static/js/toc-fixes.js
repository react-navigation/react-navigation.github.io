/**
 * Docusaurus shows items in hidden tabs in the TOC.
 * It's confusing since it doesn't represent the actual page.
 * And clicking on those items doesn't do anything.
 * This scripts syncs the TOCs with visible headings.
 */
const sync = () => {
  const headings = document.querySelectorAll('article :is(h2, h3)');

  // Get all visible headings
  const titles = Array.from(headings)
    .filter((el) => el.offsetParent)
    .map((el) => trim(el.textContent));

  const toc = document.querySelectorAll('.table-of-contents li > a');

  // Hide TOC items that don't have a corresponding heading
  toc.forEach((el) => {
    if (!titles.includes(trim(el.textContent))) {
      el.parentElement.style.display = 'none';
    } else {
      el.parentElement.style.display = 'block';
    }
  });
};

if (window.navigation) {
  document.addEventListener('DOMContentLoaded', () => {
    // For the first page load, wait till page is loaded
    const observer = new MutationObserver(() => {
      const article = document.querySelector('article');

      if (article) {
        observer.disconnect();
        sync();

        // Listen to navigation events to detect tab query param change
        window.navigation.addEventListener('navigate', (event) => {
          requestAnimationFrame(sync);
        });
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

const trim = (str) => str.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
