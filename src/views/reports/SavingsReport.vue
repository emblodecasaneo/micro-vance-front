<template>
  <div>
    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Comptes d'épargne</h3>
        <p class="text-xl font-bold text-gray-800">{{ data.total_accounts }}</p>
        <p class="text-sm text-gray-500 mt-1">Solde total: {{ formatCurrency(data.total_balance) }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Mouvements</h3>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-sm text-green-600">Dépôts:</span>
            <span class="text-sm font-medium text-green-600">{{ formatCurrency(data.deposits_amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-red-600">Retraits:</span>
            <span class="text-sm font-medium text-red-600">{{ formatCurrency(data.withdrawals_amount) }}</span>
          </div>
          <div class="border-t border-gray-100 my-2"></div>
          <div class="flex justify-between">
            <span class="text-sm font-medium">Balance:</span>
            <span class="text-sm font-medium">{{ formatCurrency(data.deposits_amount - data.withdrawals_amount) }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-3">Répartition par type</h3>
        <div class="space-y-2">
          <div v-for="item in data.type_distribution" :key="item.type" class="flex justify-between">
            <span class="text-sm">{{ getTypeLabel(item.type) }}</span>
            <span class="text-sm font-medium">{{ item.count }} ({{ formatCurrency(item.total_amount) }})</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Liste détaillée -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-700">Détails des transactions</h3>
      </div>
      
      <div v-if="data.transactions.data.length === 0" class="p-4 text-center text-gray-500">
        Aucune transaction trouvée pour les critères sélectionnés.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde après</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in data.transactions.data" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ transaction.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction?.client ? `${transaction.client.first_name} ${transaction.client.last_name}` : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.savingsAccount ? `#${transaction.savingsAccount.account_number}` : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeClass(transaction.type)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getTypeLabel(transaction.type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(transaction.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(transaction.amount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(transaction.balance_after) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="data.transactions.data.length > 0" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Affichage de {{ data.transactions.from }} à {{ data.transactions.to }} sur {{ data.transactions.total }} résultats
        </div>
        <div class="flex space-x-2">
          <button 
            v-for="page in data.transactions.links" 
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function getTypeLabel(type) {
  const typeMap = {
    'deposit': 'Dépôt',
    'withdrawal': 'Retrait',
    'interest': 'Intérêt',
    'fee': 'Frais',
    'transfer': 'Transfert'
  };
  
  return typeMap[type] || type;
}

function getTypeClass(type) {
  const classMap = {
    'deposit': 'bg-green-100 text-green-800',
    'withdrawal': 'bg-red-100 text-red-800',
    'interest': 'bg-blue-100 text-blue-800',
    'fee': 'bg-orange-100 text-orange-800',
    'transfer': 'bg-purple-100 text-purple-800'
  };
  
  return classMap[type] || 'bg-gray-100 text-gray-800';
}
</script> 