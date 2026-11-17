import { useState } from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LANGUAGE_NAMES, formatReviewDate, type Review, type ReviewSummary } from "@/lib/reviews";

/** Labels that only exist in the reviews section (English for now, like the rest of the trip page labels). */
export const RT = {
  eyebrow: "Reviews",
  title: "What travellers say",
  add: "Add a review",
  basedOn: (n: number) => `Based on ${n} ${n === 1 ? "review" : "reviews"}`,
  emptyTitle: "No reviews yet",
  emptyLead: "Been on this journey? Tell the next traveller what it was really like.",
  firstLine: "Be the first to tell this story.",
  original: (lang: Review["lang"]) => `Original review · ${LANGUAGE_NAMES[lang]}`,
  reply: "Reply from Lover of Sahara",
  readMore: "Read more",
  readLess: "Show less",
} as const;

/** Marks an invented preview review so it can never be mistaken for a real one. */
export function DemoTag({ dark = false }: { dark?: boolean }) {
  return (
    <span
      title="Invented review for previewing the layout"
      className={`rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] ${
        dark ? "border-white/30 text-white/70" : "border-ink/25 text-ink/55"
      }`}
    >
      Demo
    </span>
  );
}

/** Star rating (display). Filled stars use the brand colour. */
export function Stars({ value, size = 16, className = "" }: { value: number; size?: number; className?: string }) {
  const filled = Math.round(value);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          aria-hidden
          strokeWidth={1.6}
          className={n <= filled ? "fill-current text-brand" : "text-current opacity-25"}
        />
      ))}
    </span>
  );
}

/** Review text that can run long (some are over a thousand characters): clamps, with a read more toggle. */
export function ReviewText({
  text,
  lines = 5,
  className = "",
  dark = false,
}: {
  text: string;
  lines?: number;
  className?: string;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const long = text.length > 280;
  const clamp = !open && long ? { WebkitLineClamp: lines } : undefined;
  return (
    <div className={className}>
      <p
        className={`whitespace-pre-line ${!open && long ? "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]" : ""}`}
        style={clamp}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`mt-2 text-[13px] font-medium underline underline-offset-4 outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 ${
            dark ? "text-white focus-visible:ring-white/60" : "text-ink focus-visible:ring-ink/40"
          }`}
        >
          {open ? RT.readLess : RT.readMore}
        </button>
      )}
    </div>
  );
}

/** ImageKit URLs can be resized on the fly. */
const sized = (url: string, w: number) => (url.includes("imagekit.io") && !url.includes("?") ? `${url}?tr=w-${w},q-80` : url);

/** Small photo thumbnails that open larger in a lightbox. */
export function PhotoStrip({ photos, name, className = "" }: { photos: string[]; name: string; className?: string }) {
  const [shown, setShown] = useState<string | null>(null);
  if (!photos.length) return null;
  return (
    <>
      <ul className={`flex flex-wrap gap-2 ${className}`}>
        {photos.map((p, i) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => setShown(p)}
              aria-label={`Open photo ${i + 1} from ${name}'s review`}
              className="block h-16 w-20 overflow-hidden rounded-lg bg-ink/[0.06] outline-none ring-offset-2 transition-transform hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-ink/50 md:h-[72px] md:w-24"
            >
              <img src={sized(p, 240)} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={shown !== null} onOpenChange={(o) => !o && setShown(null)}>
        <DialogContent className="max-w-[min(92vw,1100px)] border-0 bg-transparent p-0 shadow-none sm:rounded-2xl">
          <DialogTitle className="sr-only">Photo from {name}&apos;s review</DialogTitle>
          <DialogDescription className="sr-only">Enlarged review photo</DialogDescription>
          {shown && (
            <img src={sized(shown, 1800)} alt={`Photo from ${name}'s review`} className="max-h-[86dvh] w-full rounded-2xl object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/** The owner's public answer to a review. */
export function ReplyBlock({ reply, dark = false, className = "" }: { reply: NonNullable<Review["reply"]>; dark?: boolean; className?: string }) {
  return (
    <div className={`border-l-2 pl-4 ${dark ? "border-white/25" : "border-brand/50"} ${className}`}>
      <p className={`text-[12px] font-medium uppercase tracking-[0.12em] ${dark ? "text-white/55" : "text-ink/50"}`}>
        {RT.reply}
        {reply.date ? ` · ${formatReviewDate(reply.date)}` : ""}
      </p>
      <p className={`mt-1.5 whitespace-pre-line text-[14.5px] leading-[1.65] ${dark ? "text-white/75" : "text-ink/75"}`}>{reply.text}</p>
    </div>
  );
}

/** Big average, stars, and a bar per star count. */
export function RatingSummary({ summary, className = "" }: { summary: ReviewSummary; className?: string }) {
  const max = Math.max(1, ...summary.perStar);
  return (
    <div className={className}>
      <div className="flex items-end gap-4">
        <span className="text-[72px] font-light leading-none tracking-[-0.04em] tabular-nums md:text-[88px]">
          {summary.average.toFixed(1)}
        </span>
        <div className="pb-2">
          <Stars value={summary.average} size={18} />
          <p className="mt-1.5 text-[13px] text-ink/60">{RT.basedOn(summary.count)}</p>
        </div>
      </div>
      <ul className="mt-6 flex flex-col gap-2" aria-label="Ratings breakdown">
        {[5, 4, 3, 2, 1].map((n) => {
          const count = summary.perStar[n - 1] ?? 0;
          return (
            <li key={n} className="flex items-center gap-3 text-[12.5px] text-ink/65">
              <span className="w-3 tabular-nums">{n}</span>
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                <span className="absolute inset-y-0 left-0 rounded-full bg-brand" style={{ width: `${(count / max) * 100}%` }} />
              </span>
              <span className="w-4 text-right tabular-nums">{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
