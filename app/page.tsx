"use client";
import React from "react";
import Link from "next/link";
import { THEMES, FONTS } from "@/lib/letter";
import { Styles } from "@/components/ui";

export default function LandingPage() {
  const accent = THEMES.blush.accent; // pink from the cat image
  return (
    <div style={{ minHeight: "100vh", background: accent, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 40, padding: 24 }}>
      <Styles />
      <img src="/cat.jpeg" alt="cat" style={{ maxWidth: "min(620px,90vw)", width: "100%",
        borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,.18)" }} />
      <Link href="/editor" style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 18,
        textTransform: "lowercase", background: "#2e2a26", color: "#fbf7f2", textDecoration: "none",
        padding: "16px 46px", borderRadius: 999, boxShadow: "0 12px 30px rgba(0,0,0,.2)" }}>
        begin
      </Link>
    </div>
  );
}
