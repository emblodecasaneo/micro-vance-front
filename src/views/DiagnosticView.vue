<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <router-link to="/" class="text-primary hover:text-primary-dark flex items-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs">Retour au tableau de bord</span>
        </router-link>
        <h1 class="text-sm font-medium text-gray-800">Diagnostic système</h1>
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-lg p-4 border border-gray-200 mb-4">
      <p class="text-xs text-gray-600 mb-3">Cet outil permet de tester les connexions API et de diagnostiquer d'éventuels problèmes techniques.</p>
      
      <div class="flex flex-wrap gap-2">
        <div class="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-md text-xs border border-primary border-opacity-20 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Version API: 1.0
        </div>
        
        <div class="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs border border-green-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Connexion: Active
        </div>
      </div>
    </div>
    
    <DiagnosticTool />
  </div>
</template>

<script setup>
import DiagnosticTool from '@/components/DiagnosticTool.vue';
</script> 