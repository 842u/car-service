const baseConfig = {
  '*.{js,mjs,jsx}': ['eslint --fix --max-warnings 0', 'prettier --write'],
  '*.{ts,mts,tsx}': ['eslint --fix --max-warnings 0', 'prettier --write'],
  '*.json': 'prettier --write',
  '*.md': 'prettier --write',
};

export default baseConfig;
