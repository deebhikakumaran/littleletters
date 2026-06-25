import React from "react";
export const metadata = { title: "little letters", description: "a quiet place to write letters" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body style={{ margin: 0 }}>{children}</body></html>);
}
