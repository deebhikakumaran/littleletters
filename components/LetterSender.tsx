"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  THEMES, FONTS, PRESETS, ThemeKey, FontKey, Custom, LetterState,
  paletteFor, fontFamilyFor, makeLink, plainText, encodeLetter,
} from "@/lib/letter";
import {
  Styles, Group, Slider, ColorRow, Tool, chip, btn, Toast, useToast, copyText,
} from "@/components/ui";
import { RichEditor, RichEditorHandle } from "@/components/RichEditor";
import { LetterPaper } from "@/components/LetterPaper";

export default function LetterSender() {
  const [to, setTo] = useState("");
  const [body, setBody] = useState(""); // html
  const [theme, setTheme] = useState<ThemeKey>("light");
  const [font, setFont] = useState<FontKey>("serif");
  const [size, setSize] = useState(17);
  const [line, setLine] = useState(1.7);
  const [pad, setPad] = useState(56);
  const [custom, setCustom] = useState<Custom | null>(null);
  const [activePreset, setActivePreset] = useState("minimalist");
  const [previewMode, setPreviewMode] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [panelW, setPanelW] = useState(320);

  // is this a small screen? (mobile/tablet) — drives the stacked layout
  const [isMobile, setIsMobile] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false); // mobile: panel collapsed by default

  const { msg, flash } = useToast();
  const edRef = useRef<RichEditorHandle>(null);
  const dragging = useRef(false);

  // track viewport width
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // draggable divider (desktop only)
  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      setPanelW(Math.min(520, Math.max(220, x)));
    };
    const up = () => { dragging.current = false; document.body.style.userSelect = ""; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move); window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up);
    };
  }, []);

  const state = (): LetterState => ({ to, body, theme, font, size, line, pad, custom });
  const pal = useMemo(() => paletteFor(theme, custom), [theme, custom]);
  const fontFam = fontFamilyFor({ theme, font, custom });
  const plain = useMemo(() => plainText(body), [body]);

  const stats = useMemo(() => {
    const text = plain.replace(/\s+/g, " ").trim();
    const words = text ? text.split(" ").length : 0;
    return { chars: plain.length, words, mins: Math.max(1, Math.round(words / 200)) };
  }, [plain]);

  const applyPreset = (key: string) => {
    const p = PRESETS[key];
    setActivePreset(key);
    setTheme(p.theme); setFont(p.font); setSize(p.size); setLine(p.line); setPad(p.pad);
    setCustom(null);
  };

  const copyLetter = () => {
    if (!plain.trim()) return flash("write a little something first ✿");
    copyText((to ? to + "\n\n" : "") + plain, () => flash("letter copied ✿"));
  };
  const copyLink = () => copyText(makeLink(state()), () => flash("link copied — send it to your person ✿"));
  const openShare = () => { if (!plain.trim()) return flash("write a little something first ✿"); setShareOpen(true); };

  const sendEmail = async () => {
    const from = prompt("leave a name to be known, or skip to stay a ghost."); 
    const toEmail = prompt("send to which email?"); 
    if (!toEmail) return;
    flash("sending…");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail, fromName: from, link: makeLink(state()) }),
      });
      const data = await res.json();
      if (data.ok) {
        flash("sent ✿");
        setShareOpen(false); 
      }
      else flash("couldn't send — try the link instead");
    } catch {
      flash("couldn't send — try the link instead");
    }
  };

  // ── the controls panel (shared between desktop sidebar and mobile drawer) ──
  const Panel = (
    <>
      <Group label="presets">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.keys(PRESETS).map((k) => (
            <button key={k} onClick={() => applyPreset(k)}
              style={chip(activePreset === k && theme !== "custom", pal)}>{PRESETS[k].label}</button>
          ))}
        </div>
      </Group>

      <Group label="typography">
        <div style={{ fontSize: 12, opacity: .6, margin: "10px 0 6px" }}>font</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(FONTS) as FontKey[]).map((f) => (
            <button key={f} onClick={() => setFont(f)} style={chip(font === f, pal)}>{f}</button>
          ))}
        </div>
        <Slider label="size" min={12} max={26} step={1} value={size} unit="px" onChange={setSize} pal={pal} />
        <Slider label="line height" min={1.2} max={2.6} step={0.1} value={line} onChange={setLine} pal={pal} />
      </Group>

      <Group label="theme">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(["light", "dark", "sepia", "custom"] as ThemeKey[]).map((t) => (
            <button key={t} onClick={() => {
              setTheme(t);
              if (t === "custom" && !custom)
                setCustom({ paper: "#fbeef0", ink: "#3a2a2c", accent: "#e8908a", font: FONTS.serif });
            }} style={chip(theme === t, pal)}>{t}</button>
          ))}
        </div>
        {theme === "custom" && custom && (
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <ColorRow label="paper" value={custom.paper} onChange={(v) => setCustom({ ...custom, paper: v })} pal={pal} />
            <ColorRow label="ink" value={custom.ink} onChange={(v) => setCustom({ ...custom, ink: v })} pal={pal} />
            <ColorRow label="accent" value={custom.accent} onChange={(v) => setCustom({ ...custom, accent: v })} pal={pal} />
          </div>
        )}
      </Group>

      <Group label="spacing">
        <Slider label="padding" min={24} max={96} step={4} value={pad} unit="px" onChange={setPad} pal={pal} />
      </Group>
    </>
  );

  // ── the editor pane (shared) ──
  const Editor = (
    <main style={{ padding: isMobile ? "16px 16px 20px" : "26px 24px 26px", display: "flex",
      flexDirection: "column", alignItems: "center", background: pal.paper,
      height: "100%", minHeight: 0, overflow: "hidden" }}>

      {/* back to home + (mobile) styles toggle */}
      <div style={{ flexShrink: 0, width: "100%", maxWidth: 640, display: "flex",
        justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        {isMobile
          ? <button onClick={() => setPanelOpen(true)} style={{ ...chip(false, pal), fontWeight: 700 }}>✿ styles</button>
          : <span />}
        <Link href="/" style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 14,
          letterSpacing: ".04em", color: pal.soft, textDecoration: "none" }}>← little letters</Link>
      </div>

      {/* toolbar (fixed) */}
      <div style={{ flexShrink: 0, display: "flex", gap: 4, background: pal.accent + "22", borderRadius: 999, padding: 6, marginBottom: 18 }}>
        <Tool onClick={() => edRef.current?.format("bold")} pal={pal} disabled={previewMode}><b>b</b></Tool>
        <Tool onClick={() => edRef.current?.format("italic")} pal={pal} disabled={previewMode}><i>i</i></Tool>
        <Tool onClick={() => edRef.current?.format("quote")} pal={pal} disabled={previewMode}>❝</Tool>
        <Tool onClick={() => edRef.current?.format("bullet")} pal={pal} disabled={previewMode}>•</Tool>
        <span style={{ width: 1, background: pal.line, margin: "4px 4px" }} />
        <Tool onClick={() => { edRef.current?.clear(); setBody(""); }} pal={pal} title="clear all" disabled={previewMode}>⌫</Tool>
        <span style={{ width: 1, background: pal.line, margin: "4px 4px" }} />
        <Tool onClick={() => setPreviewMode((v) => !v)} pal={pal} title="preview / write">{previewMode ? "✎" : "👁"}</Tool>
      </div>

      <LetterPaper pal={pal} pad={isMobile ? Math.min(pad, 28) : pad} fill>
        {previewMode
          ? (to.trim() ? <div style={{ flexShrink: 0, color: pal.soft, fontFamily: FONTS.sans, fontSize: 18,
              borderBottom: `1px dashed ${pal.line}`, paddingBottom: 12, marginBottom: 20 }}>{to}</div> : null)
          : <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="to my dearest."
              style={{ flexShrink: 0, border: "none", borderBottom: `1px dashed ${pal.line}`, background: "transparent",
                color: pal.ink, fontFamily: FONTS.sans, fontSize: 14, padding: "4px 0 12px",
                marginBottom: 20, outline: "none", width: "100%" }} />}
        <RichEditor
          ref={edRef}
          html={body}
          onChange={setBody}
          editable={!previewMode}
          placeholder="start writing here."
          className="ll-scroll"
          style={{ flex: 1, minHeight: 0, overflowY: "auto", outline: "none", color: pal.ink,
            fontFamily: fontFam, fontSize: size, lineHeight: line, overflowWrap: "anywhere",
            wordBreak: "break-word", cursor: previewMode ? "default" : "text" }}
        />
      </LetterPaper>

      <div style={{ flexShrink: 0, fontFamily: FONTS.sans, fontSize: 13, color: pal.soft, marginTop: 12, textAlign: "center" }}>
        {stats.words} words · {stats.chars} characters · {stats.mins} min read
        {stats.words > 1000 && <span style={{ color: pal.accent }}> · a long, lovely one</span>}
      </div>

      <div style={{ flexShrink: 0, display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={copyLetter} style={btn("transparent", pal.ink, pal, true)}>copy text</button>
        <button onClick={openShare} style={btn("#2e2a26", "#fbf7f2", pal)}>finish &amp; share ✿</button>
      </div>
    </main>
  );

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: pal.paper,
      ...(isMobile
        ? { display: "block" }
        : { display: "grid", gridTemplateColumns: `${panelW}px 6px 1fr` }),
      fontFamily: FONTS.sans, color: pal.ink }}>
      <Styles />

      {!isMobile && (
        <>
          {/* ── desktop: left pane ── */}
          <aside className="ll-scroll" style={{ padding: "26px 22px 60px", borderRight: `1px solid ${pal.line}`,
            background: pal.paper, color: pal.ink, overflowY: "auto", height: "100%", minHeight: 0 }}>
            {Panel}
          </aside>

          {/* draggable divider */}
          <div onMouseDown={() => { dragging.current = true; document.body.style.userSelect = "none"; }}
            onTouchStart={() => { dragging.current = true; }}
            title="drag to resize"
            style={{ cursor: "col-resize", background: pal.line, position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 4, height: 34, borderRadius: 999, background: pal.accent, opacity: .6 }} />
          </div>
        </>
      )}

      {/* editor — full width on mobile, right pane on desktop */}
      {Editor}

      {/* ── mobile: styles drawer ── */}
      {isMobile && panelOpen && (
        <div onClick={() => setPanelOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
          display: "flex", alignItems: "flex-end", zIndex: 70 }}>
          <div onClick={(e) => e.stopPropagation()} className="ll-scroll"
            style={{ background: pal.paper, color: pal.ink, width: "100%", maxHeight: "82vh", overflowY: "auto",
              borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: "20px 22px 40px",
              boxShadow: "0 -20px 60px rgba(0,0,0,.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 22 }}>styles ✿</div>
              <button onClick={() => setPanelOpen(false)} style={{ background: "none", border: "none",
                color: pal.soft, fontFamily: FONTS.sans, fontWeight: 700, fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            {Panel}
            <button onClick={() => setPanelOpen(false)} style={{ ...btn("#2e2a26", "#fbf7f2", pal), width: "100%", marginTop: 14 }}>done</button>
          </div>
        </div>
      )}

      <Toast msg={msg} />

      {shareOpen && (
        <div onClick={() => setShareOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: pal.paper, color: pal.ink, borderRadius: 22,
            maxWidth: 460, width: "100%", padding: 30, fontFamily: FONTS.sans, boxShadow: "0 30px 80px rgba(0,0,0,.3)" }}>
            <h3 style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 26, margin: "0 0 6px" }}>your letter is ready ✿</h3>
            <p style={{ color: pal.soft, fontSize: 14, margin: "0 0 18px", lineHeight: 1.5 }}>
              share it with the one person it's for.</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <input readOnly value={makeLink(state())} style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 13,
                padding: "12px 14px", borderRadius: 12, border: `1px solid ${pal.line}`,
                background: pal.accent + "18", color: pal.ink, outline: "none" }} />
              <button onClick={copyLink} style={btn("#2e2a26", "#fbf7f2", pal)}>copy</button>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={sendEmail} style={{ ...btn("transparent", pal.ink, pal, true), flex: 1 }}>✉ send by email</button>
              <a href={"/viewer#l=" + encodeLetter(state())} target="_blank" rel="noopener"
                style={{ ...btn("transparent", pal.ink, pal, true), flex: 1, textAlign: "center", textDecoration: "none" }}>👀 open preview</a>
            </div>
            <button onClick={() => setShareOpen(false)} style={{ marginTop: 16, width: "100%", background: "none",
              border: "none", color: pal.soft, fontFamily: FONTS.sans, fontWeight: 600, cursor: "pointer", padding: 8 }}>close</button>
          </div>
        </div>
      )}
    </div>
  );
}