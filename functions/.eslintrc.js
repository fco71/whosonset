module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
  ],
  ignorePatterns: ['dist/**', 'lib/**'],
  overrides: [
    {
      files: ['src/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
      rules: {
        quotes: ['error', 'double'],
        'max-len': ['error', { code: 80 }],
      },
    },
  ],
};
