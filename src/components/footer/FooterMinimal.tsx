import { TextRollHover } from "@/components/ui/text-stagger-hover";
import { footerCols } from "./data";
import { GoogleReviewsBadge } from "./GoogleReviewsBadge";
import { NewsletterForm } from "./NewsletterForm";

/** Compact paper footer: brand and Google badge on one row, links in one ruled row, newsletter, copyright. */
export function FooterMinimal() {
  return (
    <footer className="bg-paper px-6 pb-8 pt-14 text-ink md:px-12 lg:px-16">
      <div className="flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-center md:justify-between">
        <a href="#" className="text-xl font-bold uppercase tracking-tight md:text-2xl">
          Lover of Sahara
        </a>
        <GoogleReviewsBadge tone="light" />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-ink/10 py-8 sm:grid-cols-3 lg:grid-cols-5">
        {footerCols.map((col) => (
          <div key={col.title}>
            <h4 className="text-[13px] text-neutral-500">{col.title}</h4>
            <ul className="mt-3 space-y-1.5">
              {col.links.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="inline-block text-[14px] font-medium text-ink/75 transition hover:text-ink">
                    <TextRollHover activeClassName="text-ink">{link.name}</TextRollHover>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-[12px] text-neutral-500">© 2025–2026 Lover of Sahara. All rights reserved.</p>
        <NewsletterForm tone="light" className="md:max-w-md" />
      </div>
    </footer>
  );
}
