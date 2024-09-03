<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style>
:root {
  --ion-color-primary: #0066ff;
  --ion-color-secondary: #4caf50;
  --ion-color-dark: #333333;
  --ion-font-family: 'Roboto', sans-serif;
}

body {
  background-color: #f5f5f5;
}

ion-content {
  --background: #f5f5f5;
}

ion-toolbar {
  --background: var(--ion-color-dark);
  --color: #ffffff;
}
</style>