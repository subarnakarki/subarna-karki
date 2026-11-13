/** Tailwind build for the site. Run `npm run build:css` after changing classes in index.html or script.js. */
module.exports = {
  content: ['./index.html', './script.js'],
  theme: {
    extend: {
      colors: {
        paper: '#0f1115',
        surface: '#171a20',
        ink: { DEFAULT: '#eceff4', 2: '#c3c8d1' },
        muted: '#8f96a3',
        line: '#232731',
        accent: { DEFAULT: '#8fb4ff', dark: '#a9c5ff' },
      },
      fontFamily: {
        display: ['"Red Hat Display"', 'system-ui', 'sans-serif'],
        sans: ['"Red Hat Text"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
};
