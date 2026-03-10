import { visit } from "unist-util-visit";

const CALLOUTS = {
  note: "note",
  info: "info",
  tip: "tip",
  warn: "warn",
  warning: "warn",
  danger: "danger",
  caution: "danger",
};

const normalizeKind = (value) => CALLOUTS[value?.toLowerCase?.()] ?? null;

const setCalloutData = (node, kind) => {
  const label = kind.toUpperCase();
  node.data ??= {};
  node.data.hName = "div";
  node.data.hProperties = {
    ...(node.data.hProperties ?? {}),
    className: ["callout", `callout-${kind}`],
    "data-callout": label,
  };
};

const stripMarker = (node, marker) => {
  if (!node.children) return;
  for (const child of node.children) {
    if (child.type === "text" && child.value?.startsWith(marker)) {
      child.value = child.value.replace(marker, "").trimStart();
      return;
    }
  }
};

export function remarkCallouts() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "containerDirective" || node.type === "leafDirective") {
        const kind = normalizeKind(node.name);
        if (kind) setCalloutData(node, kind);
        return;
      }

      if (node.type === "blockquote" && node.children?.length) {
        const first = node.children[0];
        if (first.type !== "paragraph") return;
        const textNode = first.children?.find((child) => child.type === "text");
        if (!textNode?.value?.startsWith("[!")) return;
        const match = textNode.value.match(/^\[!(\w+)\]\s*/);
        if (!match) return;
        const kind = normalizeKind(match[1]);
        if (!kind) return;
        stripMarker(first, match[0]);
        setCalloutData(node, kind);
      }
    });
  };
}
