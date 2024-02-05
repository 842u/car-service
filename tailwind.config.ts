import containerQueries from '@tailwindcss/container-queries';
import tailwindForms from '@tailwindcss/forms';
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
      'dark-50': 'var(--color-dark-50)',
      'dark-100': 'var(--color-dark-100)',
      'dark-200': 'var(--color-dark-200)',
      'dark-300': 'var(--color-dark-300)',
      'dark-400': 'var(--color-dark-400)',
      'dark-500': 'var(--color-dark-500)',
      'dark-600': 'var(--color-dark-600)',
      'dark-700': 'var(--color-dark-700)',
      'dark-800': 'var(--color-dark-800)',
      'dark-900': 'var(--color-dark-900)',

      'light-50': 'var(--color-light-50)',
      'light-100': 'var(--color-light-100)',
      'light-200': 'var(--color-light-200)',
      'light-300': 'var(--color-light-300)',
      'light-400': 'var(--color-light-400)',
      'light-500': 'var(--color-light-500)',
      'light-600': 'var(--color-light-600)',
      'light-700': 'var(--color-light-700)',
      'light-800': 'var(--color-light-800)',
      'light-900': 'var(--color-light-900)',

      'accent-50': 'var(--color-accent-50)',
      'accent-100': 'var(--color-accent-100)',
      'accent-200': 'var(--color-accent-200)',
      'accent-300': 'var(--color-accent-300)',
      'accent-400': 'var(--color-accent-400)',
      'accent-500': 'var(--color-accent-500)',
      'accent-600': 'var(--color-accent-600)',
      'accent-700': 'var(--color-accent-700)',
      'accent-800': 'var(--color-accent-800)',
      'accent-900': 'var(--color-accent-900)',

      'error-50': 'var(--color-error-50)',
      'error-100': 'var(--color-error-100)',
      'error-200': 'var(--color-error-200)',
      'error-300': 'var(--color-error-300)',
      'error-400': 'var(--color-error-400)',
      'error-500': 'var(--color-error-500)',
      'error-600': 'var(--color-error-600)',
      'error-700': 'var(--color-error-700)',
      'error-800': 'var(--color-error-800)',
      'error-900': 'var(--color-error-900)',

      'success-50': 'var(--color-success-50)',
      'success-100': 'var(--color-success-100)',
      'success-200': 'var(--color-success-200)',
      'success-300': 'var(--color-success-300)',
      'success-400': 'var(--color-success-400)',
      'success-500': 'var(--color-success-500)',
      'success-600': 'var(--color-success-600)',
      'success-700': 'var(--color-success-700)',
      'success-800': 'var(--color-success-800)',
      'success-900': 'var(--color-success-900)',

      'alpha-grey-50': 'var(--color-alpha-grey-50)',
      'alpha-grey-100': 'var(--color-alpha-grey-100)',
      'alpha-grey-200': 'var(--color-alpha-grey-200)',
      'alpha-grey-300': 'var(--color-alpha-grey-300)',
      'alpha-grey-400': 'var(--color-alpha-grey-400)',
      'alpha-grey-500': 'var(--color-alpha-grey-500)',
      'alpha-grey-600': 'var(--color-alpha-grey-600)',
      'alpha-grey-700': 'var(--color-alpha-grey-700)',
      'alpha-grey-800': 'var(--color-alpha-grey-800)',
      'alpha-grey-900': 'var(--color-alpha-grey-900)',
    },
  },
  plugins: [tailwindForms, containerQueries],
};

export default config;
