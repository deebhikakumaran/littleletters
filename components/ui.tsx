"use client";
import React, { useEffect, useState } from "react";
import { FONTS, Palette } from "@/lib/letter";

// inject google fonts + thin smooth scrollbars once
export function Styles() {
  useEffect(() => {
    if (!document.getElementById("ll-fonts")) {
      const l = document.createElement("link");
      l.id = "ll-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Nunito:wght@400;600;700&display=swap";
      document.head.appendChild(l);
    }
    if (!document.getElementById("ll-style")) {
      const s = document.createElement("style");
      s.id = "ll-style";
      s.textContent = `
        *{box-sizing:border-box;}
        html,body{margin:0;padding:0;}
        .ll-scroll{scrollbar-width:none;-ms-overflow-style:none;scroll-behavior:smooth;overscroll-behavior:contain;}
        .ll-scroll::-webkit-scrollbar{width:0;height:0;display:none;}
        .ll-editor{max-width:100%;overflow-wrap:anywhere;word-break:break-word;white-space:pre-wrap;}
        .ll-editor blockquote{margin:8px 0;padding-left:14px;border-left:3px solid currentColor;opacity:.8;}
        .ll-editor ul{margin:8px 0;padding-left:22px;}
        .ll-editor:empty:before{content:attr(data-ph);opacity:.4;}
      `;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

export function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase",
        opacity: .55, fontWeight: 700, marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );
}

export function Slider({ label, min, max, step, value, unit = "", onChange, pal }:
  { label: string; min: number; max: number; step: number; value: number; unit?: string;
    onChange: (n: number) => void; pal: Palette }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: .6, marginBottom: 4 }}>
        <span>{label}</span><span>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: pal.accent }} />
    </div>
  );
}

export function ColorRow({ label, value, onChange, pal }:
  { label: string; value: string; onChange: (v: string) => void; pal: Palette }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, opacity: .8 }}>
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: 38, height: 26, border: `1px solid ${pal.line}`, borderRadius: 8, background: "none", cursor: "pointer", padding: 0 }} />
    </label>
  );
}

export function Tool({ children, onClick, pal, title, disabled }:
  { children: React.ReactNode; onClick: () => void; pal: Palette; title?: string; disabled?: boolean }) {
  return (
    <button onMouseDown={(e) => e.preventDefault()} onClick={disabled ? undefined : onClick} title={title} disabled={disabled}
      style={{ width: 34, height: 34, borderRadius: 999, border: "none",
        cursor: disabled ? "not-allowed" : "pointer", background: "transparent",
        color: pal.ink, fontSize: 15, opacity: disabled ? .35 : 1 }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget.style.background = pal.paper); }}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>{children}</button>
  );
}

export function chip(active: boolean, pal: Palette): React.CSSProperties {
  return {
    fontFamily: FONTS.sans, fontWeight: 600, fontSize: 13, textTransform: "lowercase",
    cursor: "pointer", padding: "8px 13px", borderRadius: 999,
    border: `1px solid ${active ? "transparent" : pal.line}`,
    background: active ? pal.ink : "transparent",
    color: active ? pal.paper : pal.soft, transition: ".18s",
  };
}

export function btn(bg: string, fg: string, pal: Palette, ghost = false): React.CSSProperties {
  return {
    fontFamily: FONTS.sans, fontWeight: 700, fontSize: 14, textTransform: "lowercase",
    cursor: "pointer", padding: "12px 24px", borderRadius: 999,
    border: ghost ? `1.5px solid ${pal.line}` : "none",
    background: bg, color: fg, transition: ".22s",
  };
}

export function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)",
      background: "#2e2a26", color: "#fbf7f2", fontFamily: FONTS.sans, fontWeight: 600, fontSize: 14,
      padding: "12px 22px", borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,.25)", zIndex: 50 }}>{msg}</div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState("");
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2400); };
  return { msg, flash };
}

export function copyText(text: string, done: () => void) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, () => fallback(text, done));
  } else fallback(text, done);
}
function fallback(text: string, done: () => void) {
  const t = document.createElement("textarea");
  t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
  document.body.appendChild(t); t.focus(); t.select();
  try { document.execCommand("copy"); done(); } catch (e) {}
  document.body.removeChild(t);
}
