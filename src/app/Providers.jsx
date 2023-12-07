"use client";
//imports de app
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
