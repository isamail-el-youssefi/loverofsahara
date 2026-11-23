import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { localePath, splitLocale, localizedRouteLang } from "@/lib/routes";
import { DEFAULT_LANG, LANGUAGES, LANG_STORAGE_KEY, detectLang, isLang, type Lang } from "./languages";
import { SITE, type SiteStrings } from "./site";
import { UI, type UiStrings } from "./ui";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  ui: UiStrings;
  /** Home page, About page and footer text. */
  site: SiteStrings;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  ui: UI[DEFAULT_LANG],
  site: SITE[DEFAULT_LANG],
});

const remember = (next: Lang) => {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, next);
  } catch {
    /* storage unavailable */
  }
};

/** The language the visitor chose on purpose (never the browser language), or undefined. */
function chosenLang(): Lang | undefined {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(v) ? v : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The address on first load. "/" is the English home page, so a visitor who chose another language earlier is taken
 * to that language's home page ("/fr") before anything renders. Only a saved choice does this: never the browser
 * language, and a crawler has no saved choice, so it always sees both versions.
 */
function initialPathname() {
  const { pathname, search, hash } = window.location;
  const chosen = chosenLang();
  if (pathname === "/" && chosen && chosen !== "en") {
    window.history.replaceState(null, "", `${localePath(chosen, "/")}${search}${hash}`);
    return window.location.pathname;
  }
  return pathname;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Lang>(detectLang);
  const [pathname, setPathname] = useState(initialPathname);

  // Follow the address bar (back/forward, and App's own navigation, which fires "los-urlchange" or popstate).
  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("los-urlchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("los-urlchange", sync);
    };
  }, []);

  // On the pages that exist in every language (home, About, trips) the URL decides the language (/fr/trips/x is
  // French, /trips/x is English), so every version always shows its own language, whatever the visitor chose
  // before. On the other pages the saved choice stays.
  const urlLang = localizedRouteLang(pathname);
  const lang: Lang = isLang(urlLang) ? urlLang : stored;

  // Someone who opens a French page is reading French: keep that for the other pages too.
  useEffect(() => {
    const prefixed = splitLocale(pathname).lang;
    if (isLang(prefixed) && localizedRouteLang(pathname)) {
      setStored(prefixed);
      remember(prefixed);
    }
  }, [pathname]);

  // keep <html lang> in step with the chosen language (accessibility, SEO, correct CJK fonts)
  useEffect(() => {
    document.documentElement.lang = LANGUAGES.find((l) => l.code === lang)?.htmlLang ?? lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setStored(next);
    remember(next);
    // On these pages the language is part of the URL: go to the same page in the new language.
    const { pathname: here, search, hash } = window.location;
    if (localizedRouteLang(here) !== undefined) {
      const target = localePath(next, splitLocale(here).path) + search + hash;
      if (target !== here + search + hash) {
        window.history.pushState(null, "", target);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang, ui: UI[lang], site: SITE[lang] }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
