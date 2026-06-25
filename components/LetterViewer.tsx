"use client";
import React, { useEffect, useState } from "react";
import { LetterState, decodeLetter, paletteFor, fontFamilyFor, FONTS } from "@/lib/letter";
import { Styles, btn } from "@/components/ui";
import { LetterPaper } from "@/components/LetterPaper";
import Link from "next/link";

export default function LetterViewer() {
  const [letter, setLetter] = useState<LetterState | null>(null);
  const [show, setShow] = useState(false);
  const [bad, setBad] = useState(false);

  useEffect(() => {
    const h = window.location.hash;
    if (h.startsWith("#l=")) {
      try { setLetter(decodeLetter(h.slice(3))); setTimeout(() => setShow(true), 30); }
      catch (e) { setBad(true); }
    } else setBad(true);
  }, []);

  if (bad) {
    const pal = paletteFor("light", null);
    return (
      <div style={{ minHeight: "100vh", background: pal.paper, color: pal.ink, fontFamily: FONTS.sans,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <Styles />
        <div style={{ fontFamily: FONTS.display, fontSize: 28 }}>no letter here ✿</div>
        <p style={{ color: pal.soft }}>this link doesn't seem to hold a letter.</p>
        <Link href="/editor" style={{ ...btn("#2e2a26", "#fbf7f2", pal), textDecoration: "none" }}>write one</Link>
      </div>
    );
  }

  if (!letter) return null;

  const pal = paletteFor(letter.theme, letter.custom);
  const fontFam = fontFamilyFor(letter);

  return (
    <div style={{ minHeight: "100vh", background: pal.paper, display: "flex",
      flexDirection: "column", alignItems: "center", padding: "6vh 20px" }}>
      <Styles />
      <div style={{ fontFamily: FONTS.sans, color: pal.soft, fontSize: 12, letterSpacing: ".14em",
        textTransform: "uppercase", marginBottom: 20 }}>a letter for you</div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center",
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(8px)",
        transition: "opacity .5s ease, transform .5s ease" }}>
        <LetterPaper pal={pal} pad={letter.pad}>
          {letter.to && <div style={{ color: pal.soft, fontFamily: FONTS.sans, fontSize: 18,
            borderBottom: `1px dashed ${pal.line}`, paddingBottom: 12, marginBottom: 22 }}>{letter.to}</div>}
          <div className="ll-editor" style={{ fontFamily: fontFam, fontSize: letter.size,
            lineHeight: letter.line, color: pal.ink }}
            dangerouslySetInnerHTML={{ __html: letter.body }} />
        </LetterPaper>
      </div>

      <Link href="/editor" style={{ ...btn("#2e2a26", "#fbf7f2", pal), marginTop: 24, textDecoration: "none" }}>write one back</Link>
    </div>
  );
}
