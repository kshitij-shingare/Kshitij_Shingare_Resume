# Kshitij Shingare — Interactive Resume

A modern, interactive resume website with dark/light theme toggle, scroll animations, GitHub contribution graph, and downloadable PDF.

## Features

- **Hero Landing** — Full-screen intro with animated avatar & social links
- **Scroll Animations** — Cards fade in as you scroll
- **Dark / Light Theme** — Toggle with persistence via localStorage
- **GitHub Contribution Graph** — Visual activity heatmap
- **Download Resume** — PDF download button in the footer
- **Fully Responsive** — Works on mobile, tablet, and desktop

## Quick Start

Simply open `index.html` in a browser. No build tools needed.

Or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and layout |
| `style.css` | All styling, theming, and animations |
| `script.js` | Data rendering, GitHub graph, theme toggle |
| `resume.json` | Resume data (edit this to update content) |
| `resume.pdf` | Downloadable PDF version |

## Customization

Edit `resume.json` to update your name, skills, experience, education, and projects. The site renders everything dynamically from this file.
