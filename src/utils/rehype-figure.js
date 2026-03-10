import { existsSync } from "node:fs";
import path from "node:path";
import { SKIP, visit } from "unist-util-visit";

const DEFAULT_PLACEHOLDER_SRC = "/assets/image-missing.svg";

const toElement = (tagName, properties, children = []) => ({
  type: "element",
  tagName,
  properties: properties ?? {},
  children,
});

const resolvePublicPath = (src) => {
  if (!src?.startsWith("/")) return null;
  return path.join(process.cwd(), "public", src.replace(/^\/+/, ""));
};

const isMissingLocalImage = (src) => {
  if (!src || src.startsWith("http") || src.startsWith("data:")) return false;
  const resolved = resolvePublicPath(src);
  if (!resolved) return false;
  return !existsSync(resolved);
};

const normalizeImageSrc = (src, options) => {
  if (!src) return src;
  const missing = isMissingLocalImage(src);
  if (!missing) return src;
  if (options.missingImage === "remove") return null;
  if (options.missingImage === "ignore") return src;
  return options.placeholderSrc;
};

export function rehypeImageFigure(options = {}) {
  const settings = {
    missingImage: options.missingImage ?? "placeholder",
    placeholderSrc: options.placeholderSrc ?? DEFAULT_PLACEHOLDER_SRC,
  };

  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index == null || node.tagName !== "p") return;
      if (!node.children || node.children.length !== 1) return;
      const child = node.children[0];
      if (child.type !== "element" || child.tagName !== "img") return;
      const src = child.properties?.src;
      if (!src) return;
      const normalizedSrc = normalizeImageSrc(src, settings);
      if (normalizedSrc == null) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }

      const title = child.properties?.title;
      const img = {
        ...child,
        properties: {
          ...child.properties,
          src: normalizedSrc,
          className: ["cc-image"],
        },
      };

      const link = toElement(
        "a",
        { href: normalizedSrc, className: ["cc-lightbox-link"] },
        [img]
      );

      const figureChildren = [link];

      if (title) {
        figureChildren.push(
          toElement("figcaption", {}, [{ type: "text", value: title }])
        );
      }

      parent.children[index] = toElement(
        "figure",
        { className: ["cc-figure"] },
        figureChildren
      );
    });
  };
}
