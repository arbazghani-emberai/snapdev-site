import { ENGINEERS } from "./engineers";

function eng(name: string) {
  return ENGINEERS.find((e) => e.name === name)!;
}

export type UpcomingSession = {
  id: string;
  topic: string;
  engineer: (typeof ENGINEERS)[number];
  duration: string;
  day: string;
  date: string;
  time: string;
};

export const NEXT_SESSION: UpcomingSession = {
  id: "next",
  topic: "API design review",
  engineer: eng("Khalil"),
  duration: "60 min",
  day: "WED",
  date: "SEP 2",
  time: "1:35 AM",
};

export const UPCOMING_SESSIONS: UpcomingSession[] = [
  NEXT_SESSION,
  { id: "s2", topic: "Postgres query tuning", engineer: eng("Wajahat A."), duration: "45 min", day: "THU", date: "SEP 3", time: "3:35 AM" },
  { id: "s3", topic: "Deploy pipeline audit", engineer: eng("Abbas R."), duration: "90 min", day: "SAT", date: "SEP 5", time: "1:35 AM" },
  { id: "s4", topic: "React perf sweep", engineer: eng("Abrar A."), duration: "60 min", day: "MON", date: "SEP 7", time: "1:35 AM" },
];

export type SessionTranscriptMessage = { role: "you" | "engineer"; text: string };
export type SessionDiff = { file: string; stat: string };

export type LoggedSession = {
  id: string;
  topic: string;
  engineer: (typeof ENGINEERS)[number];
  date: string;
  duration: string;
  rating: number;
  notes: number;
  diffs: number;
  testimonial: string;
  transcript: SessionTranscriptMessage[];
  noteTexts: string[];
  diffFiles: SessionDiff[];
  artifacts: string[];
};

