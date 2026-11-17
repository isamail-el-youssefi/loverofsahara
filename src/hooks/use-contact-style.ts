import { useEffect, useState } from "react";
import { CONTACT_EVENT, getStoredContactStyle } from "@/lib/themes";

/** Currently selected Contact page design; updates live when changed in the theme switcher. */
export function useContactStyle() {
  const [style, setStyle] = useState(getStoredContactStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredContactStyle());
    window.addEventListener(CONTACT_EVENT, sync);
    return () => window.removeEventListener(CONTACT_EVENT, sync);
  }, []);
  return style;
}
