import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_IMAGES } from "@/data/siteImages";
import { TRIP_CATEGORIES, cityLabel, countByCategory, getTrips, tripImage, type TripCategory } from "@/data/trips";
import { useLanguage } from "@/i18n/LanguageProvider";
import { TRIPS_PATH } from "@/lib/routes";

/** Photo for each trip category (same photos as the home page category cards). */
const CATEGORY_PHOTO: Record<TripCategory, string> = {
  trip: CATEGORY_IMAGES.camps,
  excursion: CATEGORY_IMAGES.fourByFour,
  trekking: CATEGORY_IMAGES.caravans,
};

interface Entry {
  key: string;
  label: string;
  href: string;
  count: number;
  img: string;
}

/** Categories and departure cities with live trip counts and a real photo each. */
function useMenuData() {
  const { ui } = useLanguage();
  return useMemo(() => {
    const trips = getTrips();
    const counts = countByCategory(trips);
    const categories: Entry[] = TRIP_CATEGORIES.map((c) => ({
      key: c,
      label: ui.categories[c],
      href: `${TRIPS_PATH}?category=${c}`,
      count: counts[c],
      img: CATEGORY_PHOTO[c],
    }));
    const cityMap = new Map<string, Entry>();
    for (const t of trips) {
      const found = cityMap.get(t.departureCity);
      if (found) {
        found.count += 1;
        continue;
      }
      cityMap.set(t.departureCity, {
        key: t.departureCity,
        label: cityLabel(t.departureCity),
        href: `${TRIPS_PATH}?departure=${encodeURIComponent(t.departureCity)}`,
        count: 1,
        img: (t.cardImage && tripImage(t.cardImage, 700)) || CATEGORY_IMAGES.camps,
      });
    }
    const cities = [...cityMap.values()].sort((a, b) => b.count - a.count);
    return { categories, cities, total: trips.length };
  }, [ui]);
}

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.12em]";

/** Index: oversized typographic lists; the photo on the right follows the hovered entry. */
function Index() {
  const { ui } = useLanguage();
  const { categories, cities, total } = useMenuData();
  const [hover, setHover] = useState<Entry | undefined>(undefined);
  const shown = hover ?? categories[0];
  const row = (c: Entry) => (
    <a
      key={c.key}
      href={c.href}
      onMouseEnter={() => setHover(c)}
      onFocus={() => setHover(c)}
      className={`flex items-baseline gap-3 transition-colors ${
        hover && hover.key !== c.key ? "text-ink/30" : "text-ink"
      }`}
    >
      <span className="text-[clamp(34px,4.6vh,52px)] font-medium leading-[1.12] tracking-[-0.04em]">{c.label}</span>
      <span className="text-[13px] font-normal text-neutral-500">{c.count}</span>
    </a>
  );
  return (
    <div className="grid flex-1 grid-cols-12 gap-10 px-6 pb-12 pt-6 sm:px-8 md:px-12">
      <div className="col-span-3 flex flex-col">
        <p className={`${eyebrow} pb-4 text-neutral-500`}>{ui.navByCategory}</p>
        <div className="flex flex-col">{categories.map(row)}</div>
        <a href={TRIPS_PATH} className="group mt-auto inline-flex self-start pt-6 items-center gap-1.5 text-[14px] font-medium">
          {ui.navTrips} ({total}) <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="col-span-4">
        <p className={`${eyebrow} pb-4 text-neutral-500`}>{ui.navByDeparture}</p>
        <div className="flex flex-col">{cities.map(row)}</div>
      </div>
      <div className="relative col-span-5 min-h-[300px] overflow-hidden rounded-[12px] bg-neutral-200">
        {[...categories, ...cities].map((c) => (
          <img
            key={c.key}
            src={c.img}
            alt=""
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              shown?.key === c.key ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {shown && (
          <span className="absolute bottom-4 left-4 text-white">
            <span className="block text-[20px] font-semibold tracking-[-0.03em]">{shown.label}</span>
            <span className="text-[13px] text-white/75">{ui.showing(shown.count)}</span>
          </span>
        )}
      </div>
    </div>
  );
}

/** Content of the big mega-menu under the "Trips" link. The surface (background, height) is drawn by the Navbar so the two read as one. */
export function TripsMenuPanel() {
  return <Index />;
}
