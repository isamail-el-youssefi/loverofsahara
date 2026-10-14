import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export interface TextReveal01Options {
  ignoreManual?: boolean;
}

export function textReveal01(
  scope: Document | HTMLElement | Element = document,
  delay = 0,
  { ignoreManual = false }: TextReveal01Options = {}
) {
  const CONFIG = {
    lines: { duration: 1, stagger: 0.06, ease: "expo.out" },
    words: { duration: 1, stagger: 0.03, ease: "expo.out" },
    chars: { duration: 0.6, stagger: 0.01, ease: "expo.out" },
    scrollStart: "top 75%",
    scrubStart: "top 80%",
    scrubEnd: "top 20%",
    once: true,
    markers: false,
  };

  const allSplitEls = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal-01]"));
  const autoEls = ignoreManual
    ? allSplitEls
    : allSplitEls.filter((el) => !el.hasAttribute("data-manual"));

  gsap.set(autoEls, { visibility: "visible" });

  allSplitEls.forEach((el) => {
    const splitType = el.getAttribute("data-reveal-01") as "lines" | "words" | "chars" | null;
    if (!splitType) return;
    const c = CONFIG[splitType];
    if (!c) return;

    let type: string;
    let mask: string;
    let linesClass: string | undefined;
    let wordsClass: string | undefined;
    let charsClass: string | undefined;

    switch (splitType) {
      case "lines":
        type = "lines";
        mask = "lines";
        linesClass = "line";
        break;
      case "words":
        type = "words, lines";
        mask = "words";
        wordsClass = "word";
        linesClass = "line";
        break;
      case "chars":
        type = "chars, words, lines";
        mask = "chars";
        charsClass = "char";
        wordsClass = "word";
        linesClass = "line";
        break;
      default:
        return;
    }

    if (!ignoreManual && el.hasAttribute("data-manual")) {
      SplitText.create(el, {
        type,
        mask,
        autoSplit: true,
        ...(linesClass && { linesClass }),
        ...(wordsClass && { wordsClass }),
        ...(charsClass && { charsClass }),
      });
      return;
    }

    const scrollMode = el.getAttribute("data-scroll");
    const useScroll = el.hasAttribute("data-scroll");
    const useScrub = scrollMode === "scrub";

    SplitText.create(el, {
      type,
      mask,
      autoSplit: true,
      ...(linesClass && { linesClass }),
      ...(wordsClass && { wordsClass }),
      ...(charsClass && { charsClass }),
      onSplit(instance: any) {
        const durationValue = parseFloat(el.dataset.duration || "");
        const staggerValue = parseFloat(el.dataset.stagger || "");
        const delayValue = parseFloat(el.dataset.delay || "");
        const duration = Number.isNaN(durationValue) ? c.duration : durationValue;
        const stagger = Number.isNaN(staggerValue) ? c.stagger : staggerValue;
        const elDelay = Number.isNaN(delayValue) ? 0 : delayValue;
        const ease = el.dataset.ease || c.ease;

        const targets = instance[splitType];
        const once = el.hasAttribute("data-once")
          ? el.getAttribute("data-once") !== "false"
          : CONFIG.once;

        const tween: gsap.TweenVars = {
          yPercent: 110,
          duration,
          stagger,
          delay: useScroll ? elDelay : elDelay + delay,
          immediateRender: true,
          ease,
        };

        if (useScrub) {
          tween.scrollTrigger = {
            trigger: el,
            start: CONFIG.scrubStart,
            end: CONFIG.scrubEnd,
            scrub: true,
            markers: CONFIG.markers,
            ...(once && { onLeave: (self) => self.kill(false) }),
          };
        } else if (useScroll) {
          // In React JSX, boolean <h2 data-scroll /> produces data-scroll="true".
          // Fall back to CONFIG.scrollStart if scrollMode is empty, "true", or "scrub".
          const start =
            scrollMode && scrollMode !== "true" && scrollMode !== "scrub"
              ? scrollMode
              : CONFIG.scrollStart;
          tween.scrollTrigger = {
            trigger: el,
            start: `clamp(${start})`,
            markers: CONFIG.markers,
            ...(once ? { once: true } : { toggleActions: "play none none reverse" }),
          };
        }

        return gsap.from(targets, tween);
      },
    });
  });
}
