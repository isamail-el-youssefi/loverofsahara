import { useEffect, useState } from "react";
import { BROCHURES_EVENT, getStoredBrochuresStyle } from "@/lib/themes";

/** Currently selected Brochures page design; updates live when changed in the theme switcher. */
export function useBrochuresStyle() {
  const [style, setStyle] = useState(getStoredBrochuresStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredBrochuresStyle());
    window.addEventListener(BROCHURES_EVENT, sync);
    return () => window.removeEventListener(BROCHURES_EVENT, sync);
  }, []);
  return style;
}
