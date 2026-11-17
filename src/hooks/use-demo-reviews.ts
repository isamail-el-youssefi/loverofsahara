import { useEffect, useState } from "react";

const KEY = "los-demo-reviews";
const EVENT = "los-demo-reviews-change";

/** The demo switch only exists while developing; in a production build it is always off. */
export const DEMO_REVIEWS_AVAILABLE = import.meta.env.DEV;

/** Stored choice; in development the demo reviews are ON until someone switches them off. */
function read(): boolean {
  if (!DEMO_REVIEWS_AVAILABLE) return false;
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setDemoReviews(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Whether preview (invented) reviews are switched on. Always false in production. */
export function useDemoReviews() {
  const [on, setOn] = useState(read);
  useEffect(() => {
    const sync = () => setOn(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return on;
}
