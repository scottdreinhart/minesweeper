import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks, boundaries },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },
      'boundaries/elements': [
        { type: 'domain', pattern: 'src/domain/*' },
        { type: 'app', pattern: 'src/app/*' },
        { type: 'ui', pattern: 'src/ui/*' },
        { type: 'workers', pattern: 'src/workers/*' },
        { type: 'themes', pattern: 'src/themes/*' },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'domain', allow: ['domain'] },
            { from: 'app', allow: ['domain', 'app'] },
            { from: 'ui', allow: ['domain', 'app', 'ui'] },
            { from: 'workers', allow: ['domain'] },
            { from: 'themes', allow: [] },
          ],
        },
      ],
    },
  },
  { ignores: ['dist/', 'electron/', 'android/'] },
]
