export type Engineer = {
  name: string;
  role: string;
  status: "Online" | "Away";
  skills: string[];
  /** Local avatar in /public/engineers, or null to fall back to initials. */
  img: string | null;
  /** Hue used for the initials-only placeholder tile. */
  hue: number;
  /** One-line specialty shown on the card, e.g. "expert in deployment and broken checkouts". */
  specialty?: string;
  /** Short capability pill shown next to the first skill, e.g. "fixes bugs". */
  capability?: string;
  /** Average rating out of 5, shown once the engineer has reviews. */
  cardRating?: number;
  /** Number of reviews left by founders. */
  cardReviewCount?: number;
  /** Number of completed sessions. */
  cardSessionCount?: number;
};

export const ENGINEERS: Engineer[] = [
  { name: "Khalil", role: "Modern Stack Developer", status: "Online", skills: ["Python", "React", "Next.js", "Node", "Django", "FastAPI"], img: "/engineers/khalil.jpg", hue: 186, specialty: "Expert in deployment and broken checkouts", capability: "deployment issues", cardRating: 4.9, cardReviewCount: 42, cardSessionCount: 180 },
  { name: "Wajahat A.", role: "Web Solutions Engineer", status: "Online", skills: ["JavaScript", "TypeScript", "Python", "FastAPI", "MySQL", "GCP", "OpenAI API"], img: "/engineers/wajahat-a.jpg", hue: 9, specialty: "Expert in API integrations and cloud deploys", capability: "fixing laggy websites", cardRating: 5.0, cardReviewCount: 31, cardSessionCount: 121 },
  { name: "Abbas R.", role: "Full-Stack Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "Go", "Java", "Ruby", "React"], img: "/engineers/abbas-r.jpg", hue: 79, specialty: "Expert in full-stack rewrites and migrations", capability: "fixes bugs", cardRating: 4.8, cardReviewCount: 58, cardSessionCount: 240 },
  { name: "Abrar A.", role: "AI Software Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "Next.js", "FastAPI", "Flutter", "LangChain"], img: "/engineers/abrar-a.jpg", hue: 7, specialty: "Expert in AI features and mobile apps", capability: "expert in AI hallucination", cardRating: 4.9, cardReviewCount: 24, cardSessionCount: 96 },
  { name: "Ahmed S.", role: "Technical Solutions Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "Next.js", "FastAPI", "Docker", "RAG"], img: null, hue: 65, specialty: "Expert in Docker setups and RAG pipelines", capability: "deployment issues", cardRating: 5.0, cardReviewCount: 19, cardSessionCount: 80 },
  { name: "Ahsan M.", role: "JavaScript Python Dev", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "Django", "FastAPI"], img: "/engineers/ahsan-m.jpg", hue: 63, specialty: "Expert in fixing broken builds fast", capability: "fixes bugs", cardRating: 4.7, cardReviewCount: 37, cardSessionCount: 150 },
  { name: "Ali A.", role: "Full-Stack AI Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node", "FastAPI", "OpenAI API"], img: "/engineers/ali-a.jpg", hue: 248, specialty: "Expert in AI chat and agent flows", capability: "expert in AI hallucination", cardRating: 4.9, cardReviewCount: 45, cardSessionCount: 198 },
  { name: "Ali R.", role: "Mobile Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "FastAPI", "React Native"], img: "/engineers/ali-r.jpg", hue: 356, specialty: "Expert in mobile crashes and app store fixes", capability: "fixing laggy websites", cardRating: 4.8, cardReviewCount: 22, cardSessionCount: 88 },
  { name: "Anas S.", role: "Mobile & Web Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "Node", "React Native"], img: "/engineers/anas-s.jpg", hue: 250, specialty: "Expert in cross-platform bugs and performance", capability: "fixes bugs", cardRating: 5.0, cardReviewCount: 63, cardSessionCount: 275 },
  { name: "Hassan R.", role: "Deep Learning Engineer", status: "Away", skills: ["Python", "AWS", "Docker", "LangChain", "Fine-tuning", "RAG"], img: "/engineers/hassan-r.jpg", hue: 69, specialty: "Expert in model fine-tuning and inference", capability: "expert in AI hallucination", cardRating: 4.9, cardReviewCount: 28, cardSessionCount: 112 },
  { name: "Ibrahim", role: "AI Automation Specialist", status: "Away", skills: ["OpenAI API", "Anthropic API", "LangChain", "LlamaIndex", "Vector databases", "RAG"], img: "/engineers/ibrahim.jpg", hue: 11, specialty: "Expert in AI automations and workflows", capability: "expert in AI hallucination", cardRating: 4.8, cardReviewCount: 16, cardSessionCount: 64 },
  { name: "Maaz A.", role: "Multi-Stack Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "PHP", "React", "FastAPI", "MySQL"], img: "/engineers/maaz-a.jpg", hue: 29, specialty: "Expert in legacy code and database issues", capability: "fixes bugs", cardRating: 4.9, cardReviewCount: 34, cardSessionCount: 140 },
  { name: "moin", role: "AI Full Stack Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Next.js", "Tailwind", "Django", "FastAPI", "Supabase"], img: "/engineers/moin.jpg", hue: 256, specialty: "Expert in Supabase auth and broken forms", capability: "deployment issues", cardRating: 5.0, cardReviewCount: 51, cardSessionCount: 210 },
  { name: "Muhammad A.", role: "AI Web Applications Dev", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "Next.js", "Django", "FastAPI", "Fine-tuning"], img: null, hue: 210, specialty: "Expert in AI web apps and fine-tuning", capability: "expert in AI hallucination", cardRating: 4.8, cardReviewCount: 20, cardSessionCount: 79 },
  { name: "Muhammad A.", role: "AI Integration Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "FastAPI", "Kotlin"], img: "/engineers/muhammad-a-2.jpg", hue: 55, specialty: "Expert in third-party integrations and APIs", capability: "fixes bugs", cardRating: 4.9, cardReviewCount: 29, cardSessionCount: 118 },
  { name: "Shahid H.", role: "AI Full-Stack Dev", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "FastAPI", "AWS", "RAG", "Supabase"], img: "/engineers/shahid-h.jpg", hue: 35, specialty: "Expert in AWS deploys and RAG search", capability: "deployment issues", cardRating: 4.7, cardReviewCount: 40, cardSessionCount: 165 },
  { name: "Sheikh S.", role: "Software Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "Node", "FastAPI"], img: "/engineers/sheikh-s.jpg", hue: 236, specialty: "Expert in debugging stubborn production issues", capability: "fixing laggy websites", cardRating: 4.9, cardReviewCount: 18, cardSessionCount: 70 },
  { name: "Shiwani T.", role: "AI Software Engineer", status: "Away", skills: ["Python", "LangChain", "LlamaIndex", "Vector databases", "Fine-tuning", "RAG"], img: "/engineers/shiwani-t.jpg", hue: 244, specialty: "Expert in vector search and RAG tuning", capability: "expert in AI hallucination", cardRating: 5.0, cardReviewCount: 25, cardSessionCount: 101 },
  { name: "Usama E.", role: "AI/ML Backend Engineer", status: "Away", skills: ["Python", "Node", "FastAPI", "AWS", "Kubernetes", "Vercel"], img: "/engineers/usama-e.jpg", hue: 254, specialty: "Expert in Kubernetes and backend scaling", capability: "deployment issues", cardRating: 4.8, cardReviewCount: 33, cardSessionCount: 132 },
  { name: "Usman B.", role: "End-to-End Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Django", "FastAPI", "MongoDB"], img: "/engineers/usman-b.jpg", hue: 260, specialty: "Expert in MongoDB and end-to-end fixes", capability: "fixes bugs", cardRating: 4.9, cardReviewCount: 47, cardSessionCount: 190 },
  { name: "Usman K.", role: "AI Full-Stack Engineer", status: "Away", skills: ["Python", "FastAPI", "Postgres", "AWS", "Docker", "RAG"], img: "/engineers/usman-k.jpg", hue: 206, specialty: "Expert in Postgres tuning and Docker deploys", capability: "deployment issues", cardRating: 4.8, cardReviewCount: 21, cardSessionCount: 84 },
  { name: "Waleed A.", role: "AI-Driven Full-Stack Dev", status: "Away", skills: ["Python", "Java", "FastAPI", "MySQL", "OpenAI API", "Anthropic API"], img: "/engineers/waleed-a.jpg", hue: 33, specialty: "Expert in AI-driven backend rebuilds", capability: "expert in AI hallucination", cardRating: 4.9, cardReviewCount: 36, cardSessionCount: 145 },
  { name: "Zain A.", role: "AI Systems Engineer", status: "Away", skills: ["Python", "FastAPI", "Redis", "AWS", "LangChain", "RAG"], img: "/engineers/zain-a.jpg", hue: 75, specialty: "Expert in caching and system reliability", capability: "fixing laggy websites", cardRating: 5.0, cardReviewCount: 27, cardSessionCount: 108 },
  { name: "Zohaib A.", role: "Generative AI Developer", status: "Away", skills: ["Python", "FastAPI", "LangChain", "Vector databases", "Fine-tuning", "RAG"], img: "/engineers/zohaib-a.jpg", hue: 188, specialty: "Expert in generative AI pipelines", capability: "expert in AI hallucination", cardRating: 4.8, cardReviewCount: 44, cardSessionCount: 175 },
];
