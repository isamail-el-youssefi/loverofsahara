import { useIsMobile } from "@/hooks/use-mobile";

/** Trip intro layout (fixed, no switcher): brief + height on phones, facts beside the brief on desktop. */
export function useIntroStyle() {
  return useIsMobile() ? "row" : "side";
}
