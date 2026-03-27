import inventoryJson from "./prior-art.inventory.json";

export const priorArtKinds = [
  "product",
  "library",
  "app",
  "integration",
  "website",
  "prototype",
  "experiment",
  "venture",
  "internal-system",
  "legacy-code",
  "other",
] as const;

export const priorArtStatuses = [
  "active",
  "dormant",
  "archived",
  "prototype",
  "historical",
] as const;
export const priorArtKindOrder = priorArtKinds;
export const priorArtStatusOrder = priorArtStatuses;

export const priorArtVisibilityLevels = ["public", "private", "mixed"] as const;

export const priorArtDatePrecisions = ["exact", "month", "year", "approximate", "unknown"] as const;
export const priorArtEndDatePrecisions = [...priorArtDatePrecisions, "ongoing"] as const;

export type PriorArtKind = (typeof priorArtKinds)[number];
export type PriorArtStatus = (typeof priorArtStatuses)[number];
export type PriorArtVisibility = (typeof priorArtVisibilityLevels)[number];
export type PriorArtDatePrecision = (typeof priorArtDatePrecisions)[number];
export type PriorArtEndPrecision = (typeof priorArtEndDatePrecisions)[number];

export interface PriorArtLink {
  label: string;
  url: string;
  type: string;
  note?: string | null;
}

export interface PriorArtInventoryEntry {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  portfolio: string;
  group?: string | null;
  kind: PriorArtKind;
  status: PriorArtStatus;
  visibility: PriorArtVisibility;
  ownerLabel: string;
  started: string | null;
  startedPrecision: PriorArtDatePrecision;
  ended: string | null;
  endedPrecision: PriorArtEndPrecision;
  publicSummary: string;
  notesPublic: string | null;
  tags: string[];
  domains: string[];
  publicLinks: PriorArtLink[];
  evidencePublic: PriorArtLink[];
  relatedIds: string[];
}

export type PriorArtEntry = PriorArtInventoryEntry;

export interface PriorArtTreeNode extends PriorArtInventoryEntry {
  children: PriorArtTreeNode[];
}

