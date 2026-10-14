import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { textReveal01 } from "@/lib/textReveal01";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { InventorySection } from "@/components/InventorySection";
import { ProcessSection } from "@/components/ProcessSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { CtaSection } from "@/components/CtaSection";
import { GalleryZoomSection } from "@/components/GalleryZoomSection";
import { Footer } from "@/components/Footer";
import { Blog } from "@/pages/Blog";
import { ArticleDetail } from "@/pages/ArticleDetail";
import { PagePreloader } from "@/components/PagePreloader";

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash || "");
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const isArticle = hash.startsWith("#article");
  const articleId = isArticle ? parseInt(hash.replace(/[^0-9]/g, "")) || 1 : null;
  const routeKey = hash === "#blog" ? "blog" : isArticle ? `article-${articleId}` : "home";

  useEffect(() => {
    if (isPreloaderDone && !isArticle && hash !== "#blog") {
      const initReveal = () => {
        textReveal01();
        ScrollTrigger.refresh();
      };

      if (document.fonts?.ready) {
        document.fonts.ready.then(initReveal);
      } else {
        requestAnimationFrame(initReveal);
      }

      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", handleLoad, { once: true });
      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
  }, [hash, isArticle, isPreloaderDone]);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const handleHashChange = () => {
      const currentHash = window.location.hash || "";
      setHash(currentHash);
      if (currentHash === "" || currentHash === "#blog" || currentHash.startsWith("#article")) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        const targetElement = document.querySelector(currentHash);
        if (targetElement) {
          lenis.scrollTo(targetElement as HTMLElement, { offset: -20 });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (target) {
        const href = target.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          if (href === "#" || href === "") {
            window.location.hash = "";
            setHash("");
            lenis.scrollTo(0, { duration: 1.2 });
          } else if (href === "#blog" || href.startsWith("#article")) {
            window.location.hash = href;
            setHash(href);
            lenis.scrollTo(0, { immediate: true });
          } else {
            const el = document.querySelector(href);
            if (el) {
              lenis.scrollTo(el as HTMLElement, { offset: -20 });
              window.history.pushState(null, "", href);
            }
          }
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenisRef.current = null;
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <>
      <PagePreloader onComplete={() => setIsPreloaderDone(true)} />
      <main className="min-h-screen bg-white text-black antialiased">
        {/* Swup container: Single content container that fades & blurs while shared UI stays in place */}
        <div id="swup" className="swup-transition-main w-full">
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              lenisRef.current?.scrollTo(0, { immediate: true });
              window.scrollTo({ top: 0, behavior: "instant" });
              ScrollTrigger.refresh();
            }}
          >
            <motion.div
              key={routeKey}
              initial={{
                opacity: 0,
                filter: shouldReduceMotion ? "none" : "blur(8px)",
                scale: shouldReduceMotion ? 1 : 0.996,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
              }}
              exit={{
                opacity: 0,
                filter: shouldReduceMotion ? "none" : "blur(8px)",
                scale: shouldReduceMotion ? 1 : 0.996,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1], // Apple fluid critically damped curve
              }}
              className="w-full"
            >
              {hash === "#blog" ? (
                <Blog />
              ) : isArticle ? (
                <ArticleDetail id={articleId} />
              ) : (
                <>
                  <HeroSection />
                  <CategoriesSection />
                  <DestinationsSection />
{/*           <InventorySection />
 */}                  <ProcessSection />
                  <ArticlesSection />
                  <GalleryZoomSection />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Shared UI outside that container stays in place */}
        <Footer />
      </main>
    </>
  );
}
