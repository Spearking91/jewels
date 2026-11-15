"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin dashboard visits
    if (pathname?.startsWith("/admin")) return;

    // Get or create an anonymous session ID in sessionStorage
    let sessionId = sessionStorage.getItem("site_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("site_session_id", sessionId);
    }

    // 1. Log page view on navigation
    const logEvent = async (eventType: "pageview" | "heartbeat") => {
      await supabase.from("site_analytics").insert({
        session_id: sessionId,
        event_type: eventType,
        path: pathname,
      });
    };

    logEvent("pageview");

    // 2. Send a heartbeat every 60 seconds to track "Currently Online"
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        logEvent("heartbeat");
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
