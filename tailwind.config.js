/** Tailwind build for the site. Run `npm run build:css` after changing classes in index.html or script.js. */
module.exports = {
  content: ['./index.html', './script.js'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a365d',
          900: '#0a1626',
          800: '#0f223b',
          700: '#132c4d',
          600: '#1a365d',
          500: '#254977',
        },
        slate: {
          muted: '#94a3b8',
        },
        mint: '#5eead4',
        cyan: '#22d3ee',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
