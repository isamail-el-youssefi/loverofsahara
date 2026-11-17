import { useEffect, useState, useRef, type ReactNode, type MutableRefObject } from "react";
import { motion, AnimatePresence, useIsPresent, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { textReveal01 } from "@/lib/textReveal01";
import { sectionTransition01 } from "@/lib/sectionTransition01";
import { ScrollContainerContext } from "@/lib/scrollContainer";
import { canonicalPath, parseRoute, routeKey } from "@/lib/routes";
import { usePageSeo } from "@/lib/seo";
import { homeSeo } from "@/lib/seoData";
import { HeroSection } from "@/components/HeroSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { GalleryZoomSection } from "@/components/GalleryZoomSection";
import { Footer } from "@/components/Footer";
import { HomeAbout } from "@/components/home/HomeAbout";
import { CtaSection } from "@/components/CtaSection";
import { HomeFeaturedTrips } from "@/components/home/HomeFeaturedTrips";
import { HomeReviews } from "@/components/home/HomeReviews";
import { Blog } from "@/pages/Blog";
import { Trips } from "@/pages/Trips";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { TripDetail } from "@/pages/TripDetail";
import { PlaceDetail } from "@/pages/PlaceDetail";
import { ArticleDetail } from "@/pages/ArticleDetail";
import { PagePreloader } from "@/components/PagePreloader";

/** Swup-style transition: values mirror the reference (1.4s, cubic-bezier(0.4, 0.3, 0, 1)). */
const TRANSITION = { duration: 1.4, ease: [0.4, 0.3, 0, 1] as const };

interface PageProps {
  children: ReactNode;
  /** Run the GSAP section / text-reveal systems for this page. */
  animated: boolean;
  /** Preloader finished. */
  ready: boolean;
  /** Receives the Lenis instance of the page that is currently active. */
  activeLenis: MutableRefObject<Lenis | null>;
}

/**
 * Options for every programmatic scroll (section tabs, menu anchors): one ~1 s glide with a soft landing.
 * An explicit duration keeps long jumps predictable (lerp alone would crawl on far targets).
 */
const JUMP = { offset: -20, duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 4) };

/**
 * One routed page = one nested scroll container (the `#swup` equivalent).
 * Old and new pages are rendered together by AnimatePresence in the same grid cell.
 */
