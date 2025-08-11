import reactConfig from '@noera/eslint-config/react';

export default [
  {
    ignores: ['dist/', 'node_modules/'],
  },
  ...reactConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    // UI-specific overrides can go here if needed
  },
];
