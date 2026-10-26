# Maaz Tajammul — Developer Workspace

A personal portfolio built as an interactive IDE-inspired workspace. Static HTML,
Tailwind CSS 4, and dependency-free JavaScript; deployable to Vercel without a backend.

## Develop

```sh
npm install
npm run build
npm run watch
```

Open `index.html` directly or serve the repository with a static web server.
The checked-in `src/output.css` is generated from `src/input.css`.

## Workspace features

- Hash-based file navigation with browser back/forward support.
- Persistent session timer and Karachi clock; neither is a server uptime metric.
- Ctrl/Cmd K command palette with search and keyboard selection.
- Terminal: `help`, `home`, `projects`, `about`, `stack`, `contact`, `whoami`,
  `theme`, `uptime`, and `clear`, plus command history via arrow keys.
- Project filters and project notes dialogs.
- RILT request lifecycle simulation with reset and reduced-motion support.
- Contact validation that prepares a mailto draft. No message is sent or stored by the site.
- Dark/light themes with local persistence and an accessible mobile explorer.
- Shared SVG monogram for the header and favicon.

## Files

- `index.html`: workspace shell and page content.
- `src/app.js`: interactions, routing, and project data.
- `src/input.css`: design tokens, layout, and responsive styles.
- `assets/icons/monogram.svg`: shared logo and favicon.

## Architecture boundary

The RILT diagram is an explanatory model. This portfolio does not run React,
Inertia, or Laravel. Tailwind compiles the CSS. Client-side navigation preserves
state in this document; it does not issue Inertia visits or backend requests.
A real RILT migration would require Laravel hosting and server-side routes.
