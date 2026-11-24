import { useEffect } from "react";

/**
 * Sets the phone's status bar / address bar colour (`<meta name="theme-color">`) while a page is shown,
 * then puts the previous colour back. The site default is set in index.html (the paper colour).
 */
export function useThemeColor(color: string) {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const previous = meta.content;
    meta.content = color;
    return () => {
      if (!meta) return;
      if (created) meta.remove();
      else meta.content = previous;
    };
  }, [color]);
}
