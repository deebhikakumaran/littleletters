// ─────────────────────────────────────────────────────────────
// shared config + helpers for little letters
// the whole letter is encoded into the link — no database, ever.
// ─────────────────────────────────────────────────────────────

// ⚙️ set this to your real domain when you deploy (e.g. "https://littleletters.app").
// leave "" to auto-use the current site.
export const SHARE_BASE = "";

export type ThemeKey = "light" | "dark" | "sepia" | "blush" | "sky" | "custom";
export type FontKey = "serif" | "display" | "sans" | "mono";

export interface Palette {
  paper: string; ink: string; soft: string; accent: string; line: string;
}

export const THEMES: Record<Exclude<ThemeKey, "custom">, Palette> = {
  light: { paper: "#fbf7f2", ink: "#2e2a26", soft: "#7c7066", accent: "#e8908a", line: "rgba(46,42,38,.12)" },
  dark:  { paper: "#24201d", ink: "#efe5d9", soft: "#b3a596", accent: "#e8908a", line: "rgba(239,229,217,.14)" },
  sepia: { paper: "#f3e7d3", ink: "#4a3a28", soft: "#8a7458", accent: "#c98a5e", line: "rgba(74,58,40,.14)" },
  blush: { paper: "#fbeae8", ink: "#4a2f30", soft: "#8a6164", accent: "#f4948c", line: "rgba(74,47,48,.13)" },
  sky:   { paper: "#eef5f8", ink: "#243640", soft: "#5d7682", accent: "#7fb4cc", line: "rgba(36,54,64,.13)" },
};

export const FONTS: Record<FontKey, string> = {
  serif:   "'Newsreader', Georgia, serif",
  display: "'Fraunces', Georgia, serif",
  sans:    "'Nunito', system-ui, sans-serif",
  mono:    "'Courier New', monospace",
};

export interface Preset { label: string; theme: ThemeKey; font: FontKey; size: number; line: number; pad: number; }

export const PRESETS: Record<string, Preset> = {
  minimalist:   { label: "minimalist",   theme: "light", font: "sans",    size: 17, line: 1.7,  pad: 56 },
  romantic:     { label: "romantic",     theme: "blush", font: "display", size: 19, line: 2.0,  pad: 64 },
  professional: { label: "professional", theme: "light", font: "serif",   size: 16, line: 1.6,  pad: 48 },
  warm:         { label: "warm",         theme: "sepia", font: "serif",   size: 18, line: 1.85, pad: 60 },
};

export interface Custom { paper: string; ink: string; accent: string; font: string; }

export interface LetterState {
  to: string;
  body: string;        // html
  theme: ThemeKey;
  font: FontKey;
  size: number;
  line: number;
  pad: number;
  custom: Custom | null;
}

export function paletteFor(theme: ThemeKey, custom: Custom | null): Palette {
  if (theme === "custom" && custom) {
    return { paper: custom.paper, ink: custom.ink, accent: custom.accent,
      soft: custom.ink + "99", line: custom.ink + "1f" };
  }
  return THEMES[(theme as Exclude<ThemeKey, "custom">)] || THEMES.light;
}

export function fontFamilyFor(state: Pick<LetterState, "theme" | "font" | "custom">): string {
  if (state.theme === "custom" && state.custom?.font) return state.custom.font;
  return FONTS[state.font];
}

// unicode-safe encode/decode — the letter lives in the link only
export const encodeLetter = (s: LetterState): string =>
  btoa(unescape(encodeURIComponent(JSON.stringify(s))));

export const decodeLetter = (str: string): LetterState =>
  JSON.parse(decodeURIComponent(escape(atob(str))));

export function makeLink(s: LetterState): string {
  const base = SHARE_BASE || (typeof window !== "undefined"
    ? window.location.origin : "");
  return base.replace(/\/$/, "") + "/viewer#l=" + encodeLetter(s);
}

export function plainText(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ");
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.innerText || "";
}
