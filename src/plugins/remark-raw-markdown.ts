type RemarkFile = {
  data: Record<string, any>;
  value: unknown;
};

const plugin = () => {
  return (_tree: unknown, file: RemarkFile) => {
    file.data.frontMatter = file.data.frontMatter || {};
    file.data.frontMatter.rawMarkdown = file.value;
  };
};

export default plugin;
