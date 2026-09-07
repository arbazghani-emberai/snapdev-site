import { Suspense } from "react";
import GuestChatPage from "@/components/GuestChatPage";

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <GuestChatPage />
    </Suspense>
  );
}
