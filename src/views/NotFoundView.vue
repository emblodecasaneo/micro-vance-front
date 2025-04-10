<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <ExclamationTriangleIcon class="h-20 w-20 text-primary mb-6" />
    <h1 class="text-2xl font-semibold text-primary mb-4">404</h1>
    <h2 class="text-xl font-medium text-gray-800 mb-4">Page introuvable</h2>
    <p class="text-lg text-gray-600 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
    <router-link to="/" class="btn btn-primary flex items-center">
      <HomeIcon class="h-5 w-5 mr-2" />
      Retour à l'accueil
    </router-link>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/vue/24/outline';
</script> 