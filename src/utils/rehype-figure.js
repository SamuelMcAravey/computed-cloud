import { visit } from "unist-util-visit";

const toElement = (tagName, properties, children = []) => ({
  type: "element",
  tagName,
  properties: properties ?? {},
  children,
});

export function rehypeImageFigure() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index == null || node.tagName !== "img") return;
      if (parent.type !== "element" || parent.tagName !== "p") return;
      if (parent.children.length !== 1) return;
      const src = node.properties?.src;
      if (!src) return;

      const title = node.properties?.title;
      const img = {
        ...node,
        properties: {
          ...node.properties,
          className: ["cc-image"],
        },
      };

      const link = toElement(
        "a",
        { href: src, className: ["cc-lightbox-link"] },
        [img]
      );

      const figureChildren = [link];

      if (title) {
        figureChildren.push(
          toElement("figcaption", {}, [{ type: "text", value: title }])
        );
      }

      parent.children[index] = toElement("figure", { className: ["cc-figure"] }, figureChildren);
    });
  };
}
