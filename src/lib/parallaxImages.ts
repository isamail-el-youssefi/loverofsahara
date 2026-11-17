import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven image parallax: each `[data-parallax-image]` frame stays in the page flow while its direct
 * <img>/<picture> child moves down inside the clipped frame as the page scrolls (styles in styles.css).
 *
 * `scroller` is the element that actually scrolls (this site scrolls inside <main>, not the window).
 * Returns a cleanup that reverts only the tweens created here; call it before the frames unmount.
 * Re-running on the same frame reverts the previous instance first.
 */
const instances = new WeakMap<Element, () => void>();

export function parallaxImages(scope: Document | Element = document, scroller?: Element | null, travel = 19) {
  const selector = "[data-parallax-image]";
  const frames = [...scope.querySelectorAll<HTMLElement>(selector)];
  if (scope instanceof Element && scope.matches(selector)) frames.unshift(scope as HTMLElement);
  const cleanups: (() => void)[] = [];

  frames.forEach((frame) => {
    instances.get(frame)?.();
    const image = frame.querySelector(":scope > img, :scope > picture");
    if (!image) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        image,
        { yPercent: 0, scale: 1 + travel / 100, transformOrigin: "center bottom" },
        {
          yPercent: travel,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            ...(scroller ? { scroller } : {}),
          },
        },
      );
    }, frame);

    const cleanup = () => {
      if (instances.get(frame) !== cleanup) return;
      context.revert();
      instances.delete(frame);
    };
    instances.set(frame, cleanup);
    cleanups.push(cleanup);
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
