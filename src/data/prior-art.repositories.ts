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
  fork: boolean;
  default_branch: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
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

export const formatPriorArtRepositoryDate = (value: string | null | undefined): string => {
  if (!value) {
    return "unknown";
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return "unknown";
  }

  return monthYearFormatter.format(parsed);
};

export const getPriorArtRepositoryLanguage = (repository: PriorArtRepository): string =>
  labelize(repository.language);

export const getPriorArtRepositoryBranch = (repository: PriorArtRepository): string =>
  repository.default_branch?.trim() || "unknown";

export const getPriorArtRepositoryLink = (
  repository: PriorArtRepository,
): string | null => (repository.visibility === "public" ? repository.html_url : null);

export const getPriorArtRepositoryDescription = (repository: PriorArtRepository): string | null => {
  const description = repository.description?.trim();
  return description && description.length > 0 ? description : null;
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
      repositories,
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
