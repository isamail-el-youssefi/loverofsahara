import { useEffect, useState } from "react";
import { INTRO_EVENT, getStoredIntroStyle } from "@/lib/themes";

/** Currently selected trip-page intro layout; updates live when changed in the theme switcher. */
export function useIntroStyle() {
  const [style, setStyle] = useState(getStoredIntroStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredIntroStyle());
    window.addEventListener(INTRO_EVENT, sync);
    return () => window.removeEventListener(INTRO_EVENT, sync);
  }, []);
  return style;
}
