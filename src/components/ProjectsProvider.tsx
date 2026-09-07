"use client";

import { createContext, useContext, useState } from "react";
import { PROJECTS, type Project } from "@/data/app";

type ProjectsContextValue = {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "active">) => Project;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

/**
 * Client-only project list, seeded from the static empty PROJECTS array.
 * Lets the connect-a-project wizard and anything that reads the project
 * list (dashboard, get-unstuck picker) share one source of truth without a
 * backend.
 */
export default function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  const addProject: ProjectsContextValue["addProject"] = (project) => {
    const created: Project = { ...project, id: crypto.randomUUID(), active: true };
    setProjects((prev) => [created, ...prev]);
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
