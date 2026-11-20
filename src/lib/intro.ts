/**
 * Intro → page hand-off. A pre-paint script (INTRO_BOOT, inlined in layout.tsx) sets
 * <html data-intro="pending"> when the intro will play; otherwise it adds `.lit` straight away.
 * During the intro the centre ember "ignites" the page: <html> gets `.lit` and IGNITE fires.
 * INTRO_DONE always fires at the end (also on skip and reduced motion).
 */
export const INTRO_DONE = "ikigai:intro-done";
export const IGNITE = "ikigai:ignite";
export const INTRO_KEY = "ikigai-intro-seen";

/**
 * Runs before first paint: play the intro unless it was already seen this session.
 * Only reads sessionStorage; the "seen" key is written by <Intro /> when the intro actually finishes.
 * URL override for testing: ?intro=1 always plays it (ignores sessionStorage), ?intro=0 skips it.
 * (prefers-reduced-motion is still honoured by <Intro />: it skips straight to the final state.)
 */
export const INTRO_BOOT = `(function(){var h=document.documentElement,m=/[?&]intro=([01])(?:&|$)/.exec(location.search);function play(){h.dataset.intro="pending"}function skip(){h.classList.add("lit")}if(m){m[1]==="1"?play():skip();return}try{if(!sessionStorage.getItem("${INTRO_KEY}")){play();return}}catch(e){play();return}skip()})()`;

const pending = () => {
  const s = document.documentElement.dataset.intro;
  return s === "pending" || s === "running";
};

export function whenIntroDone(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (!pending()) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE, cb);
}

/** Fires when the page is lit: immediately if there's no intro, else at the intro's ignite moment. */
export function whenIgnited(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (document.documentElement.classList.contains("lit") || !pending()) {
    cb();
    return () => {};
  }
  let done = false;
  const once = () => {
    if (done) return;
    done = true;
    cb();
  };
  window.addEventListener(IGNITE, once, { once: true });
  window.addEventListener(INTRO_DONE, once, { once: true });
  return () => {
    window.removeEventListener(IGNITE, once);
    window.removeEventListener(INTRO_DONE, once);
  };
}
