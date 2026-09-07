/**
 * Vuesax "linear" icon set, inlined as React components (source ships raw
 * SVG files only, no React build) - https://www.npmjs.com/package/vuesax-icons
 *
 * Names match the lucide-react icons they replace 1:1 so call sites only
 * need their import source swapped. A few names (Bug, Compass, Hammer,
 * Rocket, Package) map to the closest semantic equivalent in the set, since
 * Vuesax has no literal bug/compass/hammer/rocket glyphs.
 */

import type { ReactElement } from "react";

export type IconProps = {
  className?: string;
  strokeWidth?: number;
};

export type IconComponent = (props: IconProps) => ReactElement;

function outline(paths: string[]) {
  return function VxIcon({ className, strokeWidth = 2 }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  };
}

export const Plus = outline(["M6 12h12M12 18V6"]);
export const Users = outline([
  "M9.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C4.56 3.99 6.54 2 9 2a4.435 4.435 0 0 1 .16 8.87M16.41 4c1.94 0 3.5 1.57 3.5 3.5 0 1.89-1.5 3.43-3.37 3.5a1 1 0 0 0-.26 0M4.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0M18.34 20c.72-.15 1.4-.44 1.96-.87 1.56-1.17 1.56-3.1 0-4.27-.55-.42-1.22-.7-1.93-.86",
]);
export const ArrowRight = outline(["M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83"]);
export const ArrowLeft = outline(["M9.57 5.93 3.5 12l6.07 6.07M20.5 12H3.67"]);
export const FolderGit2 = outline([
  "M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5Z",
  "M8 2h9q3 0 3 3v1.38",
]);
export const Search = outline([
  "M11 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18M18.93 20.69c.53 1.6 1.74 1.76 2.67.36.85-1.28.29-2.33-1.25-2.33-1.14-.01-1.78.88-1.42 1.97",
]);
export const MessageSquareText = outline([
  "M16 2H8Q2 2 2 8v13c0 .55.45 1 1 1h13q6 0 6-6V8q0-6-6-6",
  "M7 9.5h10M7 14.5h7",
]);
export const MessageSquare = outline([
  "M8.5 19H8c-4 0-6-1-6-6V8q0-6 6-6h8q6 0 6 6v5q0 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.53-.4-.8-.4",
  "M15.997 11h.008M11.996 11h.008M7.995 11h.008",
]);
export const MessageCircle = outline([
  "M17.25 10.18v2.63c0 .17-.01.33-.03.49-.15 1.77-1.2 2.65-3.12 2.65h-.26a.54.54 0 0 0-.42.21l-.79 1.05c-.35.47-.91.47-1.26 0l-.79-1.05a.63.63 0 0 0-.42-.21H9.9c-2.1 0-3.15-.52-3.15-3.15v-2.63c0-1.92.89-2.97 2.65-3.12.16-.02.32-.03.49-.03h4.2c2.11.02 3.16 1.07 3.16 3.16",
  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10",
]);
export const CreditCard = outline([
  "M2 8.505h20M6 16.505h2M10.5 16.505h4",
  "M6.44 3.505h11.11c3.56 0 4.45.88 4.45 4.39v8.21c0 3.51-.89 4.39-4.44 4.39H6.44c-3.55.01-4.44-.87-4.44-4.38v-8.22c0-3.51.89-4.39 4.44-4.39",
]);
export const ShieldCheck = outline([
  "M10.49 2.23 5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0",
  "m9.05 11.87 1.61 1.61 4.3-4.3",
]);
export const Check = outline(["m7.75 12 2.83 2.83 5.67-5.66"]);
export const Minus = outline(["M6 12h12"]);
export const House = outline([
  "M12 18v-3M10.07 2.82 3.14 8.37c-.78.62-1.28 1.93-1.11 2.91l1.33 7.96c.24 1.42 1.6 2.57 3.04 2.57h11.2c1.43 0 2.8-1.16 3.04-2.57l1.33-7.96c.16-.98-.34-2.29-1.11-2.91l-6.93-5.54c-1.07-.86-2.8-.86-3.86-.01",
]);
export const Calendar = outline([
  "M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5",
  "M15.695 13.7h.009M15.695 16.7h.009M11.996 13.7h.008M11.996 16.7h.008M8.294 13.7h.01M8.294 16.7h.01",
]);
export const Settings = outline([
  "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  "M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9",
]);
export const LogOut = outline([
  "M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99M15 12H3.62M5.85 8.65 2.5 12l3.35 3.35",
]);
export const Bug = outline([
  "M12 9v5M12 21.41H5.94c-3.47 0-4.92-2.48-3.24-5.51l3.12-5.62L8.76 5c1.78-3.21 4.7-3.21 6.48 0l2.94 5.29 3.12 5.62c1.68 3.03.22 5.51-3.24 5.51H12z",
  "M11.995 17h.009",
]);
export const Compass = outline([
  "M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z",
  "M13.5 8C10.47 8 8 10.48 8 13.5c0 1.37 1.12 2.5 2.5 2.5 3.02 0 5.5-2.48 5.5-5.5C16 9.13 14.87 8 13.5 8",
]);
export const Hammer = outline([
  "M9 13c-.66.33-1.21.82-1.62 1.43-.23.35-.23.79 0 1.14.41.61.96 1.1 1.62 1.43M15.21 13c.66.33 1.21.82 1.62 1.43.23.35.23.79 0 1.14-.41.61-.96 1.1-1.62 1.43",
  "M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7M2.23 8.01 21.45 8",
]);
export const Rocket = outline([
  "m7.4 6.32 8.49-2.83c3.81-1.27 5.88.81 4.62 4.62l-2.83 8.49c-1.9 5.71-5.02 5.71-6.92 0l-.84-2.52-2.52-.84c-5.71-1.9-5.71-5.01 0-6.92M10.11 13.65l3.58-3.59",
]);
export const Sparkles = outline([
  "M3.5 20.5c.83.83 2.17.83 3 0l13-13c.83-.83.83-2.17 0-3s-2.17-.83-3 0l-13 13c-.83.83-.83 2.17 0 3M18.01 8.99l-3-3",
  "M8.5 2.44 10 2l-.44 1.5L10 5l-1.5-.44L7 5l.44-1.5L7 2zM4.5 8.44 6 8l-.44 1.5L6 11l-1.5-.44L3 11l.44-1.5L3 8zM19.5 13.44 21 13l-.44 1.5L21 16l-1.5-.44L18 16l.44-1.5L18 13z",
]);
export const Link2 = outline([
  "M3.27 12A5.46 5.46 0 0 1 2 8.5C2 5.48 4.47 3 7.5 3h5C15.52 3 18 5.48 18 8.5S15.53 14 12.5 14H10",
  "M20.73 12A5.46 5.46 0 0 1 22 15.5c0 3.02-2.47 5.5-5.5 5.5h-5C8.48 21 6 18.52 6 15.5S8.47 10 11.5 10H14",
]);
export const Globe = outline([
  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10",
  "M8 3h1a28.42 28.42 0 0 0 0 18H8M15 3a28.42 28.42 0 0 1 0 18",
  "M3 16v-1a28.42 28.42 0 0 0 18 0v1M3 9a28.42 28.42 0 0 1 18 0",
]);
export const Package = outline([
  "M3.17 7.44 12 12.55l8.77-5.08M12 21.61v-9.07",
  "M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0",
  "M17 13.24V9.58L7.51 4.1",
]);
export const X = outline(["M9.17 14.83l5.66-5.66M14.83 14.83 9.17 9.17"]);
export const ChevronDown = outline(["m6 9 6 6 6-6"]);
export const Lock = outline([
  "M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2M17 22H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5",
  "M15.997 16h.008M11.996 16h.008M7.995 16h.008",
]);
export const ArrowUp = outline([
  "M12 18H9.33c-3.31 0-4.67-2.35-3.01-5.22l1.34-2.31L9 8.16c1.66-2.87 4.37-2.87 6.03 0l1.34 2.31 1.34 2.31c1.66 2.87.3 5.22-3.01 5.22z",
]);
export const MoreHorizontal = outline([
  "M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM19 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z",
]);
export const Clock = outline([
  "M12 9.66v2.79l1.4 1.4",
  "M5.5 12a6.5 6.5 0 1 1 13 0c0 2.08-.98 3.94-2.5 5.13h-.01c-1.1.86-2.48 1.37-3.99 1.37-1.49 0-2.86-.5-3.96-1.35h-.01A6.49 6.49 0 0 1 5.5 12",
  "M8.03 17.15h.01c1.1.85 2.47 1.35 3.96 1.35 1.51 0 2.89-.51 3.99-1.37H16l-.51 2.47C15 21.5 13.9 22 12.55 22h-1.09c-1.35 0-2.46-.5-2.94-2.41zM8.03 6.85h.01C9.14 6 10.51 5.5 12 5.5c1.51 0 2.89.51 3.99 1.37H16l-.51-2.47C15 2.5 13.9 2 12.55 2h-1.09C10.11 2 9 2.5 8.52 4.41z",
]);
export const FileText = outline([
  "M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5",
  "M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8",
]);
export const Download = outline([
  "M11.88 4.01V14.18M9.32 11.68l2.56 2.5 2.56-2.5",
  "M4 12c0 4.42 3 8 8 8s8-3.58 8-8",
]);
export const Paperclip = outline([
  "M11.97 12v3.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5V10c0-3.87-3.13-7-7-7s-7 3.13-7 7v6c0 3.31 2.69 6 6 6",
]);
export const Mic = outline([
  "M12 19c3.31 0 6-2.69 6-6V8c0-3.31-2.69-6-6-6S6 4.69 6 8v5c0 3.31 2.69 6 6 6",
  "M3 11v2a9 9 0 0 0 18 0v-2M9.11 7.48a8 8 0 0 1 5.5 0M10.03 10.48c1.2-.33 2.47-.33 3.67 0",
]);
export const Phone = outline([
  "M21.97 18.33c0 .36-.08.73-.25 1.09s-.39.7-.68 1.02c-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98a29 29 0 0 1-3.28-2.8 28.4 28.4 0 0 1-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41Q2 8.1 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13s.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78Z",
]);
export const Monitor = outline([
  "M6.44 2h11.11C21.11 2 22 2.89 22 6.44v6.33c0 3.56-.89 4.44-4.44 4.44H6.44C2.89 17.22 2 16.33 2 12.78V6.44C2 2.89 2.89 2 6.44 2M12 17.22V22M2 13h20M7.5 22h9",
]);
export const StickyNote = outline([
  "M8 2v3M16 2v3M7 11h8M7 15h5M15 22H9c-5 0-6-2.06-6-6.18V9.65c0-4.7 1.67-5.96 5-6.15h8c3.33.18 5 1.45 5 6.15V16",
  "m21 16-6 6v-3q0-3 3-3z",
]);
export const ImageIcon = outline([
  "m21.68 16.96-3.13-7.31c-1.06-2.48-3.01-2.58-4.32-.22l-1.89 3.41c-.96 1.73-2.75 1.88-3.99.33l-.22-.28c-1.29-1.62-3.11-1.42-4.04.43l-1.72 3.45C1.16 19.17 2.91 22 5.59 22h12.76c2.6 0 4.35-2.65 3.33-5.04M6.97 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
]);
export const Send = outline([
  "m7.4 6.32 8.49-2.83c3.81-1.27 5.88.81 4.62 4.62l-2.83 8.49c-1.9 5.71-5.02 5.71-6.92 0l-.84-2.52-2.52-.84c-5.71-1.9-5.71-5.01 0-6.92M10.11 13.65l3.58-3.59",
]);
export const XCircle = outline([
  "M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10M9.17 14.83l5.66-5.66M14.83 14.83 9.17 9.17",
]);
export const User = outline([
  "M12.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C7.56 3.99 9.54 2 12 2a4.435 4.435 0 0 1 .16 8.87M7.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0",
]);
export const Repeat = outline([
  "M3.58 5.16h13.84c1.66 0 3 1.34 3 3v3.32",
  "M6.74 2 3.58 5.16l3.16 3.16M20.42 18.84H6.58c-1.66 0-3-1.34-3-3v-3.32",
  "m17.26 22 3.16-3.16-3.16-3.16",
]);
export const Menu = outline(["M3 7h18M3 12h18M3 17h18"]);
export const Camera = outline([
  "M6.76 22h10.48c2.76 0 3.86-1.69 3.99-3.75l.52-8.26A3.753 3.753 0 0 0 18 6c-.61 0-1.17-.35-1.45-.89l-.72-1.45C15.37 2.75 14.17 2 13.15 2h-2.29c-1.03 0-2.23.75-2.69 1.66l-.72 1.45C7.17 5.65 6.61 6 6 6 3.83 6 2.11 7.83 2.25 9.99l.52 8.26C2.89 20.31 4 22 6.76 22M10.5 8h3",
  "M12 18c1.79 0 3.25-1.46 3.25-3.25S13.79 11.5 12 11.5s-3.25 1.46-3.25 3.25S10.21 18 12 18",
]);
export const AlertTriangle = outline([
  "M12 9v5M12 21.41H5.94c-3.47 0-4.92-2.48-3.24-5.51l3.12-5.62L8.76 5c1.78-3.21 4.7-3.21 6.48 0l2.94 5.29 3.12 5.62c1.68 3.03.22 5.51-3.24 5.51H12z",
  "M11.995 17h.009",
]);
export const Code = outline([
  "M9 13c-.66.33-1.21.82-1.62 1.43-.23.35-.23.79 0 1.14.41.61.96 1.1 1.62 1.43M15.21 13c.66.33 1.21.82 1.62 1.43.23.35.23.79 0 1.14-.41.61-.96 1.1-1.62 1.43",
  "M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7M2.23 8.01 21.45 8",
]);

