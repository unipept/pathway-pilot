/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/reset.scss'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    // Vuetify 4 defaults this to 'system', which would flip the app to the dark
    // theme on OS dark mode. Only the light theme is defined below.
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#306ccf',
          secondary: '#cf9330',
        },
      },
    },
  }
})
