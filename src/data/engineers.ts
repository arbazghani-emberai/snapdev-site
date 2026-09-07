export type Engineer = {
  name: string;
  role: string;
  status: "Online" | "Away";
  skills: string[];
  /** Local avatar in /public/engineers, or null to fall back to initials. */
  img: string | null;
  /** Hue used for the initials-only placeholder tile. */
  hue: number;
};

export const ENGINEERS: Engineer[] = [
  { name: "Khalil", role: "Modern Stack Developer", status: "Online", skills: ["Python", "React", "Next.js", "Node", "Django", "FastAPI"], img: "/engineers/khalil.jpg", hue: 186 },
  { name: "Wajahat A.", role: "Web Solutions Engineer", status: "Online", skills: ["JavaScript", "TypeScript", "Python", "FastAPI", "MySQL", "GCP", "OpenAI API"], img: "/engineers/wajahat-a.jpg", hue: 9 },
  { name: "Abbas R.", role: "Full-Stack Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "Go", "Java", "Ruby", "React"], img: "/engineers/abbas-r.jpg", hue: 79 },
  { name: "Abrar A.", role: "AI Software Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "Next.js", "FastAPI", "Flutter", "LangChain"], img: "/engineers/abrar-a.jpg", hue: 7 },
  { name: "Ahmed S.", role: "Technical Solutions Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "Next.js", "FastAPI", "Docker", "RAG"], img: null, hue: 65 },
  { name: "Ahsan M.", role: "JavaScript Python Dev", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "Django", "FastAPI"], img: "/engineers/ahsan-m.jpg", hue: 63 },
  { name: "Ali A.", role: "Full-Stack AI Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node", "FastAPI", "OpenAI API"], img: "/engineers/ali-a.jpg", hue: 248 },
  { name: "Ali R.", role: "Mobile Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "FastAPI", "React Native"], img: "/engineers/ali-r.jpg", hue: 356 },
  { name: "Anas S.", role: "Mobile & Web Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "Node", "React Native"], img: "/engineers/anas-s.jpg", hue: 250 },
  { name: "Hassan R.", role: "Deep Learning Engineer", status: "Away", skills: ["Python", "AWS", "Docker", "LangChain", "Fine-tuning", "RAG"], img: "/engineers/hassan-r.jpg", hue: 69 },
  { name: "Ibrahim", role: "AI Automation Specialist", status: "Away", skills: ["OpenAI API", "Anthropic API", "LangChain", "LlamaIndex", "Vector databases", "RAG"], img: "/engineers/ibrahim.jpg", hue: 11 },
  { name: "Maaz A.", role: "Multi-Stack Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "PHP", "React", "FastAPI", "MySQL"], img: "/engineers/maaz-a.jpg", hue: 29 },
  { name: "moin", role: "AI Full Stack Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Next.js", "Tailwind", "Django", "FastAPI", "Supabase"], img: "/engineers/moin.jpg", hue: 256 },
  { name: "Muhammad A.", role: "AI Web Applications Dev", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "Next.js", "Django", "FastAPI", "Fine-tuning"], img: null, hue: 210 },
  { name: "Muhammad A.", role: "AI Integration Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "FastAPI", "Kotlin"], img: "/engineers/muhammad-a-2.jpg", hue: 55 },
  { name: "Shahid H.", role: "AI Full-Stack Dev", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "FastAPI", "AWS", "RAG", "Supabase"], img: "/engineers/shahid-h.jpg", hue: 35 },
  { name: "Sheikh S.", role: "Software Engineer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "Node", "FastAPI"], img: "/engineers/sheikh-s.jpg", hue: 236 },
  { name: "Shiwani T.", role: "AI Software Engineer", status: "Away", skills: ["Python", "LangChain", "LlamaIndex", "Vector databases", "Fine-tuning", "RAG"], img: "/engineers/shiwani-t.jpg", hue: 244 },
  { name: "Usama E.", role: "AI/ML Backend Engineer", status: "Away", skills: ["Python", "Node", "FastAPI", "AWS", "Kubernetes", "Vercel"], img: "/engineers/usama-e.jpg", hue: 254 },
  { name: "Usman B.", role: "End-to-End Developer", status: "Away", skills: ["JavaScript", "TypeScript", "Python", "React", "Django", "FastAPI", "MongoDB"], img: "/engineers/usman-b.jpg", hue: 260 },
  { name: "Usman K.", role: "AI Full-Stack Engineer", status: "Away", skills: ["Python", "FastAPI", "Postgres", "AWS", "Docker", "RAG"], img: "/engineers/usman-k.jpg", hue: 206 },
  { name: "Waleed A.", role: "AI-Driven Full-Stack Dev", status: "Away", skills: ["Python", "Java", "FastAPI", "MySQL", "OpenAI API", "Anthropic API"], img: "/engineers/waleed-a.jpg", hue: 33 },
  { name: "Zain A.", role: "AI Systems Engineer", status: "Away", skills: ["Python", "FastAPI", "Redis", "AWS", "LangChain", "RAG"], img: "/engineers/zain-a.jpg", hue: 75 },
  { name: "Zohaib A.", role: "Generative AI Developer", status: "Away", skills: ["Python", "FastAPI", "LangChain", "Vector databases", "Fine-tuning", "RAG"], img: "/engineers/zohaib-a.jpg", hue: 188 },
];