function Page({ children, animated, ready, activeLenis }: PageProps) {
  const isPresent = useIsPresent();
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Smooth scrolling inside this page's own scroll container (not window)
  useEffect(() => {
    const wrapper = scrollRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      // Light, close-to-native wheel smoothing (lerp): it eases a little, then settles soon after the wheel stops.
      lerp: 0.09,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      // Lenis switches smoothing off (and makes every scrollTo instant) when the OS asks for reduced motion,
      // e.g. Windows "Animation effects" off. The site's scrolling is meant to glide regardless.
      respectReducedMotion: false,
    });
    activeLenis.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (activeLenis.current === lenis) activeLenis.current = null;
    };
  }, [activeLenis]);

  // GSAP scroll systems, scoped to this page and bound to its scroll container
  useEffect(() => {
    const wrapper = scrollRef.current;
    if (!animated || !ready || !wrapper) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;
      ScrollTrigger.defaults({ scroller: wrapper });
      ctx = gsap.context(() => {
        sectionTransition01(wrapper);
        textReveal01(wrapper);
        ScrollTrigger.refresh();
      }, wrapper);
    };

    if (document.fonts?.ready) document.fonts.ready.then(init);
    else requestAnimationFrame(init);

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [animated, ready]);

  return (
    <motion.main
      ref={scrollRef}
      initial={
        reduce
          ? { opacity: 0 }
          : { y: Math.round(window.innerHeight / 2), clipPath: "inset(70% 0% 0% 0%)" }
      }
      animate={{ y: 0, scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      exit={reduce ? { opacity: 0 } : { y: -160, scale: 0.95, opacity: 0.5 }}
      transition={reduce ? { duration: 0.2 } : TRANSITION}
      onAnimationComplete={() => ScrollTrigger.refresh()}
      style={{ zIndex: isPresent ? 2 : 1, pointerEvents: isPresent ? "auto" : "none" }}
      className="col-start-1 row-start-1 h-[100dvh] overflow-y-auto overflow-x-hidden bg-paper text-ink antialiased"
    >
      <ScrollContainerContext.Provider value={scrollRef}>
        <div ref={contentRef}>
          <div>{children}</div>
          <Footer />
        </div>
      </ScrollContainerContext.Provider>
    </motion.main>
  );
}

/** The home page has no component of its own, so this sets its head. */
function HomeSeo() {
  usePageSeo(homeSeo());
  return null;
}

/** The home page sections, in order. */
function Home() {
  return (
    <>
      <HomeSeo />
      <HeroSection />
      <HomeAbout />
      <CategoriesSection />
      <HomeFeaturedTrips />
      <DestinationsSection />
      <ProcessSection />
      <HomeReviews />
      <ArticlesSection />
      <GalleryZoomSection />
      <CtaSection />
    </>
  );
}

export default function App() {
  // The page is chosen by the URL path (real, crawlable URLs). Old #hash routes and the previous site's
  // numeric URLs are rewritten to the new paths before anything renders.
  const [path, setPath] = useState(() => {
    const fixed = canonicalPath(window.location.pathname, window.location.hash);
    if (fixed) window.history.replaceState(null, "", fixed);
    return window.location.pathname;
  });
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const activeLenis = useRef<Lenis | null>(null);

  const route = parseRoute(path);
  const isTrip = route.name === "trip";
  const isPlace = route.name === "place";
  const isArticle = route.name === "article";
  const key = routeKey(route);
  const routeKeyRef = useRef(key);
  routeKeyRef.current = key;

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const scrollToAnchor = (selector: string) => {
      try {
        const el = document.querySelector(selector);
        if (el) activeLenis.current?.scrollTo(el as HTMLElement, JUMP);
      } catch {
        /* invalid selector */
      }
    };

    // Back/forward, and old #hash links typed or pasted into the address bar
    const handlePopState = () => {
      const fixed = canonicalPath(window.location.pathname, window.location.hash);
      if (fixed) window.history.replaceState(null, "", fixed);
      setPath(window.location.pathname);
      if (!fixed && routeKeyRef.current === "home" && window.location.hash) scrollToAnchor(window.location.hash);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (e.target as HTMLElement)?.closest("a");
      const href = target?.getAttribute("href");
      if (!target || !href || target.target === "_blank" || target.hasAttribute("download")) return;

      // Internal page link (/trips/..., /places/..., /blog): client-side navigation, no reload.
      if (href.startsWith("/") && !href.startsWith("//")) {
        e.preventDefault();
        if (href !== window.location.pathname) window.history.pushState(null, "", href);
        setPath(window.location.pathname);
        return;
      }

      if (!href.startsWith("#")) return;
      e.preventDefault();

      if (href === "#" || href === "") {
        // Logo: scroll to the top on the home page, otherwise go home.
        if (routeKeyRef.current === "home") {
          activeLenis.current?.scrollTo(0, { ...JUMP, offset: 0 });
        } else {
          window.history.pushState(null, "", "/");
          setPath("/");
        }
      } else if (routeKeyRef.current === "home") {
        // In-page anchor on the home page (#expeditions, #process, ...)
        scrollToAnchor(href);
        window.history.pushState(null, "", href);
      }
    };

    // In-page smooth scroll requested by components (e.g. the trip page's floating section tabs)
    const handleScrollTo = (e: Event) => {
      const el = (e as CustomEvent<{ el?: HTMLElement }>).detail?.el;
      if (el) activeLenis.current?.scrollTo(el, JUMP);
    };
    window.addEventListener("los-scroll-to", handleScrollTo);

    window.addEventListener("hashchange", handlePopState);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleAnchorClick);
    return () => {
      window.removeEventListener("los-scroll-to", handleScrollTo);
      window.removeEventListener("hashchange", handlePopState);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <>
      <PagePreloader onComplete={() => setIsPreloaderDone(true)} />
      {/* Viewport shell: locks the transition to the viewport; pages scroll inside themselves */}
      <div className="grid h-[100dvh] overflow-hidden bg-ink-deep">
        {/* Default sync mode keeps the outgoing and incoming pages mounted together */}
        <AnimatePresence initial={false}>
          <Page
            key={key}
            animated={route.name === "home" || isTrip || isPlace || route.name === "about" || route.name === "contact"}
            ready={isPreloaderDone}
            activeLenis={activeLenis}
          >
            {route.name === "blog" ? (
              <Blog />
            ) : route.name === "trips" ? (
              <Trips />
            ) : route.name === "about" ? (
              <About />
            ) : route.name === "contact" ? (
              <Contact />
            ) : route.name === "trip" ? (
              <TripDetail slug={route.slug} />
            ) : route.name === "place" ? (
              <PlaceDetail id={route.id} />
            ) : route.name === "article" ? (
              <ArticleDetail id={route.id} />
            ) : (
              <Home />
            )}
          </Page>
        </AnimatePresence>
      </div>
      {/* No bottom blur on the detail pages (trip + article) */}
    </>
  );
}
