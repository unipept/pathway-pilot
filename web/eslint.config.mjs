import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  vueTsConfigs.base,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'vue/multi-word-component-names': 'off',

      // Vuetify data-table slots are named `item.<column>`. The rule reads the
      // dot as a directive modifier; this is the documented way to allow it.
      'vue/valid-v-slot': ['error', { allowModifiers: true }],

      // The base rule does not understand type-only imports or Vue's
      // compiler macros; the TypeScript-aware one replaces it.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
)
