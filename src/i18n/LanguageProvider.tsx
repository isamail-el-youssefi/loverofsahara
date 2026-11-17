import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LANG, LANGUAGES, LANG_STORAGE_KEY, detectLang, type Lang } from "./languages";
import { UI, type UiStrings } from "./ui";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  ui: UiStrings;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  ui: UI[DEFAULT_LANG],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  // keep <html lang> in step with the chosen language (accessibility, SEO, correct CJK fonts)
  useEffect(() => {
    document.documentElement.lang = LANGUAGES.find((l) => l.code === lang)?.htmlLang ?? lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang, ui: UI[lang] }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
