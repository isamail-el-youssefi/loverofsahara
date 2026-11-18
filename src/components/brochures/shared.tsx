import { useEffect, useState } from "react";
import { ArrowDown, BookOpen } from "lucide-react";
import { brochurePath } from "@/lib/routes";
import { READER_STRINGS } from "./reader/strings";
import { BROCHURES, brochureCover, brochureIn, brochurePdf, type Brochure } from "@/data/brochures";
import { LANGUAGES, type Lang } from "@/i18n/languages";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { BROCHURE_STRINGS, type BrochureStrings } from "./strings";

/**
 * The language the brochures are shown in. It starts as the site language and follows it when the visitor
 * changes it in the navbar; the chips on this page change it too, without touching the site language.
 */
export function useBrochureLang(): [Lang, (l: Lang) => void, BrochureStrings] {
  const { lang: siteLang } = useLanguage();
  const [lang, setLang] = useState<Lang>(siteLang);
  useEffect(() => setLang(siteLang), [siteLang]);
  return [lang, setLang, BROCHURE_STRINGS[lang]];
}

/** Total number of PDFs on offer. */
export const PDF_COUNT = BROCHURES.reduce((n, b) => n + Object.keys(b.langs).length, 0);

/** The six language chips. `tone` is the surface they sit on. */
export function LanguageChips({
  value,
  onChange,
  tone = "light",
  className,
}: {
  value: Lang;
  onChange: (l: Lang) => void;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div role="radiogroup" aria-label="Language" className={cn("flex flex-wrap gap-1.5", className)}>
      {LANGUAGES.map((l) => {
        const on = l.code === value;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={on}
            lang={l.htmlLang}
            onClick={() => onChange(l.code)}
            className={cn(
              "h-9 rounded-full border px-4 text-[14px] font-medium tracking-[-0.01em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-current",
              on
                ? dark
                  ? "border-white bg-white text-ink-deep"
                  : "border-ink bg-ink text-paper"
                : dark
                  ? "border-white/25 text-white/75 hover:border-white/60 hover:text-white"
                  : "border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink",
            )}
          >
            {l.native}
          </button>
        );
      })}
    </div>
  );
}

/** A cover image. Keyed by language so it swaps cleanly; reserves the A4 ratio so nothing jumps. */
export function Cover({
  brochure,
  lang,
  className,
  imgClassName,
  eager = false,
}: {
  brochure: Brochure;
  lang: Lang;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const { lang: shown, info } = brochureIn(brochure, lang);
  return (
    <div className={cn("relative aspect-[210/297] overflow-hidden bg-ink/10", className)}>
      <img
        key={`${brochure.slug}-${shown}`}
        src={brochureCover(brochure.slug, shown)}
        alt={`${info.title} (${shown.toUpperCase()})`}
        width={640}
        height={905}
        loading={eager ? "eager" : "lazy"}
        draggable={false}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}

/** Pages and size on one line: "32 pages · 7.0 MB". */
export function metaLine(t: BrochureStrings, pages: number, mb: number) {
  return `${t.pages(pages)} · ${mb.toFixed(1)} MB`;
}

/** The PDF link. `download` also keeps the site's client-side router from intercepting the click. */
export function PdfLink({
  brochure,
  lang,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  brochure: Brochure;
  lang: Lang;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const { lang: shown } = brochureIn(brochure, lang);
  return (
    <a
      href={brochurePdf(brochure.slug, shown)}
      download={`${brochure.slug}-${shown}.pdf`}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}

/** "Download PDF" pill with a down arrow. */
export function DownloadPill({
  brochure,
  lang,
  t,
  tone = "light",
  className,
}: {
  brochure: Brochure;
  lang: Lang;
  t: BrochureStrings;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <PdfLink
      brochure={brochure}
      lang={lang}
      className={cn(
        "group/dl inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-current",
        dark
          ? "border-white/30 text-white hover:border-white hover:bg-white hover:text-ink-deep"
          : "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
        className,
      )}
    >
      <ArrowDown size={16} aria-hidden className="transition-transform group-hover/dl:translate-y-0.5" />
      {t.download}
    </PdfLink>
  );
}

/** Opens the brochure in the on-site reader. Internal link, so the router handles it without a reload. */
export function ReadLink({ brochure, className, children, "aria-label": ariaLabel }: { brochure: Brochure; className?: string; children: React.ReactNode; "aria-label"?: string }) {
  return (
    <a href={brochurePath(brochure.slug)} aria-label={ariaLabel} className={className}>
      {children}
    </a>
  );
}

/** "Read online" pill with a book icon, filled so it leads over the outlined download pill. */
export function ReadPill({ brochure, lang, tone = "light", className }: { brochure: Brochure; lang: Lang; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <ReadLink
      brochure={brochure}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-medium outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-current",
        dark ? "border-white bg-white text-ink-deep" : "border-ink bg-ink text-paper",
        className,
      )}
    >
      <BookOpen size={16} aria-hidden />
      {READER_STRINGS[lang].read}
    </ReadLink>
  );
}
