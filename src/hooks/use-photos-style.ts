import { useEffect, useState } from "react";
import { PHOTOS_EVENT, getStoredPhotosStyle } from "@/lib/themes";

/** Currently selected Gallery page design; updates live when changed in the theme switcher. */
export function usePhotosStyle() {
  const [style, setStyle] = useState(getStoredPhotosStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredPhotosStyle());
    window.addEventListener(PHOTOS_EVENT, sync);
    return () => window.removeEventListener(PHOTOS_EVENT, sync);
  }, []);
  return style;
}
