<template>
  <div>
    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Total des clients</h3>
        <p class="text-xl font-bold text-gray-800">{{ data.total_clients }}</p>
        <div class="mt-2 flex justify-between text-sm">
          <span class="text-green-600">Actifs: {{ data.active_clients }}</span>
          <span class="text-gray-500">Inactifs: {{ data.inactive_clients }}</span>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Clients avec services</h3>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-sm">Avec prêts actifs:</span>
            <span class="text-sm font-medium">{{ data.clients_with_active_loans }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm">Avec comptes d'épargne:</span>
            <span class="text-sm font-medium">{{ data.clients_with_savings }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Répartition par agent</h3>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          <div v-for="item in data.agent_distribution" :key="item.agent_id" class="flex justify-between">
            <span class="text-sm">{{ item.agent ? item.agent.name : 'Sans agent' }}</span>
            <span class="text-sm font-medium">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Liste détaillée -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-700">Détails des clients</h3>
      </div>
      
      <div v-if="data.clients.data.length === 0" class="p-4 text-center text-gray-500">
        Aucun client trouvé pour les critères sélectionnés.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in data.clients.data" :key="client.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ client.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ client.first_name }} {{ client.last_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{{ client.phone_number }}</div>
                <div class="text-xs text-gray-400">{{ client.email || 'Pas d\'email' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ client.agent ? client.agent.name : 'Non assigné' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(client.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(client.status)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusLabel(client.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="data.clients.data.length > 0" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Affichage de {{ data.clients.from }} à {{ data.clients.to }} sur {{ data.clients.total }} résultats
        </div>
        <div class="flex space-x-2">
          <button 
            v-for="page in data.clients.links" 
            :key="page.label"
            :disabled="!page.url"
            class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
            :class="{ 'bg-primary text-white hover:bg-primary-dark': page.active }"
          >
            <span v-html="page.label"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function getStatusLabel(status) {
  const statusMap = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'blacklisted': 'Liste noire'
  };
  
  return statusMap[status] || status;
}

function getStatusClass(status) {
  const classMap = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'blacklisted': 'bg-red-100 text-red-800'
  };
  
  return classMap[status] || 'bg-gray-100 text-gray-800';
}
</script> 