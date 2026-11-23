import { useEffect, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { useTrips } from "@/hooks/use-trips";
import { cn } from "@/lib/utils";
import { EMPTY_REQUEST, mailtoUrl, validate, whatsappUrl, type Channel, type RequestFields } from "./message";
import { useContactContent } from "./useContactContent";

const field =
  "w-full rounded-[10px] border border-ink/20 bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink focus-visible:ring-2 focus-visible:ring-ink/20";
const label = "mb-1.5 block text-[13px] font-medium text-ink/80";

/**
 * Trip request. There is no server: the buttons open WhatsApp or the visitor's mail app with the message
 * already written, so nothing is stored or sent anywhere else. `?trip=<slug>` pre-selects a trip.
 */
export function ContactForm({ className }: { className?: string }) {
  const { trips } = useTrips();
  const t = useContactContent().form;
  const [f, setF] = useState<RequestFields>(EMPTY_REQUEST);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [sent, setSent] = useState<Channel | null>(null);

  // Pre-select the trip named in the URL once the trips are loaded.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("trip");
    const found = slug ? trips.find((x) => x.slug === slug) : undefined;
    if (found) setF((p) => (p.trip ? p : { ...p, trip: found.title.trim() }));
  }, [trips]);

  const set = (k: keyof RequestFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
    setSent(null);
  };

  const send = (channel: Channel) => {
    const errs = validate(f, channel, t);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (channel === "whatsapp") window.open(whatsappUrl(f, t), "_blank", "noopener,noreferrer");
    else window.location.href = mailtoUrl(f, t);
    setSent(channel);
  };

  const err = (k: keyof RequestFields) =>
    errors[k] ? (
      <p id={`err-${k}`} role="alert" className="mt-1.5 text-[13px] text-red-700">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className={cn("grid gap-5", className)} aria-label={t.aria}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>{t.name}</label>
          <input id="cf-name" autoComplete="name" value={f.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} className={field} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>{t.email}</label>
          <input id="cf-email" type="email" autoComplete="email" value={f.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} className={field} />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="cf-trip" className={label}>{t.trip}</label>
        <select id="cf-trip" value={f.trip} onChange={set("trip")} className={field}>
          <option value="">{t.tripNone}</option>
          {trips.map((tr) => (
            <option key={tr.slug} value={tr.title.trim()}>
              {tr.title.trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-dates" className={label}>{t.dates}</label>
          <input id="cf-dates" placeholder={t.datesPh} value={f.dates} onChange={set("dates")} className={field} />
        </div>
        <div>
          <label htmlFor="cf-group" className={label}>{t.group}</label>
          <input id="cf-group" inputMode="numeric" placeholder={t.groupPh} value={f.group} onChange={set("group")} className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={label}>{t.message}</label>
        <textarea id="cf-message" rows={4} value={f.message} onChange={set("message")} placeholder={t.messagePh} aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : undefined} className={cn(field, "resize-y")} />
        {err("message")}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => send("whatsapp")}
          className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-ink px-6 text-sm font-semibold text-paper transition-all duration-100 ease-out hover:bg-ink/85 active:scale-[0.98]"
        >
          <MessageCircle size={17} aria-hidden /> {t.whatsapp}
        </button>
        <button
          type="button"
          onClick={() => send("email")}
          className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-ink px-6 text-sm font-semibold text-ink transition-all duration-100 ease-out hover:bg-ink/[0.06] active:scale-[0.98]"
        >
          <Mail size={17} aria-hidden /> {t.emailBtn}
        </button>
      </div>
      <p className="text-[13px] text-neutral-500" aria-live="polite">
        {sent === "whatsapp"
          ? t.hintWhatsapp
          : sent === "email"
            ? t.hintEmail
            : t.hintIdle}
      </p>
    </form>
  );
}
