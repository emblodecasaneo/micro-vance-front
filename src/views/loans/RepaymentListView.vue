<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <router-link to="/loans" class="text-primary hover:text-primary-dark flex items-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
        <h1 class="text-sm font-medium tracking-widest text-gray-600">Gestion des remboursements</h1>
      </div>
      
      <!-- Filtres de recherche -->
      <div class="flex space-x-2">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Rechercher un client..."
            class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span class="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        <select 
          v-model="statusFilter" 
          @change="filterByStatus"
          class="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="paid">Payé</option>
          <option value="late">En retard</option>
          <option value="missed">Manqué</option>
        </select>
        <router-link 
          to="/loans/overdue" 
          class="btn btn-secondary flex items-center text-xs px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          En retard uniquement
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="repayments.length === 0" class="text-center py-8">
      <div class="text-gray-400 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-sm text-gray-600">Aucun remboursement trouvé</p>
    </div>

    <div v-else class="mt-2">
      <!-- Tableau des remboursements -->
      <div class="bg-white overflow-x-auto rounded-md shadow-sm border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prêt</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'échéance</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="repayment in sortedRepayments" 
              :key="repayment.id" 
              @click="goToLoanDetails(repayment.loan_id)"
              class="repayment-row"
            >
              <td class="px-6 py-4 text-xs whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-medium">
                    {{ repayment.loan?.client?.first_name?.charAt(0).toUpperCase() || '' }}{{ repayment.loan?.client?.last_name?.charAt(0).toUpperCase() || '' }}
                  </div>
                  <div class="ml-3">
                    <div class="text-xs font-medium text-gray-500">
                      {{ repayment.loan?.client?.first_name || '' }} {{ repayment.loan?.client?.last_name || '' }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ repayment.loan?.client?.phone_number || '' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs text-gray-500 font-medium">
                  Prêt #{{ repayment.loan?.id || '' }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatCurrency(repayment.loan?.amount || 0) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-500">{{ formatDate(repayment.due_date) }}</div>
                <div class="text-xs text-gray-500">Échéance #{{ repayment.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-500">
                {{ formatCurrency(repayment.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(repayment.status)" class="px-2 inline-flex text-xs leading-5 font-medium rounded-lg">
                  {{ getStatusLabel(repayment.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-xs text-gray-700">
          Affichage de {{ (currentPage - 1) * perPage + 1 }} à {{ Math.min(currentPage * perPage, totalItems) }} sur {{ totalItems }} résultats
        </div>
        <div class="flex space-x-1">
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage === 1" 
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Précédent
          </button>
          <div v-for="page in displayedPages" :key="page">
            <button 
              v-if="page !== '...'" 
              @click="goToPage(page)"
              :class="currentPage === page ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
              class="px-3 py-1 text-xs border border-gray-300 rounded-md"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 py-1 text-xs">{{ page }}</span>
          </div>
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage === totalPages" 
            :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/toast';
import api from '@/services/api';

const router = useRouter();
const toast = useToast();
const loading = ref(true);
const repayments = ref([]);
const searchQuery = ref('');
const searchTimeout = ref(null);
const statusFilter = ref('');

// Pagination
const currentPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value));

// Computed property pour trier les remboursements
const sortedRepayments = computed(() => {
  // Clone le tableau pour éviter de modifier l'original
  return [...repayments.value].sort((a, b) => {
    // Définir l'ordre de priorité des statuts
    const statusOrder = {
      'late': 0,    // En retard (priorité maximale)
      'pending': 1, // En attente (seconde priorité)
      'missed': 2,  // Manqué
      'paid': 3     // Payé (priorité minimale)
    };
    
    // Comparer les statuts en fonction de leur ordre de priorité
    return statusOrder[a.status] - statusOrder[b.status];
  });
});

// Calcul des pages à afficher dans la pagination
const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  
  if (totalPages.value <= maxVisiblePages) {
    // Si le nombre total de pages est inférieur ou égal au maximum de pages visibles, afficher toutes les pages
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Toujours afficher la première page
    pages.push(1);
    
    // Calculer les pages intermédiaires à afficher
    let startPage = Math.max(2, currentPage.value - 1);
    let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);
    
    // Ajuster startPage et endPage pour afficher 3 pages au milieu
    if (startPage > 2) pages.push('...');
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages.value - 1) pages.push('...');
    
    // Toujours afficher la dernière page
    pages.push(totalPages.value);
  }
  
  return pages;
});

onMounted(() => {
  fetchAllRepayments();
});

async function fetchAllRepayments() {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value
    };
    
    // Ajouter le terme de recherche si présent
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    // Ajouter le filtre de statut si présent
    if (statusFilter.value) {
      params.status = statusFilter.value;
    }
    
    // Appel d'API spécifique pour récupérer tous les remboursements
    const response = await api.getAllRepayments(params);
    
    if (response.data.status === 'success') {
      repayments.value = response.data.data.data;
      totalItems.value = response.data.data.total;
      currentPage.value = response.data.data.current_page;
    } else {
      toast.showToast('Erreur lors de la récupération des remboursements', 'error');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des remboursements:', error);
    toast.showToast('Erreur lors de la récupération des remboursements', 'error');
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  // Utiliser un délai avant d'envoyer la requête pour éviter trop d'appels API
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1; // Réinitialiser la pagination
    fetchAllRepayments();
  }, 300);
}

function filterByStatus() {
  currentPage.value = 1; // Réinitialiser la pagination
  fetchAllRepayments();
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchAllRepayments();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

function getStatusLabel(status) {
  switch(status) {
    case 'pending': return 'En attente';
    case 'paid': return 'Payé';
    case 'late': return 'En retard';
    case 'missed': return 'Manqué';
    default: return status;
  }
}

function getStatusBadgeClass(status) {
  switch(status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'paid': return 'bg-green-100 text-green-800';
    case 'late': return 'bg-red-100 text-red-800';
    case 'missed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Nouvelle fonction pour naviguer vers la page de détail du prêt
function goToLoanDetails(loanId) {
  if (loanId) {
    router.push(`/loans/${loanId}`);
  }
}
</script>

<style scoped>
.btn {
  @apply font-medium py-1.5 px-3 rounded text-xs;
}

.btn-sm {
  @apply py-1 px-2 text-xs;
}

.btn-xs {
  @apply py-0.5 px-2 text-xs;
}

.btn-primary {
  @apply bg-primary hover:bg-primary-dark text-white;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700;
}

.btn-danger {
  @apply bg-red-500 hover:bg-red-600 text-white;
}

/* Adding cursor pointer to the repayment row */
.repayment-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.repayment-row:hover {
  background-color: rgba(0,0,0,0.05);
}
</style> 