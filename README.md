# Subarna Karki — Portfolio

A single-file, animated portfolio/resume site for **Subarna Karki**, Quality Engineer.

Built with HTML5, Tailwind CSS (CDN), custom CSS animations, and vanilla JavaScript — no build step.

**Live site:** https://subarnakarki.github.io/subarna-karki/

## Project structure
```
index.html    Markup + Tailwind CDN
styles.css    Custom styles, animations, and theming
script.js     Nav, scroll reveals, typing role, stat counters, particle canvas
.nojekyll     Serve static files as-is on GitHub Pages
```

## Run locally
Open `index.html` in any modern browser, or serve the folder:
```
python3 -m http.server 8000
```
then visit http://localhost:8000

## Deploy on GitHub Pages
Published from the `main` branch (root):

1. **Settings → Pages → Build and deployment → Source: Deploy from a branch**
2. Branch `main`, folder `/ (root)` → **Save**

`.nojekyll` is included so the static HTML is served as-is.
