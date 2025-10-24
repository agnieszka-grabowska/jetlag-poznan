"use client";
import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "./services/fetcher";

export default function SWRConfigProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
