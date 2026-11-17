import { useEffect, useState } from "react";
import { GALLERY_EVENT, getStoredGalleryStyle } from "@/lib/themes";

/** Currently selected place-page gallery; updates live when changed in the theme switcher. */
export function useGalleryStyle() {
  const [style, setStyle] = useState(getStoredGalleryStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredGalleryStyle());
    window.addEventListener(GALLERY_EVENT, sync);
    return () => window.removeEventListener(GALLERY_EVENT, sync);
  }, []);
  return style;
}
