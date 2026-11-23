import { motion } from "framer-motion";
import { TextRollHover } from "@/components/ui/text-stagger-hover";
import { fadeUp } from "@/lib/animations";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useFooterCols } from "./useFooterCols";
import { GoogleReviewsBadge } from "./GoogleReviewsBadge";
import { NewsletterForm } from "./NewsletterForm";

/** Paper footer in the Red Dot / place-page language: light display statement, ruled columns, framed badge. */
export function FooterEditorial() {
  const footerCols = useFooterCols();
  const { site } = useLanguage();
  return (
    <footer className="bg-paper px-6 pb-8 pt-20 text-ink md:px-12 md:pt-28 lg:px-16">
      <motion.div {...fadeUp} className="grid gap-10 border-b border-ink/10 pb-14 lg:grid-cols-12 lg:gap-14 lg:pb-20">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4 text-[12px] font-medium uppercase tracking-[0.16em] text-neutral-500">
            Lover of Sahara
          </p>
          <h2 className="text-[40px] font-light leading-[1.02] tracking-[-0.04em] md:text-[72px]">
            Plan your Sahara journey
          </h2>
          <a
            href="#contact"
            className="mt-8 inline-flex h-[46px] items-center justify-center rounded-[10px] bg-ink px-7 text-sm font-semibold text-paper transition-all duration-100 ease-out hover:bg-ink/85 active:scale-[0.98]"
          >
            Get in touch
          </a>
        </div>
        <div className="flex flex-col justify-end gap-6 lg:col-span-5">
          <GoogleReviewsBadge tone="light" className="self-start" />
          <div>
            <p className="mb-3 text-[14px] text-neutral-500">
              {site.footer.newsletter}
            </p>
            <NewsletterForm tone="light" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-5">
        {footerCols.map((col) => (
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

      <div className="flex flex-col gap-2 border-t border-ink/10 pt-6 text-[12px] text-neutral-500 sm:flex-row sm:justify-between">
        <span>{site.footer.rights}</span>
        <span>{site.footer.wordmark}</span>
      </div>
    </footer>
  );
}
