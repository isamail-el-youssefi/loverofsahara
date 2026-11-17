import { useEffect, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { useTrips } from "@/hooks/use-trips";
import { cn } from "@/lib/utils";
import { EMPTY_REQUEST, mailtoUrl, validate, whatsappUrl, type Channel, type RequestFields } from "./message";

const field =
  "w-full rounded-[10px] border border-ink/20 bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink focus-visible:ring-2 focus-visible:ring-ink/20";
const label = "mb-1.5 block text-[13px] font-medium text-ink/80";

/**
 * Trip request. There is no server: the buttons open WhatsApp or the visitor's mail app with the message
 * already written, so nothing is stored or sent anywhere else. `?trip=<slug>` pre-selects a trip.
 */
export function ContactForm({ className }: { className?: string }) {
  const { trips } = useTrips();
  const [f, setF] = useState<RequestFields>(EMPTY_REQUEST);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [sent, setSent] = useState<Channel | null>(null);

  // Pre-select the trip named in the URL once the trips are loaded.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("trip");
    const t = slug ? trips.find((x) => x.slug === slug) : undefined;
    if (t) setF((p) => (p.trip ? p : { ...p, trip: t.title.trim() }));
  }, [trips]);

  const set = (k: keyof RequestFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
    setSent(null);
  };

  const send = (channel: Channel) => {
    const errs = validate(f, channel);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (channel === "whatsapp") window.open(whatsappUrl(f), "_blank", "noopener,noreferrer");
    else window.location.href = mailtoUrl(f);
    setSent(channel);
  };

  const err = (k: keyof RequestFields) =>
    errors[k] ? (
      <p id={`err-${k}`} role="alert" className="mt-1.5 text-[13px] text-red-700">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className={cn("grid gap-5", className)} aria-label="Trip request">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>Your name</label>
          <input id="cf-name" autoComplete="name" value={f.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} className={field} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>Email</label>
          <input id="cf-email" type="email" autoComplete="email" value={f.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} className={field} />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="cf-trip" className={label}>Trip</label>
        <select id="cf-trip" value={f.trip} onChange={set("trip")} className={field}>
          <option value="">Not decided yet / custom</option>
          {trips.map((t) => (
            <option key={t.slug} value={t.title.trim()}>
              {t.title.trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-dates" className={label}>Preferred dates</label>
          <input id="cf-dates" placeholder="e.g. mid-March, 5 nights" value={f.dates} onChange={set("dates")} className={field} />
        </div>
        <div>
          <label htmlFor="cf-group" className={label}>Group size</label>
          <input id="cf-group" inputMode="numeric" placeholder="e.g. 4" value={f.group} onChange={set("group")} className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={label}>Message</label>
        <textarea id="cf-message" rows={4} value={f.message} onChange={set("message")} placeholder="Tell us what you would like to see or any questions." aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : undefined} className={cn(field, "resize-y")} />
        {err("message")}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => send("whatsapp")}
          className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-ink px-6 text-sm font-semibold text-paper transition-all duration-100 ease-out hover:bg-ink/85 active:scale-[0.98]"
        >
          <MessageCircle size={17} aria-hidden /> Send on WhatsApp
        </button>
        <button
          type="button"
          onClick={() => send("email")}
          className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-ink px-6 text-sm font-semibold text-ink transition-all duration-100 ease-out hover:bg-ink/[0.06] active:scale-[0.98]"
        >
          <Mail size={17} aria-hidden /> Send by email
        </button>
      </div>
      <p className="text-[13px] text-neutral-500" aria-live="polite">
        {sent === "whatsapp"
          ? "WhatsApp should open with your message ready. Press send there to reach us."
          : sent === "email"
            ? "Your email app should open with your message ready. Press send there to reach us."
            : "This opens WhatsApp or your email app with your message written for you. Nothing is stored on this site."}
      </p>
    </form>
  );
}
