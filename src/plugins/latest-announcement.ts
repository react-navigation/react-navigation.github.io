import type { AllContent, Plugin } from '@docusaurus/types';

export type LatestAnnouncement = {
  title: string;
  permalink: string;
  date: string;
};

type BlogPost = {
  metadata: {
    title: string;
    permalink: string;
    date: Date;
    tags: { label: string }[];
  };
};

function isBlogPost(value: unknown): value is BlogPost {
  if (typeof value !== 'object' || value === null || !('metadata' in value)) {
    return false;
  }

  const metadata = value.metadata;

  return (
    typeof metadata === 'object' &&
    metadata !== null &&
    'title' in metadata &&
    typeof metadata.title === 'string' &&
    'permalink' in metadata &&
    typeof metadata.permalink === 'string' &&
    'date' in metadata &&
    metadata.date instanceof Date &&
    'tags' in metadata &&
    Array.isArray(metadata.tags)
  );
}

function findLatestAnnouncement(
  allContent: AllContent
): LatestAnnouncement | null {
  const blogContent = allContent['docusaurus-plugin-content-blog']?.default;

  if (
    typeof blogContent !== 'object' ||
    blogContent === null ||
    !('blogPosts' in blogContent) ||
    !Array.isArray(blogContent.blogPosts)
  ) {
    return null;
  }

  const latest = blogContent.blogPosts
    .filter(isBlogPost)
    .filter((post) =>
      post.metadata.tags.some((tag) => tag.label === 'announcement')
    )
    .sort((a, b) => b.metadata.date.getTime() - a.metadata.date.getTime())[0];

  if (!latest) {
    return null;
  }

  return {
    title: latest.metadata.title,
    permalink: latest.metadata.permalink,
    date: latest.metadata.date.toISOString(),
  };
}

export default function latestAnnouncementPlugin(): Plugin<void> {
  return {
    name: 'latest-announcement',

    async allContentLoaded({ allContent, actions }) {
      actions.setGlobalData(findLatestAnnouncement(allContent));
    },
  };
}
