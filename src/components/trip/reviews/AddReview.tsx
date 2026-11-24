import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, PenLine, Star, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { submitReview } from "@/lib/reviews";
import { fill } from "@/i18n/reviewStrings";
import { useReviewT } from "@/i18n/useReviewT";

const MIN_COMMENT = 20;
const MAX_COMMENT = 1500;
const MAX_PHOTOS = 4;
const MAX_PHOTO_MB = 8;

type Tone = "solid" | "light" | "outline";
const TONES: Record<Tone, string> = {
  solid: "bg-ink text-paper hover:opacity-90",
  light: "bg-paper text-ink hover:bg-neutral-100",
  outline: "border border-ink/25 text-ink hover:bg-ink/[0.05]",
};

const field =
  "w-full rounded-[10px] border bg-transparent px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus-visible:ring-2 focus-visible:ring-ink/40";

interface Errors {
  rating?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  comment?: string | undefined;
  photos?: string | undefined;
}

/**
 * The "Add a review" button and its form. Send calls `submitReview` (src/lib/reviews.ts), which posts to the
 * reviews API (functions/api/reviews.ts); the review is published immediately.
 */
export function AddReviewButton({
  tripSlug,
  tripTitle,
  tone = "solid",
  className = "",
}: {
  tripSlug: string;
  tripTitle: string;
  tone?: Tone;
  className?: string;
}) {
  const RT = useReviewT();
  const WORDS = RT.words;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Previews of the chosen photos (revoked when they change or the form closes).
  const previews = useMemo(() => photos.map((f) => URL.createObjectURL(f)), [photos]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const reset = () => {
    setStatus("idle");
    setRating(0);
    setHoverRating(0);
    setName("");
    setEmail("");
    setComment("");
    setPhotos([]);
    setErrors({});
    setFailure("");
  };

  const onOpenChange = (o: boolean) => {
    setOpen(o);
    // Start fresh next time, but keep what was typed if it was closed by accident mid-way.
    if (!o && status === "done") reset();
  };

  const addPhotos = (list: FileList | null) => {
    if (!list) return;
    const next = [...photos];
    let problem: string | undefined;
    for (const f of Array.from(list)) {
      if (!f.type.startsWith("image/")) problem = RT.errImage;
      else if (f.size > MAX_PHOTO_MB * 1048576) problem = fill(RT.errSize, { mb: MAX_PHOTO_MB });
      else if (next.length >= MAX_PHOTOS) problem = fill(RT.errMax, { n: MAX_PHOTOS });
      else next.push(f);
    }
    setPhotos(next);
    setErrors((e) => ({ ...e, photos: problem }));
    if (fileInput.current) fileInput.current.value = "";
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!rating) e.rating = RT.errRating;
    if (!name.trim()) e.name = RT.errName;
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = RT.errEmail;
    if (comment.trim().length < MIN_COMMENT) e.comment = fill(RT.errComment, { min: MIN_COMMENT, n: comment.trim().length });
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      // Move focus to the first problem
      const first = e.rating ? "review-rating" : e.name ? "review-name" : e.email ? "review-email" : "review-comment";
      document.getElementById(first)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitReview({ trip: tripSlug, name: name.trim(), email: email.trim(), rating, comment: comment.trim(), photos, website: honeypot });
      setStatus("done");
    } catch (err) {
      setFailure(err instanceof Error && err.message ? err.message : RT.errGeneric);
      setStatus("error");
    }
  };

  const shown = hoverRating || rating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-[46px] items-center justify-center gap-2 rounded-[10px] px-6 text-sm font-semibold outline-none transition-all duration-100 ease-out focus-visible:ring-2 focus-visible:ring-ink/50 active:scale-[0.98] ${TONES[tone]} ${className}`}
        >
          <PenLine size={16} aria-hidden /> {RT.add}
        </button>
      </DialogTrigger>

      <DialogContent
        data-lenis-prevent
        className="max-h-[92dvh] max-w-[560px] gap-0 overflow-y-auto rounded-2xl border-ink/10 bg-paper p-6 text-ink md:p-8"
      >
        {status === "done" ? (
          <div className="flex flex-col items-center py-6 text-center" role="status">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-paper">
              <Check size={26} aria-hidden />
            </span>
            <DialogTitle className="mt-5 text-[26px] font-semibold tracking-[-0.03em]">{fill(RT.thanks, { name: name.trim().split(" ")[0] ?? "" })}</DialogTitle>
            <DialogDescription className="mt-2 max-w-sm text-[15px] leading-[1.6] text-ink/70">
              {fill(RT.published, { trip: tripTitle })}
            </DialogDescription>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-7 inline-flex h-11 items-center rounded-[10px] bg-ink px-6 text-sm font-semibold text-paper outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ink/50"
            >
              {RT.close}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <DialogTitle className="text-[26px] font-semibold leading-tight tracking-[-0.03em]">{RT.addTitle}</DialogTitle>
            <DialogDescription className="mt-1.5 text-[14.5px] leading-[1.55] text-ink/65">
              {RT.about.split("{trip}")[0]}<span className="font-medium text-ink">{tripTitle}</span>{RT.about.split("{trip}")[1]}
            </DialogDescription>

            {/* Honeypot: hidden from people, bots fill it in */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            {/* Rating */}
            <fieldset className="mt-6">
              <legend className="text-[13px] font-medium text-ink/80">{RT.rating}</legend>
              <div className="mt-2 flex items-center gap-3" onMouseLeave={() => setHoverRating(0)}>
                <div role="radiogroup" aria-label={RT.ratingAria} aria-invalid={!!errors.rating} className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      id={n === 1 ? "review-rating" : undefined}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} ${RT.star[n === 1 ? 0 : 1]}: ${WORDS[n]}`}
                      onMouseEnter={() => setHoverRating(n)}
                      onFocus={(e) => {
                        // Preview a star while tabbing with the keyboard, not when focus is moved by the page.
                        if (e.currentTarget.matches(":focus-visible")) setHoverRating(n);
                      }}
                      onBlur={() => setHoverRating(0)}
                      onClick={() => {
                        setRating(n);
                        setErrors((e) => ({ ...e, rating: undefined }));
                      }}
                      className="rounded-md p-1 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ink/40"
                    >
                      <Star size={30} strokeWidth={1.5} className={n <= shown ? "fill-current text-brand" : "text-ink/25"} aria-hidden />
                    </button>
                  ))}
                </div>
                <span className="min-w-20 text-[14px] text-ink/70" aria-live="polite">
                  {WORDS[shown]}
                </span>
              </div>
              {errors.rating && <p className="mt-1.5 text-[13px] text-brand">{errors.rating}</p>}
            </fieldset>

            {/* Name + email */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="review-name" className="text-[13px] font-medium text-ink/80">
                  {RT.name}
                </label>
                <input
                  id="review-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  placeholder={RT.namePh}
                  className={`${field} mt-1.5 h-11 ${errors.name ? "border-brand" : "border-ink/15"}`}
                />
                {errors.name && <p className="mt-1.5 text-[13px] text-brand">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="review-email" className="text-[13px] font-medium text-ink/80">
                  {RT.email} <span className="font-normal text-ink/50">{RT.optional}</span>
                </label>
                <input
                  id="review-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  placeholder="you@example.com"
                  className={`${field} mt-1.5 h-11 ${errors.email ? "border-brand" : "border-ink/15"}`}
                />
                {errors.email ? (
                  <p className="mt-1.5 text-[13px] text-brand">{errors.email}</p>
                ) : (
                  <p className="mt-1.5 text-[12px] text-ink/50">{RT.neverShown}</p>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <label htmlFor="review-comment" className="text-[13px] font-medium text-ink/80">
                  {RT.experience}
                </label>
                <span className="text-[12px] tabular-nums text-ink/50">
                  {comment.length}/{MAX_COMMENT}
                </span>
              </div>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
                rows={5}
                aria-invalid={!!errors.comment}
                placeholder={RT.commentPh}
                className={`${field} mt-1.5 resize-y py-3 leading-[1.6] ${errors.comment ? "border-brand" : "border-ink/15"}`}
              />
              {errors.comment && <p className="mt-1.5 text-[13px] text-brand">{errors.comment}</p>}
            </div>

            {/* Photos */}
            <div className="mt-4">
              <p className="text-[13px] font-medium text-ink/80">
                {RT.photos} <span className="font-normal text-ink/50">{fill(RT.photosOpt, { n: MAX_PHOTOS })}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {previews.map((src, i) => (
                  <div key={src} className="relative h-20 w-24 overflow-hidden rounded-lg bg-ink/[0.06]">
                    <img src={src} alt={fill(RT.selectedPhoto, { i: i + 1 })} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label={fill(RT.removePhoto, { i: i + 1 })}
                      onClick={() => setPhotos((p) => p.filter((_, k) => k !== i))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <X size={13} aria-hidden />
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-ink/25 text-[12px] text-ink/60 outline-none transition-colors hover:bg-ink/[0.04] focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    <ImagePlus size={18} aria-hidden /> {RT.addPhoto}
                  </button>
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => addPhotos(e.target.files)}
                />
              </div>
              {errors.photos && <p className="mt-1.5 text-[13px] text-brand">{errors.photos}</p>}
            </div>

            {status === "error" && (
              <p role="alert" className="mt-5 rounded-lg border border-brand/30 bg-brand/5 px-3.5 py-2.5 text-[13.5px] text-brand">
                {failure}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] leading-[1.5] text-ink/50">{RT.mayBeShown}</p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-ink px-7 text-sm font-semibold text-paper outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ink/50 disabled:opacity-60"
              >
                {status === "sending" && <Loader2 size={16} className="animate-spin" aria-hidden />}
                {status === "sending" ? RT.sending : RT.send}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
