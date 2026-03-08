// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default withNuxt(
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
      },
      globals: {
        useTodos: 'readonly',
        _resetTodosState: 'readonly',
      },
    },
  },
  {
    files: ['app/pages/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)