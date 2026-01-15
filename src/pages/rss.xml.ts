import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../consts";
import { byNewest, getPostSlug, includeDrafts } from "../utils/blog";

const getImageType = (url: string): string | undefined => {
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
  if (url.endsWith(".svg")) return "image/svg+xml";
  return undefined;
};

export async function GET() {
  const posts = (await getCollection("blog"))
    .filter((post) => includeDrafts || !post.data.draft)
    .sort(byNewest);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    items: posts.map((post) => {
      const slug = getPostSlug(post);
      const heroImage = post.data.heroImage;
      const imageType = heroImage ? getImageType(heroImage) : undefined;

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${slug}`,
        categories: post.data.tags,
        customData:
          heroImage && imageType
            ? `<enclosure url="${new URL(heroImage, SITE_URL)}" type="${imageType}" />`
            : undefined,
      };
    }),
  });
}
