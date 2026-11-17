/**
 * Lets the preloader hand its playback position to the hero video so the footage
 * continues from the same frame when the preloader fades away.
 */
let heroEl: HTMLVideoElement | null = null;

export function registerHeroVideo(el: HTMLVideoElement | null) {
  heroEl = el;
}

export function syncHeroVideo(time: number) {
  if (!heroEl || !Number.isFinite(time)) return;
  const d = heroEl.duration;
  // Only jump when clearly out of step, to avoid a visible seek for no reason
  if (Number.isFinite(d) && d > 0 && Math.abs(heroEl.currentTime - time) > 0.35) {
    try {
      heroEl.currentTime = time % d;
    } catch {
      /* not seekable yet */
    }
  }
  if (heroEl.paused) heroEl.play().catch(() => {});
}
