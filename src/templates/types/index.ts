export type { TemplateId } from "./base";
export type { BaseSite } from "./base";
export type { Theme } from "./base";

export type { AgencySite, AgencyPages, AgencyOffer } from "./agency";
export type { SaasSite, SaasPages, SaasProduct } from "./saas";
export type { ConsultingSite, ConsultingPages, ConsultingProfile } from "./consulting";
export type { TradesSite, TradesPages, TradesProfile, TradesBusinessBasics } from "./trades";
export type { RetailSite, RetailPages, RetailProfile, RetailBusinessBasics } from "./retail";
export type { FintechSite, FintechPages, FintechProduct, FintechTrust } from "./fintech";

export type SiteConfig =
  | import("./agency").AgencySite
  | import("./saas").SaasSite
  | import("./consulting").ConsultingSite
  | import("./trades").TradesSite
  | import("./retail").RetailSite
  | import("./fintech").FintechSite;
