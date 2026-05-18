"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "./lib/api";

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return null;
}
