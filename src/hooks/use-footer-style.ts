import { useEffect, useState } from "react";
import { FOOTER_EVENT, getStoredFooterStyle } from "@/lib/themes";

/** Currently selected footer design; updates live when changed in the theme switcher. */
export function useFooterStyle() {
  const [style, setStyle] = useState(getStoredFooterStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredFooterStyle());
    window.addEventListener(FOOTER_EVENT, sync);
    return () => window.removeEventListener(FOOTER_EVENT, sync);
  }, []);
  return style;
}
