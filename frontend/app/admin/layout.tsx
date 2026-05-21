import "@shopify/polaris/build/esm/styles.css";
import type { ReactNode } from "react";
import AdminProvider from "./AdminProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
