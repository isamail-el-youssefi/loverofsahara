import { useEffect, useState } from "react";
import { REVIEW_EVENT, getStoredReviewStyle } from "@/lib/themes";

/** Currently selected reviews layout; updates live when changed in the theme switcher. */
export function useReviewStyle() {
  const [style, setStyle] = useState(getStoredReviewStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredReviewStyle());
    window.addEventListener(REVIEW_EVENT, sync);
    return () => window.removeEventListener(REVIEW_EVENT, sync);
  }, []);
  return style;
}
