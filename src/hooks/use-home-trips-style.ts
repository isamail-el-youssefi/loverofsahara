import { useEffect, useState } from "react";
import { HOME_TRIPS_EVENT, getStoredHomeTripsStyle } from "@/lib/themes";

/** Currently selected home "Popular Sahara Trips" layout; updates live when changed in the theme switcher. */
export function useHomeTripsStyle() {
  const [style, setStyle] = useState(getStoredHomeTripsStyle);
  useEffect(() => {
    const sync = () => setStyle(getStoredHomeTripsStyle());
    window.addEventListener(HOME_TRIPS_EVENT, sync);
    return () => window.removeEventListener(HOME_TRIPS_EVENT, sync);
  }, []);
  return style;
}
