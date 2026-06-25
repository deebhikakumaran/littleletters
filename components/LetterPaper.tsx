"use client";
import React from "react";
import { Palette } from "@/lib/letter";

export function LetterPaper({ pal, pad, children, maxWidth = 640, fill = false }:
  { pal: Palette; pad: number; children: React.ReactNode; maxWidth?: number; fill?: boolean }) {
  return (
    <div style={{
      background: pal.paper, color: pal.ink, padding: pad, width: "100%", maxWidth,
      minHeight: fill ? 0 : "62vh", flex: fill ? 1 : undefined,
      borderRadius: 8, border: `1px solid ${pal.line}`,
      boxShadow: `0 18px 50px ${pal.ink}14`, position: "relative",
      display: "flex", flexDirection: "column", boxSizing: "border-box",
      overflow: "hidden", transition: "all .35s ease",
    }}>
      {/* coffee-ring stain */}
      <div aria-hidden style={{ position: "absolute", top: -14, right: 38, width: 78, height: 78,
        borderRadius: "50%", border: `7px solid ${pal.accent}`, opacity: .16, pointerEvents: "none" }} />
      {children}
    </div>
  );
}
