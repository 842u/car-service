const baseConfig = {
  '*.{js,mjs,jsx}': [
    'eslint --fix --max-warnings 0 --no-warn-ignored',
    'prettier --write',
  ],
  '*.{ts,mts,tsx}': [
    'eslint --fix --max-warnings 0 --no-warn-ignored',
    'prettier --write',
  ],
  '*.json': 'prettier --write',
  '*.md': 'prettier --write',
};

export default baseConfig;
