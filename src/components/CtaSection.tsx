import { CtaClassic, CtaInk, CtaPhoto, CtaStatement } from "@/components/cta/CtaDesigns";
import { useCtaStyle } from "@/hooks/use-cta-style";

/**
 * Home call to action: the design is chosen in the theme switcher ("Call to action").
 * Classic is a card that overlaps the end of the gallery photo above it, so its section stays see-through and
 * sits above the gallery with no top padding. The other designs sit on solid paper below the gallery.
 */
export function CtaSection() {
  const style = useCtaStyle();
  const classic = style !== "statement" && style !== "photo" && style !== "ink";
  return (
    <section
      id="contact"
      className={`relative z-10 px-4 md:px-10 ${classic ? "" : "bg-paper pt-[var(--section-y)]"}`}
    >
      {style === "statement" ? <CtaStatement /> : style === "photo" ? <CtaPhoto /> : style === "ink" ? <CtaInk /> : <CtaClassic />}
    </section>
  );
}
