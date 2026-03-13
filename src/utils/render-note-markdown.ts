import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { remarkCallouts } from "./remark-callouts.js";
import { rehypeImageFigure } from "./rehype-figure.js";

const noteMarkdownProcessor = createMarkdownProcessor({
  remarkPlugins: [remarkGfm, remarkDirective, remarkCallouts],
  rehypePlugins: [
    [
      rehypeImageFigure,
      {
        missingImage: "placeholder",
        placeholderSrc: "/assets/image-missing.svg",
      },
    ],
  ],
});

export const renderNoteBody = async (body: string[]): Promise<string> => {
  if (body.length === 0) {
    return "";
  }

  const processor = await noteMarkdownProcessor;
  const { code } = await processor.render(body.join("\n\n"));
  return code;
};
