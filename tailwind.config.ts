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
      dark: 'var(--color-dark)',
      light: 'var(--color-light)',
      accent: 'var(--color-accent)',
    },
  },
  plugins: [],
};

export default config;
