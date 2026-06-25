"use client";
import React from "react";
import Link from "next/link";
import { THEMES, FONTS } from "@/lib/letter";
import { Styles } from "@/components/ui";

export default function LandingPage() {
  const accent = THEMES.blush.accent;
  return (
    <div style={{ minHeight: "100vh", background: accent, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Styles />
      <div style={{ position: "relative", maxWidth: "min(620px,90vw)", width: "100%" }}>
        <img src="/cat.jpeg" alt="cat" style={{ display: "block", width: "100%",
          borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,.18)" }} />

        {/* peekaboo link — sits in the white strip, centered */}
        <Link href="/about" style={{ position: "absolute", bottom: "28%", left: "50%",
          transform: "translateX(-50%)", fontFamily: FONTS.sans, fontWeight: 600, fontSize: 15,
          letterSpacing: ".08em", color: "#2e2a26", textDecoration: "none", opacity: .75 }}>
          [ peekaboo ]
        </Link>

        {/* begin button — overlaps the bottom edge */}
        <Link href="/editor" style={{ position: "absolute", bottom: 18, left: "50%",
          transform: "translateX(-50%)", fontFamily: FONTS.sans, fontWeight: 700, fontSize: 18,
          textTransform: "lowercase", background: "#2e2a26", color: "#fbf7f2", textDecoration: "none",
          padding: "16px 46px", borderRadius: 999, boxShadow: "0 12px 30px rgba(0,0,0,.25)" }}>
          begin
        </Link>
      </div>
    </div>
  );
}

