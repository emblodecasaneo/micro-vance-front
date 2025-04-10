<template>
  <div>
    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Total des remboursements</h3>
        <p class="text-xl font-bold text-gray-800">{{ data.total_count }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ formatCurrency(data.total_amount) }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Montants par statut</h3>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-sm text-green-600">Payés:</span>
            <span class="text-sm font-medium text-green-600">{{ formatCurrency(data.paid_amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-yellow-600">En attente:</span>
            <span class="text-sm font-medium text-yellow-600">{{ formatCurrency(data.pending_amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-red-600">Manqués:</span>
            <span class="text-sm font-medium text-red-600">{{ formatCurrency(data.missed_amount) }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Répartition par statut</h3>
        <div class="space-y-2">
          <div v-for="item in data.status_distribution" :key="item.status" class="flex justify-between">
            <span class="text-sm">{{ getStatusLabel(item.status) }}</span>
            <span class="text-sm font-medium">{{ item.count }} ({{ formatCurrency(item.total_amount) }})</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Liste détaillée -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-700">Détails des remboursements</h3>
      </div>
      
      <div v-if="data.repayments.data.length === 0" class="p-4 text-center text-gray-500">
        Aucun remboursement trouvé pour les critères sélectionnés.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prêt</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'échéance</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="repayment in data.repayments.data" :key="repayment.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ repayment.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ repayment.loan?.client ? `${repayment.loan.client.first_name} ${repayment.loan.client.last_name}` : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Prêt #{{ repayment.loan_id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(repayment.due_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(repayment.amount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(repayment.status)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusLabel(repayment.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="data.repayments.data.length > 0" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Affichage de {{ data.repayments.from }} à {{ data.repayments.to }} sur {{ data.repayments.total }} résultats
        </div>
        <div class="flex space-x-2">
          <button 
            v-for="page in data.repayments.links" 
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

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0
  }).format(amount);
}

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
    'pending': 'En attente',
    'paid': 'Payé',
    'late': 'En retard',
    'missed': 'Manqué'
  };
  
  return statusMap[status] || status;
}

function getStatusClass(status) {
  const classMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'paid': 'bg-green-100 text-green-800',
    'late': 'bg-orange-100 text-orange-800',
    'missed': 'bg-red-100 text-red-800'
  };
  
  return classMap[status] || 'bg-gray-100 text-gray-800';
}
</script> 