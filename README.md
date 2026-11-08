# Subarna Karki — Portfolio

A single-file, animated portfolio/resume site for **Subarna Karki**, Senior SDET.

Built with HTML5, Tailwind CSS, custom CSS animations, and vanilla JavaScript. The only build step is the Tailwind stylesheet, which is committed, so GitHub Pages serves the folder as-is.

**Live site:** https://subarnakarki.github.io/subarna-karki/

## Project structure
```
index.html          Markup
assets/tailwind.css Prebuilt Tailwind utilities (generated, committed)
src/tailwind.css    Tailwind input; tailwind.config.js holds the theme
styles.css          Custom styles, animations, and theming
images/             Photos, project screenshots, og-image.png (link preview)
resume/             Downloadable resume PDF
script.js           Nav, scroll reveals, typing role, stat counters, particle canvas
.nojekyll           Serve static files as-is on GitHub Pages
```

## Change classes or the theme
After adding or changing Tailwind classes in `index.html` or `script.js`, rebuild the stylesheet and commit it:
```
npm install
npm run build:css
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
