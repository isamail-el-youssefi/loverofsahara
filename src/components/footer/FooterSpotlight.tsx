import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import { TextRollHover } from "@/components/ui/text-stagger-hover";
import { fadeUp } from "@/lib/animations";
import { CONTACT } from "@/components/contact/data";
import { useLanguage } from "@/i18n/LanguageProvider";
import { GOOGLE_REVIEWS } from "./data";
import { useFooterCols } from "./useFooterCols";
import { GoogleLogo, Stars } from "./GoogleReviewsBadge";

/** Profile links come from the contact details (one place to edit). Google uses GOOGLE_REVIEWS.url. */
const SOCIALS = [
  { name: "Facebook", href: CONTACT.facebook, icon: <Facebook size={20} aria-hidden /> },
  { name: "Instagram", href: CONTACT.instagram, icon: <Instagram size={20} aria-hidden /> },
  { name: "Google", href: GOOGLE_REVIEWS.url, icon: <GoogleLogo size={20} /> },
];

/** Dark framed band led by the Google rating: huge "5.0", logo, stars, and a button to read the reviews. */
export function FooterSpotlight() {
  const footerCols = useFooterCols();
  const { site } = useLanguage();
  const { rating, count, url } = GOOGLE_REVIEWS;
  const external = url.startsWith("http");
  return (
    <div className="w-full px-[4px] pb-[4px]">
      <footer className="overflow-hidden rounded-2xl bg-ink-deep px-6 py-14 text-white md:px-12 md:py-20 lg:px-16">
        <motion.div {...fadeUp} className="grid gap-14 border-b border-white/15 pb-14 lg:grid-cols-12 lg:gap-16 lg:pb-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <GoogleLogo size={28} />
              <span className="eyebrow text-[12px] font-medium uppercase tracking-[0.16em] text-white/60">
                Google reviews
              </span>
            </div>
            <p className="mt-6 text-[96px] font-light leading-[0.9] tracking-[-0.05em] tabular-nums md:text-[160px]">
              {rating.toFixed(1)}
            </p>
            <Stars size={22} className="mt-5" />
            <p className="mt-3 text-[15px] text-white/70">
              {rating} out of 5, from {count} reviews
            </p>
            <a
              href={url}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-8 inline-flex h-[46px] items-center justify-center rounded-[10px] bg-paper px-7 text-sm font-semibold text-ink transition-all duration-100 ease-out hover:bg-neutral-100 active:scale-[0.98]"
            >
              Read our reviews
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:col-span-7">
            {footerCols.slice(0, 4).map((col) => (
              <div key={col.title}>
                <h4 className="eyebrow text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">{col.title}</h4>
                <ul className="mt-4 divide-y divide-white/10 border-t border-white/10">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="block py-2 text-[15px] font-medium text-white/75 transition hover:text-white"
                      >
                        <TextRollHover activeClassName="text-white">{link.name}</TextRollHover>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-8 pt-10 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-wrap items-center gap-3 lg:col-span-5">
            {SOCIALS.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                title={name}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {icon}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/60 lg:col-span-7 lg:justify-end">
            {footerCols[4]!.links.map((l) => (
              <a key={l.name} href={l.href} className="transition hover:text-white">
                {l.name}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-10 text-[12px] text-white/45">{site.footer.rights}</p>
      </footer>
    </div>
  );
}
