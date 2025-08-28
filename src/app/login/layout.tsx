import React from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // Keep this minimal; RootLayout supplies background + container.
  return <div className="we-stack">{children}</div>;
}
