import type { Lang } from "../languages";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import type { SiteStrings } from "./types";
import { zh } from "./zh";

export type { SiteStrings } from "./types";

/** Home page, About page and footer text, by language. */
export const SITE: Record<Lang, SiteStrings> = { en, fr, de, es, it, zh };
