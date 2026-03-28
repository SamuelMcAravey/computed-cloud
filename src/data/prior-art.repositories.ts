import repositoryCatalogJson from "./prior-art.repositories.json";

export interface PriorArtRepository {
  name: string;
  full_name: string;
  private: boolean;
  visibility: "public" | "private" | "internal";
  description: string | null;
  html_url: string | null;
  homepage: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
  earliest_commit_date?: string | null;
  latest_commit_date?: string | null;
  topics: string[];
}

interface PriorArtRepositoryCatalogDocument {
  version: number;
  updated: string;
  repositories: PriorArtRepository[];
}

export interface PriorArtRepositoryGroup {
  id: string;
  owner: string;
  repositories: PriorArtRepository[];
}

export interface PriorArtRepositoryVisibilityCounts {
  total: number;
  public: number;
  private: number;
  internal: number;
}

const repositoryDocument = repositoryCatalogJson as PriorArtRepositoryCatalogDocument;

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const labelize = (value: string | null | undefined): string => {
  if (!value) {
    return "unknown";
  }

  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const repositoryPrefixPattern = /^(?:rxn|vh|incursa|rixian)[-_.]+/i;
const repositoryWordAliases: Record<string, string> = {
  api: "API",
  aspnet: "ASP.NET",
  aspnetcore: "ASP.NET Core",
  cli: "CLI",
  db: "DB",
  http: "HTTP",
  sdk: "SDK",
  sql: "SQL",
  ui: "UI",
};

const toTitleCaseWord = (value: string): string => {
  if (!value) {
    return value;
  }

  const alias = repositoryWordAliases[value.toLowerCase()];
  if (alias) {
    return alias;
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
};

const buildRepositoryFallbackDescription = (repository: PriorArtRepository): string => {
  const ownerLabel = repository.full_name.split("/")[0] ?? repository.name;
  const normalizedTokens = repository.name
    .replace(repositoryPrefixPattern, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_.]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(toTitleCaseWord);

  const tokens = normalizedTokens.length > 0 ? normalizedTokens : [toTitleCaseWord(repository.name)];
  const lowered = tokens.map((token) => token.toLowerCase());

  if (tokens.length === 1) {
    switch (lowered[0]) {
      case "all":
        return "Umbrella repository";
      case "docs":
        return "Documentation repository";
      case "internal":
        return "Internal repository";
      case "template":
        return "Template repository";
      case "toolbox":
        return "Tooling repository";
      default:
        return `${tokens[0]} repository`;
    }
  }

  if (tokens.join(" ").toLowerCase() === ownerLabel.toLowerCase()) {
    return `${tokens.join(" ")} repository`;
  }

  return `${tokens.join(" ")} repository`;
};

export const priorArtRepositoryCatalog = repositoryDocument;

export const priorArtRepositories = repositoryDocument.repositories;

const getRepositoryOwner = (repository: PriorArtRepository): string =>
  repository.full_name.split("/")[0] ?? repository.full_name;

const getRepositoryGroupId = (owner: string): string =>
  owner
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getPriorArtRepositoryVisibilityCounts = (): PriorArtRepositoryVisibilityCounts =>
  priorArtRepositories.reduce<PriorArtRepositoryVisibilityCounts>(
    (counts, repository) => {
      counts.total += 1;
      counts[repository.visibility] += 1;
      return counts;
    },
    {
      total: 0,
      public: 0,
      private: 0,
      internal: 0,
    },
  );

const getRepositoryChronologyDate = (repository: PriorArtRepository): string =>
  repository.earliest_commit_date ?? repository.created_at;

export const formatPriorArtRepositoryDate = (value: string | null | undefined): string => {
  if (!value) {
    return "unknown";
  }

  let parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    parsed = new Date(`${value}T00:00:00Z`);
  }

  if (Number.isNaN(parsed.getTime())) {
    return "unknown";
  }

  return monthYearFormatter.format(parsed);
};

export const getPriorArtRepositoryDateRange = (repository: PriorArtRepository): string => {
  const start = repository.earliest_commit_date ?? repository.created_at;
  const end = repository.latest_commit_date ?? repository.updated_at;

  if (!start && !end) {
    return "unknown";
  }

  const startLabel = formatPriorArtRepositoryDate(start);
  const endLabel = formatPriorArtRepositoryDate(end);

  if (!start || !end || startLabel === endLabel) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
};

export const getPriorArtRepositoryVisibilityLabel = (repository: PriorArtRepository): string =>
  labelize(repository.visibility);

export const getPriorArtRepositoryVisibilityClass = (repository: PriorArtRepository): string => {
  switch (repository.visibility) {
    case "public":
      return "border-primary/20 bg-primary/10 text-primary";
    case "internal":
      return "border-accent/20 bg-accent/10 text-accent";
    case "private":
    default:
      return "border-border bg-bg/70 text-muted";
  }
};

export const getPriorArtRepositoryLink = (
  repository: PriorArtRepository,
): string | null => (repository.visibility === "public" ? repository.html_url : null);

export const getPriorArtRepositoryDescription = (repository: PriorArtRepository): string | null => {
  const description = repository.description?.trim();
  if (description && description.length > 0) {
    return description;
  }

  return buildRepositoryFallbackDescription(repository);
};

export const getPriorArtRepositoryGroups = (): PriorArtRepositoryGroup[] => {
  const groups = new Map<string, PriorArtRepository[]>();

  for (const repository of [...priorArtRepositories].sort((left, right) =>
    left.full_name.localeCompare(right.full_name, "en"),
  )) {
    const owner = getRepositoryOwner(repository);
    const group = groups.get(owner) ?? [];
    group.push(repository);
    groups.set(owner, group);
  }

  return [...groups.entries()]
    .map(([owner, repositories]) => ({
      id: getRepositoryGroupId(owner),
      owner,
      repositories: [...repositories].sort((left, right) => {
        const leftDate = getRepositoryChronologyDate(left);
        const rightDate = getRepositoryChronologyDate(right);

        if (leftDate !== rightDate) {
          return leftDate.localeCompare(rightDate, "en");
        }

        return left.full_name.localeCompare(right.full_name, "en");
      }),
    }))
    .sort((left, right) => {
      const leftSize = left.repositories.length;
      const rightSize = right.repositories.length;

      if (leftSize !== rightSize) {
        return rightSize - leftSize;
      }

      return left.owner.localeCompare(right.owner, "en");
    });
};
