// @ts-check

/** @type {import('unified').Plugin} */
const plugin = () => {
  return (tree, file) => {
    // Add raw markdown to frontMatter so it's accessible via useDoc()
    file.data.frontMatter = file.data.frontMatter || {};
    // @ts-expect-error: we are adding a custom field
    file.data.frontMatter.rawMarkdown = file.value;
  };
};

export default plugin;
