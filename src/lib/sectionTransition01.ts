import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface SectionTransitionMobileConfig {
  breakpoint?: number;
  strategy?: "same" | "disable" | "simplify";
}

export interface SectionTransitionConfig {
  parallaxY?: number;
  revealY?: number;
  overlayColor?: string;
  mobile?: SectionTransitionMobileConfig;
}

export function sectionTransition01(
  scopeOrConfig: Element | Document | SectionTransitionConfig = document,
  maybeConfig: SectionTransitionConfig = {},
) {
  const DEFAULT_CONFIG: {
    parallaxY: number;
    revealY: number;
    overlayColor: string;
    mobile: {
      breakpoint: number;
      strategy: "same" | "disable" | "simplify";
    };
  } = {
    parallaxY: 400,
    revealY: 0,
    overlayColor: "black",
    mobile: {
      breakpoint: 768,
      strategy: "simplify",
    },
  };

  const isScope = (value: unknown): value is Element | Document =>
    typeof Element !== "undefined" && (value instanceof Element || value instanceof Document);

  const getConfig = (overrides: SectionTransitionConfig = {}) => ({
    ...DEFAULT_CONFIG,
    ...overrides,
    mobile: {
      ...DEFAULT_CONFIG.mobile,
      ...(overrides.mobile || {}),
    },
  });

  const getYValue = (section: HTMLElement, fallback: number) => {
    const yValue = parseFloat(section.dataset.stY || String(fallback));
    return Number.isNaN(yValue) ? fallback : yValue;
  };

  const getOpacityValue = (section: HTMLElement) => {
    const opacityValue = parseFloat(section.dataset.stOpacity || "");
    if (Number.isNaN(opacityValue)) return null;
    return Math.max(0, Math.min(1, opacityValue));
  };

  const getOverlayColor = (section: HTMLElement, fallback: string) =>
    section.dataset.stOverlay || fallback;

  const getOverlayElement = (section: HTMLElement, color: string) => {
    let overlay = section.querySelector<HTMLElement>("[data-st-overlay-el]");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.setAttribute("data-st-overlay-el", "");
      overlay.setAttribute("aria-hidden", "true");
      section.append(overlay);
    }

    if (getComputedStyle(section).position === "static") {
      section.style.position = "relative";
    }

    section.style.isolation = "isolate";

    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      zIndex: "2",
      pointerEvents: "none",
      background: color,
      opacity: "0",
      willChange: "opacity",
    });

    return overlay;
  };

  const resetOverlay = (section: HTMLElement) => {
    const existingOverlay = section.querySelector<HTMLElement>("[data-st-overlay-el]");
    if (existingOverlay) {
      gsap.set(existingOverlay, { opacity: 0 });
    }
  };

  const getConfiguredYValue = (
    section: HTMLElement,
    mode: string,
    config: ReturnType<typeof getConfig>,
  ) => {
    if (mode === "reveal") {
      return getYValue(section, config.revealY);
    }

    if (mode === "parallax") {
      return getYValue(section, config.parallaxY);
    }

    return 0;
  };

  const isMobileViewport = (config: ReturnType<typeof getConfig>) =>
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${config.mobile.breakpoint}px)`).matches;

  const getMobileStrategy = (config: ReturnType<typeof getConfig>) => {
    const allowed = new Set(["same", "disable", "simplify"]);
    return allowed.has(config.mobile.strategy)
      ? config.mobile.strategy
      : DEFAULT_CONFIG.mobile.strategy;
  };

  const hasYMotion = (mode: string, y: number) =>
    mode === "parallax" || (mode === "reveal" && y !== 0);

  const resolveTransition = (mode: string, y: number, strategy: string, isMobile: boolean) => {
    if (!isMobile || strategy === "same" || !hasYMotion(mode, y)) {
      return { mode, y };
    }

    if (strategy === "disable") {
      return { mode: "none", y: 0 };
    }

    if (mode === "parallax") {
      return { mode: "pin", y: 0 };
    }

    return { mode, y: 0 };
  };

  const getScrollerHeight = (el: HTMLElement) => {
    // The page scroller is the <main> that wraps the sections (see Page in App.tsx).
    const scroller = el.closest("main");
    return scroller ? scroller.clientHeight : window.innerHeight;
  };

  const scope = isScope(scopeOrConfig) ? scopeOrConfig : document;
  const config = getConfig(
    isScope(scopeOrConfig) ? maybeConfig : (scopeOrConfig as SectionTransitionConfig),
  );
  const mobileStrategy = getMobileStrategy(config);
  const isMobile = isMobileViewport(config);
  const sections = scope.querySelectorAll<HTMLElement>("[data-st-01]");

  sections.forEach((section) => {
    const configuredMode = section.getAttribute("data-st-01") || "parallax";
    const configuredY = getConfiguredYValue(section, configuredMode, config);
    const opacity = getOpacityValue(section);
    const { mode, y } = resolveTransition(configuredMode, configuredY, mobileStrategy, isMobile);

    if (mode === "none") {
      resetOverlay(section);
      return;
    }

    if (mode === "reveal") {
      const previousSection = section.previousElementSibling as HTMLElement | null;
      if (!previousSection) return;

      gsap.set(previousSection, { zIndex: 1 });
      gsap.set(section, {
        position: "sticky",
        bottom: 0,
        zIndex: 0,
      });

      if (opacity === null) resetOverlay(section);

      if (y === 0 && opacity === null) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: previousSection,
          start: "bottom bottom",
          end: () => `+=${section.offsetHeight}`,
          scrub: true,
        },
      });

      if (y !== 0) {
        timeline.fromTo(
          section,
          {
            y,
          },
          {
            y: 0,
            ease: "none",
            force3D: true,
          },
          0,
        );
      }

      if (opacity !== null) {
        const overlay = getOverlayElement(section, getOverlayColor(section, config.overlayColor));
        gsap.set(overlay, { opacity });
        timeline.to(overlay, { opacity: 0, ease: "none" }, 0);
      }

      return;
    }

    const nextSection = section.nextElementSibling as HTMLElement | null;
    if (!nextSection) return;

    if (mode === "pin") {
      // CSS sticky instead of a GSAP pin: a JS pin toggles position:fixed from scroll events, which lag
      // behind native touch scrolling and make the section jitter on phones. Sticky is composited by the
      // browser. The section holds still once its bottom edge reaches the bottom of the scroll
      // container (same moment the old pin started), while the next section slides over it.
      gsap.set(section, { position: "sticky" });
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        onRefresh: () => {
          gsap.set(section, { top: Math.min(0, getScrollerHeight(section) - section.offsetHeight) });
        },
      });

      if (configuredMode === "parallax" && opacity !== null) {
        const overlay = getOverlayElement(section, getOverlayColor(section, config.overlayColor));

        gsap
          .timeline({
            scrollTrigger: {
              trigger: nextSection,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          })
          .to(overlay, { opacity, ease: "none" }, 0);
        return;
      }

      resetOverlay(section);
      return;
    }

    const scrollTrigger = {
      trigger: nextSection,
      start: "top bottom",
      end: "top top",
      scrub: true,
    };

    const tween = {
      y,
      ease: "none",
      force3D: true,
    };

    if (opacity === null) {
      resetOverlay(section);
      gsap.to(section, { ...tween, scrollTrigger });
      return;
    }

    const overlay = getOverlayElement(section, getOverlayColor(section, config.overlayColor));

    gsap
      .timeline({ scrollTrigger })
      .to(section, tween, 0)
      .to(overlay, { opacity, ease: "none" }, 0);
  });
}
