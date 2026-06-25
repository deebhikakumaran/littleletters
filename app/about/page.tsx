"use client";
import React from "react";
import Link from "next/link";
import { THEMES, FONTS } from "@/lib/letter";
import { Styles } from "@/components/ui";

// the about page — same blush warmth as the landing, Fraunces display + Nunito body.
// responsive by clamp() so it reads well on phone, tablet, and desktop without breakpoints.
export default function AboutPage() {
  const pal = THEMES.blush;
  const ink = pal.ink;
  const soft = pal.soft;
  const accent = pal.accent;

  const Section = ({ kicker, title, children }:
    { kicker: string; title: string; children: React.ReactNode }) => (
    <section style={{ marginTop: "clamp(36px, 6vw, 56px)" }}>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 12,
        letterSpacing: ".22em", textTransform: "uppercase", color: accent, marginBottom: 10 }}>
        {kicker}
      </div>
      <h2 style={{ fontFamily: FONTS.display, fontWeight: 500,
        fontSize: "clamp(1.5rem, 4.5vw, 2rem)", lineHeight: 1.15, margin: "0 0 16px", color: ink }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>{children}</div>
    </section>
  );

  const P = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <p style={{ margin: 0, fontFamily: FONTS.serif, fontSize: "clamp(1.02rem, 2.6vw, 1.15rem)",
      lineHeight: 1.7, color: ink, ...style }}>{children}</p>
  );

  return (
    <div style={{ minHeight: "100vh", background: pal.paper, color: ink }}>
      <Styles />

      {/* top bar with a quiet back link */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(20px, 4vw, 32px) clamp(22px, 5vw, 40px) 0",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 14,
          letterSpacing: ".06em", color: soft, textDecoration: "none" }}>← little letters</Link>
        <Link href="/editor" style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 14,
          textTransform: "lowercase", background: "#2e2a26", color: "#fbf7f2", textDecoration: "none",
          padding: "10px 22px", borderRadius: 999 }}>write one</Link>
      </div>

      {/* reading column */}
      <main style={{ maxWidth: 720, margin: "0 auto",
        padding: "clamp(28px, 6vw, 56px) clamp(22px, 5vw, 40px) clamp(80px, 12vw, 120px)" }}>

        {/* hero */}
        <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 12,
          letterSpacing: ".24em", textTransform: "uppercase", color: accent, marginBottom: 14 }}>
          about little letters
        </div>
        <h1 style={{ fontFamily: FONTS.display, fontWeight: 500,
          fontSize: "clamp(2.2rem, 8vw, 3.4rem)", lineHeight: 1.08, letterSpacing: "-.01em",
          margin: "0 0 8px", color: ink }}>
          why this exists
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "1em", marginTop: 22 }}>
          <P>i used to journal. write letters to myself. never sent anyone anything — a little selfish, yeah. but i wanted to. i'd draft half a letter to a friend, get caught up in making it perfect, wonder about their address, and never follow through. too much friction. too lazy.</P>
          <P>so i built this to remove the friction.</P>
          <P>now it's just five minutes. write something that matters. pick how it looks. copy a link. send it. boom. they see it. i get to surprise someone. and i get to feel like i made something i actually use.</P>
        </div>

        <Section kicker="the flow" title="how it works">
          <P>you write. you design — choose the font, the vibe, the colors. we show you the preview in real-time. when you're happy, you get a link. you share it. only the person with that link sees the letter.</P>
          <P style={{ color: soft }}>that's it.</P>
        </Section>

        <Section kicker="the promise" title="about privacy">
          <P>i have no database. i don't store what you write, who you send to, or anything about it. truly.</P>
          <P><strong style={{ fontWeight: 600 }}>if you use the shareable link:</strong> the letter lives in the url itself (encoded, compressed). it's end-to-end private — i never see it. the downside: urls have limits, so very long letters won't fit. that's a trade-off for zero-storage privacy.</P>
          <P><strong style={{ fontWeight: 600 }}>if you send via email:</strong> we connect to your email, but the letter goes through your email provider. that means they could theoretically see it. i'm not hiding from them — just honest about the limits of email privacy.</P>
          <P style={{ color: soft }}>i'm not building this to scale. i'm expecting maybe 20–50 people to use this. my friends. people like me. people who care about the feeling of sending a letter.</P>
        </Section>

        <Section kicker="for you" title="who this is for">
          <P>if you're lazy like me: you can do this. five minutes. write something true. pick a look you like. send it. watch them smile. that's the whole thing.</P>
        </Section>

        {/* closing line, set apart */}
        <div style={{ marginTop: "clamp(40px, 7vw, 64px)",
           }}>
          <p style={{ margin: 0, fontFamily: FONTS.display, fontStyle: "italic", fontWeight: 300,
             lineHeight: 1.4, color: ink }}>
            i built this for me. i hope you use it too.
          </p>
          <Link href="/editor" style={{ display: "inline-block", marginTop: "clamp(28px, 5vw, 36px)",
            fontFamily: FONTS.sans, fontWeight: 700, fontSize: 17, textTransform: "lowercase",
            background: "#2e2a26", color: "#fbf7f2", textDecoration: "none",
            padding: "15px 40px", borderRadius: 999, boxShadow: "0 12px 30px rgba(0,0,0,.18)" }}>
            write your first letter ✿
          </Link>
        </div>
      </main>
    </div>
  );
}