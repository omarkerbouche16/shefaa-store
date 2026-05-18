"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getSessionId } from "@/lib/session";
import { getStoredUTM } from "@/lib/utm";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Skip admin pages
    if (pathname.startsWith("/admin")) return;
    // Deduplicate within the same JS session
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const utm = getStoredUTM();
    const productSlug =
      pathname.startsWith("/products/")
        ? pathname.replace("/products/", "").split("?")[0]
        : undefined;

    const payload = {
      session_id: getSessionId(),
      page_url: window.location.href,
      product_slug: productSlug ?? null,
      utm: utm ?? {},
      referrer: document.referrer || null,
    };

    // Fire-and-forget; don't block navigation
    fetch(`${API_BASE}/api/page-views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
