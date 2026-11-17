import { useEffect, useState } from "react";
import { loadLocalizedTrips, type LocalizedTrip } from "@/data/trips";
import { useLanguage } from "@/i18n/LanguageProvider";

/** All trips in the current language (English fallback per field). Reloads when the language changes. */
export function useTrips() {
  const { lang } = useLanguage();
  const [trips, setTrips] = useState<LocalizedTrip[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    loadLocalizedTrips(lang)
      .then((t) => {
        if (cancelled) return;
        setTrips(t);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { trips, status, lang };
}
