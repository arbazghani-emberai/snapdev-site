"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ProjectsProvider from "./ProjectsProvider";
import SessionProvider, { useSession } from "./SessionProvider";
import PlanProvider from "./PlanProvider";
import ChatSession from "./ChatSession";
import { ENGINEERS } from "@/data/engineers";

function GuestSessionStarter() {
  const searchParams = useSearchParams();
  const { startSession } = useSession();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const engineerName = searchParams.get("engineer");
    const detail = searchParams.get("detail") ?? "";
    const engineer =
      ENGINEERS.find((e) => e.name === engineerName) ??
      ENGINEERS.find((e) => e.status === "Online") ??
      ENGINEERS[0];
    startSession(engineer, undefined, detail, { pending: true });
    // Runs once on mount to kick off the guest session from the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Always mount ChatSession (it already returns null with no session) so
  // its own "new session" reset logic - e.g. defaulting the side panel
  // closed on phones - runs on the transition into a real session, the same
  // way it does for the always-mounted /app flow.
  return <ChatSession guest />;
}

export default function GuestChatPage() {
  return (
    <PlanProvider>
      <ProjectsProvider>
        <SessionProvider>
          <GuestSessionStarter />
        </SessionProvider>
      </ProjectsProvider>
    </PlanProvider>
  );
}
