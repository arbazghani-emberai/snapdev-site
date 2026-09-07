# snapdev-site

A local rebuild of the **snapdev.ai** marketing homepage, reconstructed from the live
site so the design can be reworked without the production repo.

This is a standalone copy. Changes here do **not** deploy to snapdev.ai.

## Run

```bash
npm run dev
```

## What's here

The public marketing surface of snapdev.ai is a single page. `/engineers` redirects to
the homepage, and every other entry point (`Log in`, `Get started`, `Book a free session`)
opens the auth-gated app rather than a marketing route — so there is nothing else to rebuild.

| Path | What it holds |
| --- | --- |
| `src/app/globals.css` | Design tokens as a Tailwind v4 `@theme` — colors, radii, fonts |
| `src/app/layout.tsx` | Fonts (Inter Tight / JetBrains Mono), sticky header, footer |
| `src/app/page.tsx` | Section order |
| `src/components/` | One component per section |
| `src/data/engineers.ts` | The 24 engineer cards |
| `public/engineers/` | Avatars, downloaded locally so nothing depends on the live CDN |

## Design tokens

Colors and radii live only in `globals.css`. Retheming the site is mostly a matter of
editing that block — components reference tokens (`bg-ink`, `text-ink-2`, `border-line`,
`rounded-lg`) rather than raw values.

The three section washes (`wash-blue`, `wash-cream`, `wash-pink`) are what give the page
its alternating pastel bands; `--radius-lg: 28px` / `--radius-xl: 36px` drive the soft,
rounded-card look.

## Content notes

Copy, engineer names, and skill lists are transcribed from the live site. The testimonials
are the live site's own placeholder testimonials. Imagery in `public/img/` came from
Unsplash via the live page.
