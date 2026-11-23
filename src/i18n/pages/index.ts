import type { Lang } from "../languages";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import type { PageStrings } from "./types";
import { zh } from "./zh";

export type { PageStrings } from "./types";

/** Contact, gallery tags, blog and the last home page pieces, by language. */
export const PAGES: Record<Lang, PageStrings> = { en, fr, de, es, it, zh };
