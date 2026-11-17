import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GOOGLE_REVIEWS } from "./data";

/** The multicolour Google "G". */
export function GoogleLogo({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function Stars({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-[#FBBC05]", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

/** Link badge: Google logo, 5 stars, "5.0 · 21 Google reviews". */
export function GoogleReviewsBadge({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const { rating, count, url } = GOOGLE_REVIEWS;
  const external = url.startsWith("http");
  return (
    <a
      href={url}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={`${rating.toFixed(1)} out of 5 on Google, ${count} reviews`}
      className={cn(
        "group inline-flex items-center gap-3 rounded-[10px] border px-4 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-current",
        tone === "dark"
          ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
          : "border-ink/15 bg-paper text-ink hover:bg-ink/[0.04]",
        className,
      )}
    >
      <GoogleLogo size={26} />
      <span className="flex flex-col gap-1 leading-none">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold tabular-nums">{rating.toFixed(1)}</span>
          <Stars />
        </span>
        <span className={cn("text-[12px]", tone === "dark" ? "text-white/65" : "text-neutral-500")}>
          {count} Google reviews
        </span>
      </span>
    </a>
  );
}
