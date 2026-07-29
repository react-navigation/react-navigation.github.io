/**
 * Docusaurus shows items in hidden tabs in the TOC.
 * It's confusing since it doesn't represent the actual page.
 * And clicking on those items doesn't do anything.
 * This scripts syncs the TOCs with visible headings.
 */
export const syncToc = () => {
  const headings = document.querySelectorAll<HTMLElement>(
    'article :is(h2, h3)'
  );

  // Get all visible headings
  const titles = Array.from(headings)
    .filter((el) => el.offsetParent)
    .map((el) => trim(el.textContent ?? ''));

  const toc = document.querySelectorAll<HTMLAnchorElement>(
    '.table-of-contents li > a'
  );

  // Hide TOC items that don't have a corresponding heading
  toc.forEach((el) => {
    const item = el.parentElement;

    if (!item) {
      return;
    }

    if (!titles.includes(trim(el.textContent ?? ''))) {
      item.style.display = 'none';
    } else {
      item.style.display = 'block';
    }
  });
};

const trim = (str: string) => str.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
