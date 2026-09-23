"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { PROJECTS, type Project } from "@/data/app";

/** No backend to persist connected projects, so they're stashed here across
 *  reloads and tabs - same trick as the guest-session/onboarding storage. */
const PROJECTS_STORAGE_KEY = "snapdev_projects";

function readStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : PROJECTS;
  } catch {
    return PROJECTS;
  }
}

function writeStoredProjects(projects: Project[]) {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Storage can be unavailable (private mode, disabled) - the list still
    // works for the rest of this session, it just won't survive a reload.
  }
}

type ProjectsContextValue = {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "active">) => Project;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

/**
 * Client-only project list, seeded from localStorage (falling back to the
 * static empty PROJECTS array). Lets the connect-a-project wizard and
 * anything that reads the project list (dashboard, get-unstuck picker)
 * share one source of truth without a backend.
 */
export default function ProjectsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Starts from the same empty PROJECTS the server rendered (localStorage
  // isn't available there), then loads the persisted list right after mount.
  // Reading localStorage in the initializer instead would make the client's
  // first render disagree with the server-rendered HTML whenever a project
  // was already saved - a hydration mismatch that can leave the page stuck
  // showing neither state correctly (e.g. no sidebar selection at all).
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    const stored = readStoredProjects();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberately deferred past the server-rendered first paint to avoid a hydration mismatch (see comment above)
    if (stored.length > 0) setProjects(stored);
  }, []);

  const addProject: ProjectsContextValue["addProject"] = (project) => {
    const created: Project = {
      ...project,
      id: crypto.randomUUID(),
      active: true,
    };
    setProjects((prev) => {
      const next = [created, ...prev];
      writeStoredProjects(next);
      return next;
    });
    return created;
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}
