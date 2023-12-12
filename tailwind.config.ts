import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'dark-lighter': 'var(--color-dark-lighter)',
      dark: 'var(--color-dark)',

      light: 'var(--color-light)',
      'light-darker': 'var(--color-light-darker)',

      accent: 'var(--color-accent)',
      'accent-darker': 'var(--color-accent-darker)',

      'border-default': 'var(--color-border-default)',
    },
  },
  plugins: [],
};

export default config;
