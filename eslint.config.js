import { FlatCompat } from '@eslint/eslintrc'
import typescriptParser from '@typescript-eslint/parser'

import path from 'path'
import { fileURLToPath } from 'url'

import eslintPluginAstro from 'eslint-plugin-astro'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  { ignores: ['**/.astro/content.d.ts'] },
  ...eslintPluginAstro.configs.recommended,
  ...compat.extends('eslint-config-standard'),
  ...compat.extends('eslint-config-prettier'),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
    },
  },
]
