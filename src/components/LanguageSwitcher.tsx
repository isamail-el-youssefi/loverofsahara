import { Check, Globe } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LANGUAGES } from "@/i18n/languages";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Globe button + list of the 6 languages. Sits next to the colour-theme picker in the navbar. */
export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const { lang, setLang, ui } = useLanguage();

  const triggerTone = light
    ? "border-black/15 bg-black/[0.04] text-ink hover:bg-black/[0.08]"
    : "border-white/30 bg-white/10 text-white hover:bg-white/20";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${ui.language}: ${LANGUAGES.find((l) => l.code === lang)?.native ?? lang}`}
          title={ui.language}
          className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[12px] font-semibold uppercase tracking-wide backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 ${triggerTone}`}
        >
          <Globe size={16} aria-hidden />
          <span>{lang}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={10}
        collisionPadding={12}
        className="z-[100] w-[min(220px,calc(100vw-24px))] rounded-2xl border border-neutral-200 bg-paper p-2 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
      >
        <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          {ui.language}
        </p>
        <div role="radiogroup" aria-label={ui.language} className="flex flex-col gap-1">
          {LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                role="radio"
                aria-checked={selected}
                lang={l.htmlLang}
                onClick={() => setLang(l.code)}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[14px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span>{l.native}</span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
