# Maaz Tajammul — Developer Workspace

An IDE-inspired personal portfolio. Vite builds the static workspace, Tailwind CSS,
and a lazy-loaded React + Motion request-lifecycle lab. No PHP server is required.

## Development and production preview

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Use the HTTP URL printed by Vite. ES modules and lazy chunks require a server;
opening index.html through file:// is no longer supported. Vercel runs npm run build
and serves dist/ as configured in vercel.json. Generated files in dist/ are ignored.
Imported project images and the shared logo/favicon receive content-hashed URLs.
Project screenshots use optimized WebP exports (about 82% less total image data);
the original PNG screenshots remain in assets/images/.

## Workspace

- Collapsible workspace folder with keyboard support and a saved collapse state.
- React, Inertia, Laravel, and Tailwind icons with official documentation links in the sidebar.
- Hash-based file navigation, readable section labels, browser history, and remembered scroll positions.
- Independent content and explorer scrolling; app chrome never covers page content.
- Mobile explorer with a backdrop, focus containment, Escape dismissal, and inert background.
- Persistent session timer and Karachi clock (not server uptime).
- Ctrl/Cmd K command palette, keyboard search, and Escape dismissal.
- Terminal: help, home, projects, about, stack, contact, whoami, theme, uptime, clear.
- Featured project presentation, filters, result counts, and project notes dialogs.
- Archived demo previews open project notes and public source instead of unavailable domains.
  Availability is curated via the live flag in src/app.js, not a runtime health check.
- Contact validation prepares an email draft; nothing is sent or stored by the site.
- One-click email copying with accessible success/failure feedback.
- Dark/light themes and mobile explorer navigation.

## Request-lifecycle lab

The architecture.php workspace tab loads a React island on demand. The diagram
shows two endpoints (browser and Laravel server), outgoing requests, server routing,
a database query, response packaging, and the return trip into React.

Captions sit above the diagram and playback controls stay available while scrolling.
Compare an initial HTML visit with a later Inertia JSON visit. Play/pause, previous
and next step, direct timeline selection, replay, reset, and speed controls work
without replacing the portfolio shell. Playback pauses when navigating away or
hiding the browser tab. Reduced-motion preferences disable traveling animations.
Tailwind is shown as browser-side presentation, not a network step. Persistent
layout state is explicitly an example of a configured Inertia persistent layout.

All HTTP messages, data, and timings in the lab are illustrative. The site uses
React for this demo but does not run Laravel or issue real Inertia requests.

## Source

- index.html — workspace shell and content.
- src/app.js — portfolio navigation and interactions.
- src/main.js — lazy demo loading and route visibility.
- src/architecture.jsx — React lifecycle state machine and Motion animation.
- src/input.css — design system, responsive layouts, and animation styles.
- src/workspace.css — app-shell layout and final content/interaction refinements.
- vite.config.mjs — React and Tailwind build integrations.
- assets/brand/ — ChatGPT-generated MT logo, optimized UI/favicon exports, and generation prompt.

## Animation and protocol references

The implementation follows the official documentation:

- [Inertia protocol](https://inertiajs.com/the-protocol): initial HTML versus later
  X-Inertia requests and JSON page objects.
- [Inertia internals](https://inertiajs.com/how-it-works): intercepting links,
  resolving page components, and updating browser history.
- [Motion React animation](https://motion.dev/docs/react-animation): declarative
  state transitions and AnimatePresence for changing page content.
- [Motion accessibility](https://motion.dev/docs/react-accessibility): reduced
  motion without removing the educational content.
- [Motion layout animation](https://motion.dev/docs/react-layout-animations):
  shared timeline indicator using transform-based layout animation.
- [Vite static deployment](https://vite.dev/guide/static-deploy): production build
  and preview, with static hosting on Vercel.
