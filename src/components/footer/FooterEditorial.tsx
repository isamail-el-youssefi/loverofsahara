import { motion } from "framer-motion";
import { TextRollHover } from "@/components/ui/text-stagger-hover";
import { fadeUp } from "@/lib/animations";
import { useLanguage } from "@/i18n/LanguageProvider";
import { contactPath } from "@/lib/routes";
import { useTripT } from "@/i18n/useTripT";
import { useFooterCols } from "./useFooterCols";
import { GoogleReviewsBadge } from "./GoogleReviewsBadge";
import { FooterQuickLinks } from "./FooterQuickLinks";

/** Paper footer in the Red Dot / place-page language: light display statement, ruled columns, framed badge. */
export function FooterEditorial() {
  const footerCols = useFooterCols();
  const { site, lang } = useLanguage();
  const T = useTripT();
  return (
    <footer className="flex min-h-[100dvh] flex-col justify-between bg-paper px-6 pb-6 pt-10 text-ink md:block md:min-h-0 md:px-12 md:pb-8 md:pt-28 lg:px-16">
      <motion.div {...fadeUp} className="grid gap-6 border-b border-ink/10 pb-6 md:gap-10 md:pb-14 lg:grid-cols-12 lg:gap-14 lg:pb-20">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4 text-[12px] font-medium uppercase tracking-[0.16em] text-neutral-500">
            Lover of Sahara
          </p>
          <h2 className="text-[34px] font-light leading-[1.02] tracking-[-0.04em] md:text-[72px]">
            {T.footerTitle}
          </h2>
          <a
            href={contactPath(lang)}
            className="mt-5 inline-flex h-[46px] md:mt-8 items-center justify-center rounded-[10px] bg-ink px-7 text-sm font-semibold text-paper transition-all duration-100 ease-out hover:bg-ink/85 active:scale-[0.98]"
          >
            {T.footerButton}
          </a>
        </div>
        <div className="flex flex-col justify-end gap-6 lg:col-span-5">
          <GoogleReviewsBadge tone="light" className="self-start" />
        </div>
      </motion.div>

      <FooterQuickLinks tone="light" className="my-4 md:hidden" />

      <div className="hidden grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 md:grid lg:grid-cols-4">
        {footerCols.slice(0, 4).map((col) => (
          <div key={col.title} className="border-t border-ink/10 pt-4">
            <h4 className="eyebrow text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">{col.title}</h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="inline-block text-[15px] font-medium text-ink/75 transition hover:text-ink">
                    <TextRollHover activeClassName="text-ink">{link.name}</TextRollHover>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 border-t border-ink/10 pt-4 md:gap-2 md:pt-6 text-[12px] text-neutral-500 sm:flex-row sm:justify-between">
        <span>{site.footer.rights}</span>
        <span>{site.footer.wordmark}</span>
      </div>
    </footer>
  );
}
