/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import * as labs from 'vuetify/labs/components'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...labs
  },
  
  theme: {
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
