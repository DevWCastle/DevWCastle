export const INTRO_SESSION_KEY = 'dwc-intro-seen';

/** A intro toca só na primeira visita da sessão e nunca com movimento reduzido. */
export function shouldPlayIntro() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !window.sessionStorage.getItem(INTRO_SESSION_KEY);
  } catch {
    return false;
  }
}
