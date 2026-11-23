import { useIsMobile } from "@/hooks/use-mobile";

/** Trip-page layout (fixed, no switcher): Red Dot on desktop, Cinematic on phones. */
export function useDetailStyle() {
  return useIsMobile() ? "cinematic" : "reddot";
}
