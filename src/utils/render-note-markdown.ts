import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import rehypeExpressiveCode from "rehype-expressive-code";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { expressiveCodeOptions } from "./expressive-code.js";
import { remarkCallouts } from "./remark-callouts.js";
import { rehypeImageFigure } from "./rehype-figure.js";

const noteMarkdownProcessor = createMarkdownProcessor({
  syntaxHighlight: false,
  remarkPlugins: [remarkGfm, remarkDirective, remarkCallouts],
  rehypePlugins: [
    [rehypeExpressiveCode, expressiveCodeOptions],
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
