import { TextRollHover } from "@/components/ui/text-stagger-hover";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useFooterCols } from "./useFooterCols";
import { GoogleReviewsBadge } from "./GoogleReviewsBadge";
import { NewsletterForm } from "./NewsletterForm";

/** Dark panel with the giant "Authentic. Wild." wordmark (the original footer) plus the Google badge. */
export function FooterWild() {
  const footerCols = useFooterCols();
  const { site } = useLanguage();
  return (
    <div className="flex min-h-[85vh] w-full flex-col px-[4px] pb-[4px] pt-0 lg:h-[96vh]">
      <footer className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-b-2xl bg-ink-deep px-6 py-8 text-white md:px-12 md:pb-4 md:pt-10 lg:px-16 lg:pb-6 lg:pt-12">
        <div>
          <div className="grid grid-cols-1 gap-6 border-b border-neutral-300/20 pb-8 pt-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-4">
              <a href="#" className="text-2xl font-bold uppercase tracking-tight text-white transition hover:opacity-90 md:text-4xl">
                Lover of Sahara
              </a>
            </div>

            <div className="lg:col-span-3 lg:px-4">
              <GoogleReviewsBadge tone="dark" />
            </div>

            <div className="w-full lg:col-span-5">
              <p className="mb-3.5 w-full text-xs font-medium text-neutral-300 md:text-base">
                {site.footer.newsletter}
              </p>
              <NewsletterForm tone="dark" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 pt-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerCols.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-normal text-neutral-400">{col.title}</h4>
                <ul className="mt-2.5 space-y-1.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="inline-block text-xs font-semibold leading-relaxed text-white/70 transition hover:text-neutral-300 sm:text-lg"
                      >
                        <TextRollHover activeClassName="text-white font-medium">{link.name}</TextRollHover>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col justify-end pb-10 pt-6">
          <p className="mb-2 text-right text-xs text-neutral-400">{site.footer.rights}</p>
          <div className="select-none overflow-hidden whitespace-nowrap text-[11.5vw] font-bold uppercase leading-[0.88] tracking-[-0.04em] text-neutral-200">{site.footer.wordmark}</div>
        </div>
      </footer>
    </div>
  );
}
