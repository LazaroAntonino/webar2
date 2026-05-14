module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'eslint.cjs', 'scripts/**', '.vite-react-ssg-temp/**', 'server/**'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    settings: { react: { version: '18.2' } },
    plugins: ['react-refresh'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, checkJS: false },
      ],
      // React 17+ JSX transform — no need to import React in scope
      'react/react-in-jsx-scope': 'off',
      // prop-types: off — project uses TypeScript-style JSDoc or runtime validation
      'react/prop-types': 'off',
      // Allow unused vars only when prefixed with _ (intentional)
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Allow empty catch blocks (used intentionally for graceful degradation)
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  }
