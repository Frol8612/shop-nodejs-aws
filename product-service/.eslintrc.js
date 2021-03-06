module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    es2021: true,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-template-curly-in-string': 'off',
    'no-plusplus': 'off',
  },
};
