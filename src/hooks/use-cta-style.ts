import { useEffect, useState } from "react";
import { CTA_EVENT, getStoredCtaStyle } from "@/lib/themes";

/** Currently selected home call-to-action design; updates live when changed in the theme switcher. */
export function useCtaStyle() {
  const [style, setStyle] = useState(getStoredCtaStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredCtaStyle());
    window.addEventListener(CTA_EVENT, sync);
    return () => window.removeEventListener(CTA_EVENT, sync);
  }, []);
  return style;
}