/** Sidebar-toggle glyph - a bordered panel with a divider, not expressible as a single closed path. */
export function PanelLeft({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

/** Filter/sort glyph - lines with handle ticks, not a single closed path. */
export function SlidersHorizontal({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="21" y1="4" x2="14" y2="4" />
      <line x1="10" y1="4" x2="3" y2="4" />
      <line x1="21" y1="12" x2="12" y2="12" />
      <line x1="8" y1="12" x2="3" y2="12" />
      <line x1="21" y1="20" x2="16" y2="20" />
      <line x1="12" y1="20" x2="3" y2="20" />
      <line x1="14" y1="2" x2="14" y2="6" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="16" y1="18" x2="16" y2="22" />
    </svg>
  );
}

/** Filled shapes - Vuesax ships outline-only, so these are hand-drawn solids. */
export function Zap({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2 3 14h7l-1 8 11-13h-8l1-7z" />
    </svg>
  );
}

export function Star({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5 14.9 9l7.1.6-5.4 4.6L18.2 21 12 17.3 5.8 21l1.6-6.8L2 9.6 9.1 9z" />
    </svg>
  );
}

export function Crown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 17 5 6l4.5 5L12 5l2.5 6L19 6l2 11H3Z" />
      <path d="M4 19h16v2H4z" />
    </svg>
  );
}

export function Play({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 4.8c0-1.63 1.77-2.65 3.19-1.83l10.29 5.94a2.11 2.11 0 0 1 0 3.66L9.19 18.51C7.77 19.33 6 18.31 6 16.68z" />
    </svg>
  );
}

export function Sun({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="6.64" y2="6.64" />
      <line x1="17.36" y1="17.36" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="6.64" y2="17.36" />
      <line x1="17.36" y1="6.64" x2="19.07" y2="4.93" />
    </svg>
  );
}

export const Moon = outline(["M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"]);
