# Maaz Tajammul — Portfolio Website

This repository contains the personal portfolio website of **Maaz Tajammul**, a Full Stack Laravel Developer.  
The site is implemented as a single-page experience in `index.html`.

## Portfolio Sections

- Home / Hero
- About
- Skills
- Projects
- Experience
- Education
- Contact

## Tech Stack

- HTML (single-page structure)
- Tailwind CSS (compiled from `src/input.css` to `src/output.css`)
- Custom responsive CSS, system typography, and local project screenshots

## Design

The portfolio uses a warm paper palette, a brick-red accent, oversized typography,
and an editorial layout. Selected work leads the page, followed by an introduction,
experience, education, and direct contact links. Light and dark themes are available
from the header; the selected theme is saved locally. Mobile navigation supports
keyboard dismissal, and motion follows the visitor's reduced-motion preference.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Build the stylesheet:

```bash
npm run build
```

3. Start Tailwind in watch mode:

```bash
npm run watch
```

4. Open `index.html` in your browser.

## Project Structure

- Main page markup: `index.html`
- Tailwind source: `src/input.css`
- Compiled stylesheet: `src/output.css`
