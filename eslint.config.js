import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dist-ssr']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // The Fast Refresh rule assumes every module is a hot-reloadable component
    // module. These two are not: entry-server only runs in the build-time
    // prerenderer, and router.tsx deliberately exports its hook and <Link>
    // alongside <Router> so route handling stays in one file.
    files: ['src/entry-server.tsx', 'src/router.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
