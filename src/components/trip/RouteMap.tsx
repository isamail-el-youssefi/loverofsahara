import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapStop {
  name: string;
  lat: number;
  lng: number;
}

interface RouteMapProps {
  stops: MapStop[];
  /** Stops to emphasise (hovered in the list, on the map, or belonging to the day in view); others fade back. */
  active: number[];
  onActive?: (index: number | null) => void;
  /** Light tiles for paper bands, dark tiles for the dark band. */
  tone?: "light" | "dark";
  className?: string;
  /** Single-place maps: a pulsing dot with the place's name beside it, instead of a numbered pin. */
  named?: boolean;
}

/** Names go into marker HTML, so escape them. */
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/** Esri's grey "Canvas" basemap + labels: free without an API key (CARTO's public tiles now require one). */
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
const tileUrl = (tone: "light" | "dark", layer: "Base" | "Reference") =>
  `${ESRI}/World_${tone === "dark" ? "Dark" : "Light"}_Gray_${layer}/MapServer/tile/{z}/{y}/{x}`;

/**
 * The trip's route: numbered stops joined in order. Stops are language-neutral coordinates from
 * `trips.meta.json`. Wheel zoom stays off until the map is clicked so it never hijacks page scrolling.
 */
export function RouteMap({ stops, active, onActive, tone = "light", className = "", named = false }: RouteMapProps) {
  const host = useRef<HTMLDivElement>(null);
  const markers = useRef<L.Marker[]>([]);
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  useEffect(() => {
    const el = host.current;
    if (!el || stops.length === 0) return;

    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer(tileUrl(tone, "Base"), {
      attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
      maxZoom: 16,
    }).addTo(map);
    L.tileLayer(tileUrl(tone, "Reference"), { maxZoom: 16, pane: "shadowPane" }).addTo(map);

    const points = stops.map((s) => [s.lat, s.lng] as L.LatLngTuple);
    if (points.length > 1) {
      L.polyline(points, { className: "route-line", weight: 2, opacity: 1, dashArray: "2 6", lineCap: "round" }).addTo(map);
    }

    markers.current = stops.map((s, i) => {
      const m = L.marker([s.lat, s.lng], {
        icon: L.divIcon({
          className: "route-pin-wrap",
          html: named
            ? `<span class="route-pin route-pin--dot"></span><span class="route-pin-label">${escapeHtml(s.name)}</span>`
            : `<span class="route-pin"><b>${i + 1}</b></span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
        keyboard: false,
        title: s.name,
      }).addTo(map);
      m.on("mouseover", () => onActiveRef.current?.(i));
      m.on("mouseout", () => onActiveRef.current?.(null));
      return m;
    });

    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 9 });

    // Touch screens: one finger scrolls the page (it used to be swallowed by the map); two fingers pinch to zoom and pan.
    if (L.Browser.mobile) map.dragging.disable();

    // Page scroll first: enable wheel zoom only after a click, release when the pointer leaves.
    map.on("click", () => map.scrollWheelZoom.enable());
    el.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      map.remove();
      markers.current = [];
    };
  }, [stops, tone, named]);

  // Emphasise the active stop, fade the rest (like Red Dot's regions: 10% vs 100%).
  useEffect(() => {
    markers.current.forEach((m, i) => {
      const pin = m.getElement()?.querySelector(".route-pin");
      if (!pin) return;
      const on = active.includes(i);
      pin.classList.toggle("is-active", on);
      pin.classList.toggle("is-dim", active.length > 0 && !on);
      m.setZIndexOffset(on ? 1000 : 0);
    });
  }, [active, stops, tone]);

  return (
    <div
      ref={host}
      data-lenis-prevent
      role="region"
      aria-label="Route map"
      className={`route-map route-map--${tone} ${className}`}
    />
  );
}
