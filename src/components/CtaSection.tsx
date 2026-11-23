import { CtaClassic, CtaStatement } from "@/components/cta/CtaDesigns";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Home call to action: Classic on desktop, Statement on phones.
 * Classic is a card that overlaps the end of the gallery photo above it, so its section stays see-through and
 * sits above the gallery with no top padding. Statement sits on solid paper below the gallery.
 */
export function CtaSection() {
  const mobile = useIsMobile();
  return mobile ? (
    <section id="contact" className="relative z-10 bg-paper px-4 pt-[var(--section-y)] md:px-10">
      <CtaStatement />
    </section>
  ) : (
    <section id="contact" className="relative z-10 px-4 md:px-10">
      <CtaClassic />
    </section>
  );
}

/** The closing call to action for inner pages (trip, about): always the Statement design, phone and desktop. */
export function PageCta() {
  return (
    <section className="relative z-10 bg-paper px-4 pt-[var(--section-y)] md:px-10">
      <CtaStatement />
    </section>
  );
}