type PriorArtInventoryDocument = {
  version: number;
  updated: string;
  entries: Array<
    Omit<PriorArtInventoryEntry, "portfolio"> & {
      portfolio?: string | null;
      group?: string | null;
    }
  >;
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const exactFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const labelize = (value: string): string =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const isPublicUrl = (value: string): boolean => {
  if (!value) {
    return false;
  }

  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.endsWith(".local")
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const sanitizeLinks = <T extends PriorArtLink>(links: T[]): T[] =>
  Array.isArray(links) ? links.filter((link) => isPublicUrl(link.url)) : [];

const parseDateValue = (
  value: string | null,
  precision: PriorArtDatePrecision | PriorArtEndPrecision,
): Date | null => {
  if (!value || precision === "unknown" || precision === "ongoing") {
    return null;
  }

  if (precision === "year") {
    const year = Number.parseInt(value.slice(0, 4), 10);
    return Number.isNaN(year) ? null : new Date(Date.UTC(year, 0, 1));
  }

  if (precision === "month") {
    const [yearText, monthText] = value.split("-");
    const year = Number.parseInt(yearText ?? "", 10);
    const month = Number.parseInt(monthText ?? "", 10);
    if (Number.isNaN(year) || Number.isNaN(month)) {
      return null;
    }
    return new Date(Date.UTC(year, Math.max(month - 1, 0), 1));
  }

  if (precision === "approximate") {
    if (/^\d{4}$/.test(value)) {
      const year = Number.parseInt(value, 10);
      return Number.isNaN(year) ? null : new Date(Date.UTC(year, 0, 1));
    }

    if (/^\d{4}-\d{2}$/.test(value)) {
      const [yearText, monthText] = value.split("-");
      const year = Number.parseInt(yearText ?? "", 10);
      const month = Number.parseInt(monthText ?? "", 10);
      if (Number.isNaN(year) || Number.isNaN(month)) {
        return null;
      }
      return new Date(Date.UTC(year, Math.max(month - 1, 0), 1));
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = new Date(`${value}T00:00:00Z`);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getSortKey = (entry: Pick<PriorArtInventoryEntry, "started" | "startedPrecision">): number => {
  const parsed = parseDateValue(entry.started, entry.startedPrecision);
  return parsed ? parsed.getTime() : Number.POSITIVE_INFINITY;
};

const getTreeSortKey = (node: PriorArtTreeNode): number => {
  const childKeys = node.children.map(getTreeSortKey);
  const ownKey = getSortKey(node);
  return childKeys.length > 0 ? Math.min(ownKey, ...childKeys) : ownKey;
};

const normalizePortfolio = (entry: {
  portfolio?: string | null;
  group?: string | null;
}): string => {
  const candidate = entry.portfolio ?? entry.group;
  if (!candidate) {
    return "Independent records";
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : "Independent records";
};

const inventoryDocument = inventoryJson as PriorArtInventoryDocument;

export const priorArtEntries = inventoryDocument.entries.map((entry) => ({
  ...entry,
  portfolio: normalizePortfolio(entry),
  publicLinks: sanitizeLinks(entry.publicLinks),
  evidencePublic: sanitizeLinks(entry.evidencePublic),
}));

export const priorArtById = new Map(
  priorArtEntries.map((entry) => [entry.id, entry] as const),
);

export const priorArtInventory = {
  version: inventoryDocument.version,
  updated: inventoryDocument.updated,
  entries: priorArtEntries,
};
export const priorArtEntryMap = priorArtById;

export const formatPriorArtEnum = (value: string): string => labelize(value);

export const getPriorArtKindLabel = (kind: PriorArtKind): string => formatPriorArtEnum(kind);
export const getPriorArtStatusLabel = (status: PriorArtStatus): string => formatPriorArtEnum(status);
export const getPriorArtVisibilityLabel = (visibility: PriorArtVisibility): string =>
  formatPriorArtEnum(visibility);
export const formatPriorArtKind = getPriorArtKindLabel;

export const formatPriorArtDate = (
  value: string | null,
  precision: PriorArtDatePrecision | PriorArtEndPrecision,
): string => {
  if (precision === "ongoing") {
    return "present";
  }

  if (!value || precision === "unknown") {
    return "unknown";
  }

  if (precision === "year") {
    return value.slice(0, 4);
  }

  if (precision === "approximate") {
    const parsed = parseDateValue(value, "month");
    if (!parsed) {
      return `c. ${value}`;
    }

    const rendered = /^\d{4}$/.test(value) ? value : monthFormatter.format(parsed);
    return `c. ${rendered}`;
  }

  const parsed = parseDateValue(value, precision);
  if (!parsed) {
    return "unknown";
  }

  if (precision === "month") {
    return monthFormatter.format(parsed);
  }

  return exactFormatter.format(parsed);
};

export const formatPriorArtRange = (entry: PriorArtInventoryEntry): string => {
  const started = formatPriorArtDate(entry.started, entry.startedPrecision);
  const ended = formatPriorArtDate(entry.ended, entry.endedPrecision);

  if (started === "unknown" && ended === "unknown") {
    return "unknown";
  }

  if (ended === "ongoing") {
    return started === "unknown" ? "unknown - present" : `${started} - present`;
  }

  if (ended === "unknown") {
    return started;
  }

  if (started === "unknown") {
    return ended;
  }

  if (started === ended) {
    return started;
  }

  return `${started} - ${ended}`;
};

export const formatPriorArtDateRange = formatPriorArtRange;

export const sortPriorArtChronologically = (
  entries: PriorArtInventoryEntry[],
): PriorArtInventoryEntry[] =>
  [...entries].sort((left, right) => {
    const leftValue = getSortKey(left);
    const rightValue = getSortKey(right);

    if (leftValue === rightValue) {
      return left.title.localeCompare(right.title, "en");
    }

    return leftValue - rightValue;
  });

const createNode = (entry: PriorArtInventoryEntry): PriorArtTreeNode => ({
  ...entry,
  children: [],
});

const sortNodes = (nodes: PriorArtTreeNode[]): PriorArtTreeNode[] =>
  [...nodes]
    .sort((left, right) => {
      const leftKey = getTreeSortKey(left);
      const rightKey = getTreeSortKey(right);

      if (leftKey !== rightKey) {
        return leftKey - rightKey;
      }

      return left.title.localeCompare(right.title, "en");
    })
    .map((node) => ({
      ...node,
      children: sortNodes(node.children),
    }));

export const buildPriorArtTree = (
  entries: PriorArtInventoryEntry[] = priorArtEntries,
): PriorArtTreeNode[] => {
  const byId = new Map<string, PriorArtTreeNode>();
  const roots: PriorArtTreeNode[] = [];

  for (const entry of entries) {
    byId.set(entry.id, createNode(entry));
  }

  for (const entry of entries) {
    const node = byId.get(entry.id);
    if (!node) {
      continue;
    }

    const parent = entry.parentId ? byId.get(entry.parentId) : null;
    if (parent) {
      parent.children.push(node);
      continue;
    }

    roots.push(node);
  }

  return sortNodes(roots);
};

export const flattenPriorArtTree = (nodes: PriorArtTreeNode[]): PriorArtTreeNode[] =>
  nodes.flatMap((node) => [node, ...flattenPriorArtTree(node.children)]);

export const getPriorArtParent = (
  entry: PriorArtInventoryEntry,
): PriorArtInventoryEntry | null =>
  entry.parentId ? priorArtById.get(entry.parentId) ?? null : null;

export const getPriorArtRelatedEntries = (
  entry: PriorArtInventoryEntry,
): PriorArtInventoryEntry[] =>
  entry.relatedIds
    .map((relatedId) => priorArtById.get(relatedId))
    .filter((related): related is PriorArtInventoryEntry => Boolean(related));

export interface PriorArtGroupEntry {
  name: string;
  parents: PriorArtInventoryEntry[];
  childMap: Map<string, PriorArtInventoryEntry[]>;
}

export const getPriorArtGroupEntries = (): PriorArtGroupEntry[] => {
  const tree = buildPriorArtTree(priorArtEntries);
  const parents = sortPriorArtChronologically(tree);

  const groups = new Map<
    string,
    {
      name: string;
      parents: PriorArtInventoryEntry[];
      childMap: Map<string, PriorArtInventoryEntry[]>;
      order: number;
    }
  >();

  parents.forEach((parent, index) => {
    const group = groups.get(parent.portfolio) ?? {
      name: parent.portfolio,
      parents: [],
      childMap: new Map<string, PriorArtInventoryEntry[]>(),
      order: index,
    };

    if (!groups.has(parent.portfolio)) {
      group.order = index;
    }

    group.parents.push(parent);
    group.childMap.set(
      parent.id,
      sortPriorArtChronologically(
        priorArtEntries.filter((entry) => entry.parentId === parent.id),
      ),
    );
    groups.set(parent.portfolio, group);
  });

  return [...groups.values()]
    .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name, "en"))
    .map(({ name, parents: groupParents, childMap }) => ({
      name,
      parents: groupParents,
      childMap,
    }));
};

export const getPriorArtTimelineEntries = (): PriorArtInventoryEntry[] =>
  sortPriorArtChronologically(priorArtEntries);

export const getPriorArtChildren = (
  parentId: string,
): PriorArtInventoryEntry[] =>
  sortPriorArtChronologically(
    priorArtEntries.filter((entry) => entry.parentId === parentId),
  );

export const getPriorArtGroups = (): PriorArtGroupEntry[] => getPriorArtGroupEntries();

export const getPriorArtTimeline = (): PriorArtInventoryEntry[] => getPriorArtTimelineEntries();

export const getPriorArtSearchText = (entry: PriorArtInventoryEntry): string =>
  [
    entry.title,
    entry.publicSummary,
    entry.notesPublic ?? "",
    entry.portfolio,
    entry.kind,
    entry.status,
    entry.visibility,
    entry.ownerLabel,
    ...entry.tags,
    ...entry.domains,
    ...entry.publicLinks.flatMap((link) => [link.label, link.url, link.type, link.note ?? ""]),
    ...entry.evidencePublic.flatMap((link) => [link.label, link.url, link.type, link.note ?? ""]),
    ...getPriorArtRelatedEntries(entry).map((related) => related.title),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
