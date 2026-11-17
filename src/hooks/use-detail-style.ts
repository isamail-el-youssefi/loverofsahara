import { useEffect, useState } from "react";
import { DETAIL_EVENT, getStoredDetailStyle } from "@/lib/themes";

/** Currently selected trip-page layout; updates live when changed in the theme switcher. */
export function useDetailStyle() {
  const [style, setStyle] = useState(getStoredDetailStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredDetailStyle());
    window.addEventListener(DETAIL_EVENT, sync);
    return () => window.removeEventListener(DETAIL_EVENT, sync);
  }, []);
  return style;
}
