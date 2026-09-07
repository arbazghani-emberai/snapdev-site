import AppHeader from "@/components/AppHeader";
import ProjectsProvider from "@/components/ProjectsProvider";
import SessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";
import PlanProvider from "@/components/PlanProvider";
import ChatSession from "@/components/ChatSession";
import SessionSummaryToast from "@/components/SessionSummaryToast";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <PlanProvider>
        <ProjectsProvider>
          <SessionProvider>
            <AppHeader />
            <main className="mx-auto w-full max-w-[1200px] px-5 pb-24 sm:px-10">{children}</main>
            <ChatSession />
            <SessionSummaryToast />
          </SessionProvider>
        </ProjectsProvider>
      </PlanProvider>
    </ThemeProvider>
  );
}
