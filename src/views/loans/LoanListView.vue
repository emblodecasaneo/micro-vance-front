<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-sm tracking-widest ml-1 font-medium text-gray-800">Gestion des prêts</h1>
      <div class="flex space-x-2">
        <router-link 
          to="/loans/overdue" 
          class="btn btn-secondary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          Remboursements en retard
        </router-link>
        <router-link 
          to="/loans/new" 
          class="btn btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nouveau prêt
        </router-link>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <select 
            v-model="filters.status" 
            class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            @change="applyFilters"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="active">Actif</option>
            <option value="completed">Complété</option>
            <option value="defaulted">Défaillant</option>
          </select>
        </div>
        <div>
          <select 
            v-model="filters.client_id" 
            class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            @change="applyFilters"
          >
            <option value="">Tous les clients</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.last_name }} {{ client.first_name }}
            </option>
          </select>
        </div>
        <div class="col-span-1 md:col-span-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              class="block w-full text-xs pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary" 
              placeholder="Rechercher"
              v-model="searchQuery"
              @input="debouncedSearch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Onglets pour changer de vue -->
    <div class="flex border-b border-gray-200 mb-4">
      <button 
        @click="activeTab = 'all'" 
        class="px-3 py-1.5 text-xs font-medium" 
        :class="activeTab === 'all' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
      >
        Tous les prêts
      </button>
      <button 
        @click="activeTab = 'overdue'" 
        class="px-3 py-1.5 text-xs font-medium" 
        :class="activeTab === 'overdue' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
      >
        Prêts en retard
      </button>
    </div>

    <!-- Tableau des prêts -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div v-if="loading" class="p-4 text-center text-gray-500">
        <svg class="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-xs">Chargement des prêts...</p>
      </div>
      <div v-else-if="loans.length === 0" class="p-4 text-center text-gray-500">
        <p class="text-xs">Aucun prêt trouvé.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('start_date')">
                Date de début
                <span v-if="sortField === 'start_date'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="loan in loans" :key="loan.id" class="hover:bg-gray-50">
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">#{{ loan.id }}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">{{ loan.client ? `${loan.client.last_name} ${loan.client.first_name}` : 'N/A' }}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">{{ formatCurrency(loan.amount) }}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">{{ formatDate(loan.start_date) }}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">{{ loan.term_months }} mois</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <span :class="getStatusClass(loan.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusLabel(loan.status) }}
                </span>
              </td>
              <td class="py-3 px-4 whitespace-nowrap text-xs">
                <div class="flex space-x-2">
                  <router-link :to="`/loans/${loan.id}`" class="text-primary hover:text-primary-dark">
                    Détails
                  </router-link>
                  <button 
                    v-if="loan.status === 'pending'"
                    @click="approveLoan(loan.id)" 
                    class="text-green-600 hover:text-green-800"
                  >
                    Approuver
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div v-if="loans.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex flex-col sm:flex-row justify-between items-center">
            <div class="mb-2 sm:mb-0">
              <p class="text-xs text-gray-700">
                Affichage de <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span> à <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span> sur <span class="font-medium">{{ pagination.total }}</span> résultats
              </p>
            </div>
            <div v-if="pagination.last_page > 1" class="flex items-center">
              <button
                @click="changePage(pagination.current_page - 1)"
                :disabled="pagination.current_page === 1"
                class="relative inline-flex items-center rounded-l-md px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === 1 }"
              >
                Précédent
              </button>
              
              <!-- Pages numérotées -->
              <template v-for="page in getPaginationRange()" :key="page">
                <button 
                  v-if="page !== '...'"
                  @click="changePage(page)"
                  class="relative inline-flex items-center px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                  :class="page === pagination.current_page 
                    ? 'z-10 bg-primary text-white hover:bg-primary-dark' 
                    : 'text-gray-600 hover:bg-gray-50'"
                >
                  {{ page }}
                </button>
                <span v-else class="relative inline-flex items-center px-3 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-300">
                  ...
                </span>
              </template>
              
              <button
                @click="changePage(pagination.current_page + 1)"
                :disabled="pagination.current_page === pagination.last_page"
                class="relative inline-flex items-center rounded-r-md px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === pagination.last_page }"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import api from '@/services/api';
import { useToast } from '@/composables/toast';

