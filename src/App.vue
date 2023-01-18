<template>
  <navigation-bar :items="items" />
  
  <v-container>
    <router-view />
  </v-container>
</template>

<script lang="ts" setup>
import NavigationBar from './components/navigation/NavigationBar.vue';

const items = [
  { name: 'Home', path: '/' }
];
</script>
