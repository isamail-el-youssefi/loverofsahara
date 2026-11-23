import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Copy, ExternalLink, Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GoogleReviewsBadge } from "@/components/footer/GoogleReviewsBadge";
import { OWNER } from "@/components/about/content";
import { Portrait } from "@/components/about/shared";
import { RouteMap } from "@/components/trip/RouteMap";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { CONTACT, phoneHref, whatsappBase } from "./data";
import { useContactContent } from "./useContactContent";

/** The e-mail row: opens a small menu to write in Gmail (browser tab), the default mail app, or copy the address. */
function EmailRow({ dark, label, icon: Icon }: { dark: boolean; label: string; icon: typeof Mail }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  const item =
    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13.5px] font-medium text-ink transition-colors hover:bg-ink/[0.05]";
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Choose email client"
          className="group flex w-full items-center gap-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-current md:py-5"
        >
          <Icon size={20} aria-hidden className={dark ? "text-white/70" : "text-ink/70"} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className={cn("text-[12px] uppercase tracking-[0.1em]", dark ? "text-white/55" : "text-neutral-500")}>{label}</span>
            <span className="truncate text-[17px] font-medium tracking-[-0.01em] md:text-[19px]">{CONTACT.email}</span>
          </span>
          <ChevronDown size={18} aria-hidden className="opacity-60 transition-opacity group-hover:opacity-100" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="z-50 w-[270px] rounded-2xl border border-ink/10 bg-paper p-1.5 text-ink shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] outline-none"
      >
        <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Write to us via</p>
        <div className="flex flex-col gap-0.5">
          <a href={gmailUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={item}>
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-[13px] font-bold text-red-600">G</span>
              <span>
                <span className="block font-semibold leading-tight">Gmail</span>
                <span className="block text-[11.5px] font-normal text-neutral-500">Opens in browser tab</span>
              </span>
            </span>
            <ExternalLink size={13} className="text-neutral-400" aria-hidden />
          </a>
          <a href={`mailto:${CONTACT.email}`} onClick={() => setOpen(false)} className={item}>
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/5 text-ink">
                <Mail size={14} />
              </span>
              <span>
                <span className="block font-semibold leading-tight">Default Mail App</span>
                <span className="block text-[11.5px] font-normal text-neutral-500">Outlook, Apple Mail</span>
              </span>
            </span>
          </a>
          <button type="button" onClick={copy} className={item}>
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/5 text-ink">
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </span>
              <span>
                <span className="block font-semibold leading-tight">{copied ? "Copied to clipboard!" : "Copy address"}</span>
                <span className="block text-[11.5px] font-normal text-neutral-500">{CONTACT.email}</span>
              </span>
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** The ways to reach us, as a ruled list. */
export function ContactList({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  const t = useContactContent();
  const rows = [
    { key: "whatsapp", label: "WhatsApp", value: CONTACT.phoneDisplay, href: whatsappBase, icon: MessageCircle, external: true },
    { key: "email", label: t.emailLabel, value: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: Mail, external: false },
    { key: "phone", label: t.phoneLabel, value: CONTACT.phoneDisplay, href: phoneHref, icon: Phone, external: false },
    { key: "instagram", label: "Instagram", value: "@lover_of_sahara", href: CONTACT.instagram, icon: Instagram, external: true },
    { key: "facebook", label: "Facebook", value: "loveroffsahara", href: CONTACT.facebook, icon: Facebook, external: true },
  ] as const;

  return (
    <ul className={cn("border-b", dark ? "border-white/15" : "border-ink/10", className)}>
      {rows.map((r) => (
        <li key={r.key} className={cn("border-t", dark ? "border-white/15" : "border-ink/10")}>
          {r.key === "email" ? (
            <EmailRow dark={dark} label={r.label} icon={r.icon} />
          ) : (
          <a
            href={r.href}
            {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-center gap-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-current md:py-5"
          >
            <r.icon size={20} aria-hidden className={dark ? "text-white/70" : "text-ink/70"} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className={cn("text-[12px] uppercase tracking-[0.1em]", dark ? "text-white/55" : "text-neutral-500")}>{r.label}</span>
              <span className="truncate text-[17px] font-medium tracking-[-0.01em] md:text-[19px]">{r.value}</span>
            </span>
            <span aria-hidden className="text-lg opacity-0 transition-opacity group-hover:opacity-100">↗</span>
          </a>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Three numbered steps. */
export function Steps({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const t = useContactContent();
  return (
    <ol className="grid gap-[6px] md:grid-cols-3">
      {t.steps.map((s, i) => (
        <motion.li
          key={s.title}
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: i * 0.08 }}
          className={cn("rounded-2xl p-6 md:p-8", dark ? "bg-white/[0.06]" : "bg-ink/[0.045]")}
        >
          <span className={cn("text-[12px] tabular-nums", dark ? "text-white/50" : "text-neutral-400")}>{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] md:text-[26px]">{s.title}</h3>
          <p className={cn("mt-2 text-[15px] leading-[1.6]", dark ? "text-white/70" : "text-ink/70")}>{s.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}

/** Zagora on the map. */
export function FindUsMap({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <RouteMap
      key={`contact-map-${tone}`}
      stops={[{ name: "Zagora", lat: CONTACT.lat, lng: CONTACT.lng }]}
      active={[]}
      tone={tone}
      named
      className={cn("min-h-[320px] w-full overflow-hidden rounded-2xl md:min-h-[420px]", className)}
    />
  );
}

/** Who answers: Salah's portrait, the languages he speaks and the Google rating. */
export function WhoYouTalkTo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const t = useContactContent();
  const { lang } = useLanguage();
  const orWord = lang === "fr" ? "ou" : lang === "de" ? "oder" : lang === "es" ? "o" : lang === "it" ? "o" : lang === "zh" ? "或" : "or";
  const langsStr = `${OWNER.languages.slice(0, -1).join(", ")} ${orWord} ${OWNER.languages[OWNER.languages.length - 1]}`;
  const talking = t.talking.replace("{name}", OWNER.name).replace("{role}", OWNER.role.toLowerCase());
  const born = t.born.replace("{langs}", langsStr);

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:gap-12">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-ink-deep">
        <Portrait />
      </div>
      <div>
        <p className="text-[26px] font-light leading-[1.2] tracking-[-0.03em] md:text-[38px]">
          {talking}
        </p>
        <p className={cn("mt-4 max-w-[34rem] text-[15.5px] leading-[1.65]", dark ? "text-white/70" : "text-ink/75")}>
          {born}
        </p>
        <div className="mt-6">
          <GoogleReviewsBadge tone={dark ? "dark" : "light"} />
        </div>
      </div>
    </div>
  );
}
