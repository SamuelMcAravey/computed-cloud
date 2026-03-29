import repositoryCatalogJson from "./prior-art.repositories.json";

export interface PriorArtRepository {
  name: string;
  full_name: string;
  private: boolean;
  visibility: "public" | "private" | "internal";
  description: string | null;
  summary?: string | null;
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
      case "app":
        return `${ownerLabel} application`;
      case "bighornfoundry":
        return "Bighorn Foundry repository";
      case "docs":
        return `${ownerLabel} documentation site`;
      case "iam":
        return "IAM repository";
      case "internal":
        return "Internal repository";
      case "marketing":
        return `${ownerLabel} marketing site`;
      case "platform":
        return `${ownerLabel} platform`;
      case "monadsharp":
        return "MonadSharp library";
      case "rxwrappers":
        return "Reactive wrappers library";
      case "template":
        return "Template repository";
      case "toolbox":
        return "Tooling repository";
      case "site":
      case "www":
        return `${ownerLabel} website`;
      default:
        return `${tokens[0]} repository`;
    }
  }

  const joinedLower = tokens.join(" ").toLowerCase();
  if (joinedLower === "document library file transfer") {
    return "File transfer component for the document library";
  }
  if (joinedLower === "drive storage management sql") {
    return "SQL storage backend for the drive storage management layer";
  }
  if (joinedLower === "drive storage management abstractions") {
    return "Drive storage management abstractions";
  }
  if (joinedLower === "drive storage management azureblob") {
    return "Azure Blob storage adapter for the drive storage system";
  }
  if (joinedLower === "drive storage management amazons3") {
    return "Amazon S3 storage adapter for the drive storage system";
  }
  if (joinedLower === "drive storage management") {
    return "Drive storage management layer";
  }
  if (joinedLower === "integrations cloudflare") {
    return "Cloudflare integration components";
  }
  if (joinedLower === "integrations electronicnotary") {
    return "Electronic notary integration components";
  }
  if (joinedLower === "integrations postmark") {
    return "Postmark integration components";
  }
  if (joinedLower === "integrations private") {
    return "Private integration components";
  }
  if (joinedLower === "integrations public") {
    return "Public integration components";
  }
  if (joinedLower === "integrations workos") {
    return "WorkOS integration components";
  }
  if (joinedLower === "vh all") {
    return "VendorHub umbrella repository";
  }
  if (joinedLower === "vh dashboard") {
    return "VendorHub dashboard";
  }
  if (joinedLower === "vh docs") {
    return "VendorHub documentation site";
  }
  if (joinedLower === "vh document library") {
    return "VendorHub document library";
  }
  if (joinedLower === "vh document library file transfer") {
    return "File transfer component for the VendorHub document library";
  }
  if (joinedLower === "vh forms") {
    return "VendorHub forms application";
  }
  if (joinedLower === "vh marketing") {
    return "VendorHub marketing site";
  }
  if (joinedLower === "approvum www") {
    return "Approvum website";
  }
  if (joinedLower === "request relay" || joinedLower === "requestrelay") {
    return "Request Relay service";
  }
  if (joinedLower === "tradefile www") {
    return "Tradefile website";
  }
  if (joinedLower === "tradefile") {
    return "Tradefile platform";
  }
  if (joinedLower === "infra bootstrap") {
    return "Infrastructure bootstrap tooling";
  }
  if (joinedLower === "job app assistant") {
    return "Job application assistant tooling";
  }
  if (joinedLower === "freshdesk agent") {
    return "Freshdesk agent tooling";
  }
  if (joinedLower === "ai writing styles") {
    return "AI writing style reference";
  }
  if (joinedLower === "membership reboot tutorial") {
    return "MembershipReboot tutorial";
  }
  if (joinedLower === "monad sharp") {
    return "MonadSharp library";
  }
  if (joinedLower === "rx wrappers") {
    return "Reactive wrappers library";
  }
  if (joinedLower === "cloud events" || joinedLower === "cloudevents") {
    return "CloudEvents examples";
  }
  if (joinedLower === "bighornfoundry") {
    return "Bighorn Foundry repository";
  }

  if (joinedLower === ownerLabel.toLowerCase()) {
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

const normalizeRepositoryVisibility = (
  visibility: PriorArtRepository["visibility"],
): "public" | "private" => (visibility === "public" ? "public" : "private");

export const getPriorArtRepositoryVisibilityCounts = (): PriorArtRepositoryVisibilityCounts =>
  priorArtRepositories.reduce<PriorArtRepositoryVisibilityCounts>(
    (counts, repository) => {
      counts.total += 1;
      counts[normalizeRepositoryVisibility(repository.visibility)] += 1;
      return counts;
    },
    {
      total: 0,
      public: 0,
      private: 0,
    },
  );

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
  labelize(normalizeRepositoryVisibility(repository.visibility));

export const getPriorArtRepositoryVisibilityClass = (repository: PriorArtRepository): string => {
  switch (normalizeRepositoryVisibility(repository.visibility)) {
    case "public":
      return "border-primary/20 bg-primary/10 text-primary";
    case "private":
    default:
      return "border-border bg-bg/70 text-muted";
  }
};

export const getPriorArtRepositoryLink = (
  repository: PriorArtRepository,
): string | null => (repository.visibility === "public" ? repository.html_url : null);

export const getPriorArtRepositoryDescription = (repository: PriorArtRepository): string | null => {
  const summary = repository.summary?.trim();
  if (summary && summary.length > 0) {
    return summary;
  }

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
        return left.full_name.localeCompare(right.full_name, "en");
      }),
    }))
    .sort((left, right) => {
      return left.owner.localeCompare(right.owner, "en");
    });
};
