export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "moviegrab-theme";

/**
 * Inline head script. It runs before first paint, so day mode is already
 * on the document when pixels show up. Night is used only when the visitor
 * previously chose it — never as the loading default.
 */
export const themeBootScript = `(function(){try{var stored=localStorage.getItem("${THEME_STORAGE_KEY}");var theme=stored==="dark"?"dark":"light";var root=document.documentElement;root.classList.remove("light","dark");root.classList.add(theme);root.dataset.theme=theme;root.style.colorScheme=theme;}catch(e){}})();`;
