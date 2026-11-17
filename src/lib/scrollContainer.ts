import { createContext, useContext, type RefObject } from "react";

/** The element that scrolls for the current page (the nested `#swup` container). */
export const ScrollContainerContext = createContext<RefObject<HTMLElement | null> | null>(null);

/** Framer Motion `useScroll` option so scroll progress reads from the page container, not window. */
export function useScrollContainer() {
  const ref = useContext(ScrollContainerContext);
  return ref ? ({ container: ref } as { container: RefObject<HTMLElement> }) : {};
}