export default {
  name: 'LoanListView',
  setup() {
    const { showToast } = useToast();
    const loans = ref([]);
    const clients = ref([]);
    const loading = ref(false);
    const activeTab = ref('all');
    const searchQuery = ref('');
    const searchTimeout = ref(null);
    
    // Pagination
    const pagination = ref({
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10
    });
    
    // Filtres et tri
    const filters = ref({
      status: '',
      client_id: '',
      start_date_from: '',
      start_date_to: '',
      search: ''
    });
    
    const sortField = ref('created_at');
    const sortDirection = ref('desc');
    
    // Charger les prêts
    const loadLoans = async () => {
      loading.value = true;
      try {
        let endpoint = '/loans';
        let params = {
          page: pagination.value.current_page,
          per_page: pagination.value.per_page,
          sort_field: sortField.value,
          sort_direction: sortDirection.value,
          ...filters.value
        };
        
        if (activeTab.value === 'overdue') {
          endpoint = '/loans/overdue';
        }
        
        const response = await api.getLoans(params);
        loans.value = response.data.data.data;
        
        // Mettre à jour la pagination
        pagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
          per_page: response.data.data.per_page
        };
      } catch (error) {
        console.error('Erreur lors du chargement des prêts:', error);
        showToast('Erreur lors du chargement des prêts.', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    // Charger les clients pour le filtre
    const loadClients = async () => {
      try {
        const response = await api.getClients({ per_page: 100 });
        clients.value = response.data.data.data;
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
      }
    };
    
    // Trier par champ
    const sortBy = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortField.value = field;
        sortDirection.value = 'asc';
      }
      pagination.value.current_page = 1;
      loadLoans();
    };
    
    // Appliquer les filtres
    const applyFilters = () => {
      pagination.value.current_page = 1;
      loadLoans();
    };
    
    // Changer de page
    const changePage = (page) => {
      if (page < 1 || page > pagination.value.last_page) return;
      pagination.value.current_page = page;
      loadLoans();
    };
    
    // Approuver un prêt
    const approveLoan = async (loanId) => {
      try {
        loading.value = true;
        await api.approveLoan(loanId);
        showToast('Prêt approuvé avec succès.', 'success');
        loadLoans();
      } catch (error) {
        console.error('Erreur lors de l\'approbation du prêt:', error);
        showToast('Erreur lors de l\'approbation du prêt.', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    // Formater la devise
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF'
      }).format(amount);
    };
    
    // Formater la date
    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A';
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    };
    
    // Obtenir la classe CSS pour le statut
    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        defaulted: 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    };
    
    // Obtenir le libellé pour le statut
    const getStatusLabel = (status) => {
      const labels = {
        pending: 'En attente',
        active: 'Actif',
        completed: 'Complété',
        defaulted: 'Défaillant'
      };
      return labels[status] || status;
    };
    
    // Observer les changements d'onglet
    watch(activeTab, () => {
      pagination.value.current_page = 1;
      loadLoans();
    });
    
    // Dans le bloc setup() de votre composant, ajoutez cette fonction
    const getPaginationRange = () => {
      const currentPage = pagination.value.current_page;
      const lastPage = pagination.value.last_page;
      
      if (lastPage <= 5) {
        return Array.from({ length: lastPage }, (_, i) => i + 1);
      }
      
      if (currentPage <= 3) {
        return [1, 2, 3, 4, '...', lastPage];
      }
      
      if (currentPage >= lastPage - 2) {
        return [1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
      }
      
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
    };
    
    // Fonction de recherche debounced pour limiter les requêtes API
    const debouncedSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      searchTimeout.value = setTimeout(() => {
        filters.value.search = searchQuery.value;
        pagination.value.current_page = 1;
        loadLoans();
      }, 300);
    };
    
    onMounted(() => {
      loadLoans();
      loadClients();
    });
    
    return {
      loans,
      clients,
      loading,
      pagination,
      filters,
      sortField,
      sortDirection,
      activeTab,
      searchQuery,
      loadLoans,
      sortBy,
      applyFilters,
      changePage,
      approveLoan,
      formatCurrency,
      formatDate,
      getStatusClass,
      getStatusLabel,
      getPaginationRange,
      debouncedSearch
    };
  }
};
</script>

<style scoped>
.btn {
  @apply font-medium py-1.5 px-3 rounded text-xs;
}

.btn-primary {
  @apply bg-primary hover:bg-primary-dark text-white;
}

.btn-secondary {
  @apply bg-secondary hover:bg-secondary-dark text-white;
}
</style> 