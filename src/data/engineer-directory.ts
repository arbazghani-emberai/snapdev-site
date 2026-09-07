import { ENGINEERS } from "./engineers";

export type Category = "Full-stack" | "AI / ML" | "Frontend" | "Backend / infra";

export type DirectoryEngineer = {
  name: string;
  role: string;
  status: "Online" | "Away";
  skills: string[];
  img: string | null;
  hue: number;
  category: Category;
  bio: string;
  rating: number | null;
  reviews: number;
  sessions: number;
};

/**
 * Layers directory-only fields (bio, rating, category) onto the shared
 * ENGINEERS roster so name/role/skills/status/avatar stay single-sourced.
 */
const DETAILS: Record<string, { category: Category; bio: string; rating: number | null; reviews: number; sessions: number }> = {
  "Khalil": { category: "Full-stack", bio: "Ship the whole loop - frontend, API, and the database in between - without the seams showing.", rating: 4.9, reviews: 14, sessions: 96 },
  "Wajahat A.": { category: "Full-stack", bio: "I turn a rough idea into a working product loop: auth, data, and the AI feature that ties it together.", rating: 4.8, reviews: 9, sessions: 61 },
  "Abbas R.": { category: "Full-stack", bio: "Comfortable across the stack and across languages - I go wherever the bug actually is.", rating: 4.7, reviews: 6, sessions: 38 },
  "Abrar A.": { category: "AI / ML", bio: "I help builders wire LLMs into real products - prompts, tool calls, and the plumbing around them.", rating: 4.8, reviews: 8, sessions: 44 },
  "Ahmed S.": { category: "AI / ML", bio: "RAG pipelines and Docker deploys - I get your AI feature from notebook to production.", rating: null, reviews: 0, sessions: 12 },
  "Ahsan M.": { category: "Full-stack", bio: "Django or FastAPI on the backend, React up front - I fill in whichever half you're missing.", rating: 4.6, reviews: 5, sessions: 27 },
  "Ali A.": { category: "AI / ML", bio: "Make your AI features actually reliable - I turn flaky prompts and demos into things you can trust.", rating: null, reviews: 0, sessions: 13 },
  "Ali R.": { category: "Frontend", bio: "Cross-platform mobile without the pain - offline sync, native modules, and App Store review.", rating: 4.9, reviews: 7, sessions: 52 },
  "Anas S.": { category: "Frontend", bio: "Mobile and web from one codebase - I help you ship both without maintaining two products.", rating: 4.7, reviews: 4, sessions: 22 },
  "Hassan R.": { category: "AI / ML", bio: "Fine-tuning, RAG, and the AWS plumbing underneath - I make deep learning projects actually deployable.", rating: 4.8, reviews: 6, sessions: 33 },
  "Ibrahim": { category: "AI / ML", bio: "Vector databases and RAG evals - I help teams stop shipping AI features on vibes.", rating: 4.9, reviews: 5, sessions: 29 },
  "Maaz A.": { category: "Full-stack", bio: "PHP, React, or FastAPI - whatever your stack is, I've probably already debugged it.", rating: 4.6, reviews: 3, sessions: 19 },
  "moin": { category: "Full-stack", bio: "Next.js and Supabase, prototype to paying customers - the whole founder-engineer loop.", rating: 4.8, reviews: 6, sessions: 31 },
  "Muhammad A.": { category: "AI / ML", bio: "AI-native web apps - I help you ship the feature the AI tools keep almost finishing.", rating: null, reviews: 0, sessions: 8 },
  "Muhammad A. (2)": { category: "AI / ML", bio: "Wiring AI into existing products without a rewrite - integrations that don't break the rest of the app.", rating: 4.7, reviews: 4, sessions: 24 },
  "Shahid H.": { category: "Full-stack", bio: "AWS and Supabase together - I keep the infra boring so you can keep shipping features.", rating: 4.8, reviews: 5, sessions: 28 },
  "Sheikh S.": { category: "Full-stack", bio: "Full-stack generalist - React up front, Node or FastAPI underneath, whatever gets you unstuck.", rating: 4.6, reviews: 3, sessions: 17 },
  "Shiwani T.": { category: "AI / ML", bio: "LangChain and vector search - I help teams go from demo to something that holds up in production.", rating: 4.9, reviews: 6, sessions: 35 },
  "Usama E.": { category: "Backend / infra", bio: "Kubernetes and AWS for AI workloads - infra that doesn't fall over the day it gets real traffic.", rating: 4.7, reviews: 5, sessions: 26 },
  "Usman B.": { category: "Full-stack", bio: "End-to-end delivery - I take a feature from spec to deployed without handing it off mid-way.", rating: 4.6, reviews: 4, sessions: 21 },
  "Usman K.": { category: "AI / ML", bio: "FastAPI and Postgres behind your AI features, with Docker so it deploys the same everywhere.", rating: 4.8, reviews: 5, sessions: 30 },
  "Waleed A.": { category: "Full-stack", bio: "AI-driven full-stack work - I connect OpenAI or Anthropic APIs to a product that's actually usable.", rating: 4.7, reviews: 4, sessions: 23 },
  "Zain A.": { category: "AI / ML", bio: "RAG systems on Redis and AWS - I help you keep retrieval fast once it's not just a demo anymore.", rating: 4.8, reviews: 5, sessions: 27 },
  "Zohaib A.": { category: "AI / ML", bio: "Generative AI features end to end - LangChain, vector search, and the fine-tuning in between.", rating: 4.9, reviews: 7, sessions: 41 },
};

export const CATEGORIES: Category[] = ["Full-stack", "AI / ML", "Frontend", "Backend / infra"];

export const ENGINEER_DIRECTORY: DirectoryEngineer[] = ENGINEERS.map((e, i) => {
  // Two engineers share the name "Muhammad A." - key the second one distinctly.
  const key = e.name === "Muhammad A." && i > 0 && ENGINEERS.slice(0, i).some((p) => p.name === e.name)
    ? "Muhammad A. (2)"
    : e.name;
  const details = DETAILS[key];
  return { ...e, ...details };
});
