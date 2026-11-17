import { useEffect, useState } from "react";
import { ABOUT_EVENT, getStoredAboutStyle } from "@/lib/themes";

/** Currently selected About page design; updates live when changed in the theme switcher. */
export function useAboutStyle() {
  const [style, setStyle] = useState(getStoredAboutStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredAboutStyle());
    window.addEventListener(ABOUT_EVENT, sync);
    return () => window.removeEventListener(ABOUT_EVENT, sync);
  }, []);
  return style;
}
