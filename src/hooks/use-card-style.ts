import { useEffect, useState } from "react";
import { CARD_EVENT, getStoredCardStyle } from "@/lib/themes";

/** Currently selected trip-card design; updates live when changed in the theme switcher. */
export function useCardStyle() {
  const [style, setStyle] = useState(getStoredCardStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredCardStyle());
    window.addEventListener(CARD_EVENT, sync);
    return () => window.removeEventListener(CARD_EVENT, sync);
  }, []);
  return style;
}
