import { useEffect, useState } from "react";
import Lenis from "lenis";
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

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash || "");

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

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

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
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  const isArticle = hash.startsWith("#article");
  const articleId = isArticle ? parseInt(hash.replace(/[^0-9]/g, "")) || 1 : null;

  return (
    <main className="min-h-screen bg-white text-black antialiased">
      {hash === "#blog" ? (
        <Blog />
      ) : isArticle ? (
        <ArticleDetail id={articleId} />
      ) : (
        <>
          <HeroSection />
          {/* <AboutSection /> */}
          <CategoriesSection />
          <DestinationsSection />
{/*           <InventorySection />
 */}          <ProcessSection />
          <ArticlesSection />
          <GalleryZoomSection />
{/*           <CtaSection />
 */}        </>
      )}
      <Footer />
    </main>
  );
}
