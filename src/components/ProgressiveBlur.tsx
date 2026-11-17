import { useEffect, useState } from "react";

/** Hidden while the hero section fills the viewport; shown once it has scrolled away. */
export function ProgressiveBlur() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector("[data-hero-section]");
      const scroller = hero?.closest("main");
      if (!hero || !scroller) return setHidden(false);
      // Hero is h-screen at the top of the scroller: blur appears once the next section starts under the 200px band.
      setHidden(scroller.scrollTop < hero.clientHeight - 200);
    };
    update();
    document.addEventListener("scroll", update, { capture: true, passive: true });
    window.addEventListener("hashchange", update);
    const t = window.setInterval(update, 300);
    return () => {
      document.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("hashchange", update);
      window.clearInterval(t);
    };
  }, []);

  return (
    <div
      className="progressive-blur bottom-blur"
      aria-hidden="true"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.3s ease" }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <div key={n} className={`layer blur-${n}`} />
      ))}
    </div>
  );
}
