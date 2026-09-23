/** Monochrome marks for the "what did you build with" onboarding step.
 *  Simplified, single-color renderings (not the brands' official color
 *  palettes) so they read consistently at chip size - same approach as
 *  GithubLogo.tsx. */

type LogoProps = { className?: string };

export function ReplitLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function LovableLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 20.3 3.6 12c-2.1-2.1-2.1-5.5 0-7.6s5.5-2.1 7.6 0L12 5.2l.8-.8c2.1-2.1 5.5-2.1 7.6 0s2.1 5.5 0 7.6L12 20.3Z" />
    </svg>
  );
}

export function BoltLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.2 2 4.5 13.4h5.2L9.4 22l9.9-12.6h-5.8L13.2 2Z" />
    </svg>
  );
}

export function V0Logo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 4h4.2l5.8 8.4L17.8 4H22L13.6 16v4h-3.2v-4L2 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CursorLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" />
      <path d="M12 2v20M3 7l9 5 9-5" />
    </svg>
  );
}

export function ClaudeLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x="11.15"
          y="2"
          width="1.7"
          height="7.5"
          rx="0.85"
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
    </svg>
  );
}

export function WindsurfLogo({ className = "size-4" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3v13" />
      <path d="M12 4 5 15h14L12 4Z" />
      <path d="M4 20c2.5 1.3 5 1.3 8 0s5.5-1.3 8 0" />
    </svg>
  );
}