export const SESSION_LOG: LoggedSession[] = [
  {
    id: "l1",
    topic: "TanStack Query patterns",
    engineer: eng("Ahmed S."),
    date: "SEP 1",
    duration: "58 min",
    rating: 5,
    notes: 4,
    diffs: 2,
    testimonial: "Super clear, exactly what I needed.",
    transcript: [
      { role: "you", text: "My list keeps refetching on every keystroke, even with the search debounced." },
      { role: "engineer", text: "That's usually the query key changing on each render. Can you share the hook?" },
      { role: "you", text: "Sure, one sec." },
      { role: "engineer", text: "Yep, the filters object is a new reference every render. Memoize it and the key stabilizes." },
      { role: "you", text: "That fixed it, thank you!" },
    ],
    noteTexts: [
      "Root cause identified within first 5 minutes.",
      "Two follow-up tickets filed for TanStack Query patterns.",
      "Config snippet saved to project workspace.",
      "Recommended staleTime bump for the search endpoint.",
    ],
    diffFiles: [
      { file: "src/hooks/useSearchResults.ts", stat: "+9 −3 · applied" },
      { file: "src/lib/queryKeys.ts", stat: "+4 −0 · applied" },
    ],
    artifacts: ["config.md", "transcript.txt"],
  },
  {
    id: "l2",
    topic: "Auth flow rewrite",
    engineer: eng("Ahsan M."),
    date: "AUG 30",
    duration: "82 min",
    rating: 5,
    notes: 7,
    diffs: 3,
    testimonial: "Walked me through the whole session model, not just the fix.",
    transcript: [
      { role: "you", text: "Users get logged out randomly, no errors in the console." },
      { role: "engineer", text: "Sounds like a token refresh race. Are you refreshing on every request or on a timer?" },
      { role: "you", text: "On every 401, in an interceptor." },
      { role: "engineer", text: "That's the bug, parallel requests all trigger their own refresh. Let's queue it." },
    ],
    noteTexts: [
      "Refresh-token race condition confirmed via network tab.",
      "Added a single in-flight refresh promise shared across requests.",
      "Two follow-up tickets filed for Auth flow rewrite.",
      "Session cookie httpOnly flag double-checked.",
      "Logout-on-401 edge case documented.",
      "Rate limit on refresh endpoint noted for later.",
      "Client now retries the original request after refresh resolves.",
    ],
    diffFiles: [
      { file: "src/lib/authClient.ts", stat: "+38 −11 · applied" },
      { file: "src/lib/httpInterceptor.ts", stat: "+14 −6 · applied" },
      { file: "src/hooks/useSession.ts", stat: "+5 −2 · applied" },
    ],
    artifacts: ["config.md", "transcript.txt", "recording.mp4"],
  },
  {
    id: "l3",
    topic: "Migrating to Vite",
    engineer: eng("Ali A."),
    date: "AUG 27",
    duration: "44 min",
    rating: 4,
    notes: 2,
    diffs: 1,
    testimonial: "Fast, no-nonsense, got the build green again.",
    transcript: [
      { role: "you", text: "Vite migration is mostly done but env vars aren't loading in the client." },
      { role: "engineer", text: "CRA prefixes those with REACT_APP_, Vite wants VITE_. Let's rename them." },
      { role: "you", text: "That was it, build's green now." },
    ],
    noteTexts: ["Renamed env vars to the VITE_ prefix.", "Config snippet saved to project workspace."],
    diffFiles: [{ file: "vite.config.ts", stat: "+12 −4 · applied" }],
    artifacts: ["config.md"],
  },
  {
    id: "l4",
    topic: "Rate limiter design",
    engineer: eng("Ali R."),
    date: "AUG 23",
    duration: "61 min",
    rating: 5,
    notes: 5,
    diffs: 4,
    testimonial: "Great trade-off discussion, not just an implementation.",
    transcript: [
      { role: "you", text: "Need a rate limiter for our public API, thinking fixed window, is that enough?" },
      { role: "engineer", text: "Fixed window is simple but bursts at the boundary. Sliding window log is more accurate if you can afford Redis." },
      { role: "you", text: "We already have Redis, let's do that." },
      { role: "engineer", text: "I'll sketch the key layout and the Lua script for atomicity." },
    ],
    noteTexts: [
      "Chose sliding-window-log over fixed window for burst accuracy.",
      "Redis key layout sketched per API key + route.",
      "Lua script drafted for atomic increment + expire.",
      "Two follow-up tickets filed for Rate limiter design.",
      "Load-tested at 500 req/s locally.",
    ],
    diffFiles: [
      { file: "src/server/rateLimiter.ts", stat: "+61 −0 · applied" },
      { file: "src/server/redis/rateLimit.lua", stat: "+22 −0 · applied" },
      { file: "src/server/middleware.ts", stat: "+9 −2 · applied" },
      { file: "src/server/config.ts", stat: "+3 −0 · applied" },
    ],
    artifacts: ["config.md", "transcript.txt"],
  },
  {
    id: "l5",
    topic: "CI slowness triage",
    engineer: eng("Khalil"),
    date: "AUG 19",
    duration: "38 min",
    rating: 4,
    notes: 3,
    diffs: 1,
    testimonial: "Cut our CI time in half, straight to the point.",
    transcript: [
      { role: "you", text: "CI went from 6 minutes to 18 over the last month, not sure which step." },
      { role: "engineer", text: "Let's check the job timings, my guess is the test suite isn't caching node_modules." },
      { role: "you", text: "You're right, cache key wasn't including the lockfile hash." },
    ],
    noteTexts: [
      "Cache key now includes the lockfile hash.",
      "Test suite parallelized across 4 shards.",
      "Config snippet saved to project workspace.",
    ],
    diffFiles: [{ file: ".github/workflows/ci.yml", stat: "+17 −5 · applied" }],
    artifacts: ["config.md", "recording.mp4"],
  },
];

export const SESSION_STATS = {
  sessions: 9,
  hoursPaired: 4.7,
  streakWeeks: 6,
  topPartner: "Khalil",
};
