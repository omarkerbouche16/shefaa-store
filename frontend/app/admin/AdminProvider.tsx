"use client";

import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import type { ReactNode } from "react";

export default function AdminProvider({ children }: { children: ReactNode }) {
  return (
    <AppProvider i18n={enTranslations}>
      <div style={{ minHeight: "100vh", background: "#f6f6f7" }}>
        {children}
      </div>
    </AppProvider>
  );
}
