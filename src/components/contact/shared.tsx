import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { GoogleReviewsBadge } from "@/components/footer/GoogleReviewsBadge";
import { OWNER } from "@/components/about/content";
import { Portrait } from "@/components/about/shared";
import { RouteMap } from "@/components/trip/RouteMap";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { CONTACT, STEPS, phoneHref, whatsappBase } from "./data";

const ROWS = [
  { key: "whatsapp", label: "WhatsApp", value: CONTACT.phoneDisplay, href: whatsappBase, icon: MessageCircle, external: true },
  { key: "email", label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: Mail, external: false },
  { key: "phone", label: "Phone", value: CONTACT.phoneDisplay, href: phoneHref, icon: Phone, external: false },
  { key: "instagram", label: "Instagram", value: "@lover_of_sahara", href: CONTACT.instagram, icon: Instagram, external: true },
  { key: "facebook", label: "Facebook", value: "loveroffsahara", href: CONTACT.facebook, icon: Facebook, external: true },
] as const;

/** The ways to reach us, as a ruled list. */
export function ContactList({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <ul className={cn("border-b", dark ? "border-white/15" : "border-ink/10", className)}>
      {ROWS.map((r) => (
        <li key={r.key} className={cn("border-t", dark ? "border-white/15" : "border-ink/10")}>
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
        </li>
      ))}
    </ul>
  );
}

/** Three numbered steps. */
export function Steps({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ol className="grid gap-[6px] md:grid-cols-3">
      {STEPS.map((s, i) => (
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
  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:gap-12">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-ink-deep">
        <Portrait />
      </div>
      <div>
        <p className="text-[26px] font-light leading-[1.2] tracking-[-0.03em] md:text-[38px]">
          You will be talking to {OWNER.name}, {OWNER.role.toLowerCase()}.
        </p>
        <p className={cn("mt-4 max-w-[34rem] text-[15.5px] leading-[1.65]", dark ? "text-white/70" : "text-ink/75")}>
          Born and raised in Zagora, he and the native team plan every journey themselves. Write in {OWNER.languages.slice(0, -1).join(", ")} or {OWNER.languages[OWNER.languages.length - 1]}.
        </p>
        <div className="mt-6">
          <GoogleReviewsBadge tone={dark ? "dark" : "light"} />
        </div>
      </div>
    </div>
  );
}
