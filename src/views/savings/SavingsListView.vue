<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-sm ml-1 tracking-widest font-medium text-gray-800">Comptes d'épargne</h1>
      <router-link 
        to="/savings/new" 
        class="btn btn-primary flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Nouveau compte
      </router-link>
    </div>
    
    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="col-span-2">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              class="block w-[200px] text-xs pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary" 
              placeholder="Rechercher"
              v-model="searchQuery"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <div>
          <select 
            id="status-filter"
            v-model="filters.status"
            class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            @change="refreshAccounts"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="closed">Clôturé</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Tableau des comptes d'épargne -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div v-if="loading" class="p-4 text-center text-gray-500">
        <svg class="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Chargement des comptes d'épargne...</p>
      </div>
      
      <div v-else-if="accounts.length === 0" class="p-4 text-center text-gray-500">
        <p>Aucun compte d'épargne trouvé.</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Compte</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client associé</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux d'intérêt</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="account in accounts" :key="account.id" class="hover:bg-gray-50 cursor-pointer" @click="goToAccountDetails(account.id)">
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">{{ account.account_number }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(account.opening_date) }}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">
                  {{ account.client ? `${account.client.first_name} ${account.client.last_name}` : 'N/A' }}
                </div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">{{ formatCurrency(account.balance) }}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-600">{{ account.interest_rate }}%</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-green-100 text-green-800': account.status === 'active',
                    'bg-yellow-100 text-yellow-800': account.status === 'inactive',
                    'bg-red-100 text-red-800': account.status === 'closed'
                  }">
                  {{ getStatusText(account.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="accounts.length > 0" class="mt-4 flex justify-between items-center bg-white px-4 py-3 border-t border-gray-200">
        <div class="text-xs text-gray-700">
          Affichage de {{ (pagination.currentPage - 1) * pagination.perPage + 1 }} à {{ Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems) }} sur {{ pagination.totalItems }} résultats
        </div>
        <div class="flex space-x-1">
          <button 
            @click="changePage(pagination.currentPage - 1)" 
            :disabled="pagination.currentPage === 1" 
            :class="pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Précédent
          </button>
          <div v-for="page in getVisiblePageNumbers()" :key="page">
            <button 
              v-if="page !== '...'" 
              @click="changePage(page)"
              :class="pagination.currentPage === page ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
              class="px-3 py-1 text-xs border border-gray-300 rounded-md"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 py-1 text-xs">{{ page }}</span>
          </div>
          <button 
            @click="changePage(pagination.currentPage + 1)" 
            :disabled="pagination.currentPage === pagination.totalPages" 
            :class="pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
    
    <!-- Portail pour les menus déroulants -->
    <div id="dropdown-portal"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/store/toast';
import debounce from 'lodash/debounce';

const store = useStore();
const toastStore = useToastStore();
const router = useRouter();

// État local
const searchQuery = ref('');
const filters = ref({
  status: '',
  search: '',
});

// Calculer les données à partir du store
const accounts = computed(() => store.getters['savings/getAccounts']);
const loading = computed(() => store.getters['savings/isLoading']);
const error = computed(() => store.getters['savings/getError']);
const pagination = computed(() => store.getters['savings/getPagination']);

// Initialiser les données
onMounted(async () => {
  await refreshAccounts();
  document.addEventListener('click', closeDropdowns);
  
  // Ajouter des styles pour corriger les problèmes de positionnement des menus déroulants
  const style = document.createElement('style');
  style.textContent = `
    .dropdown-menu-fixed {
      position: fixed !important;
      z-index: 100 !important;
      overflow: visible !important;
      max-height: none !important;
    }
    
    .relative {
      position: relative !important;
    }
  `;
  document.head.appendChild(style);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});

// Rafraîchir la liste des comptes d'épargne
const refreshAccounts = async () => {
  try {
    await store.dispatch('savings/fetchAccounts', {
      page: 1,
      perPage: 10,
      search: searchQuery.value,
      status: filters.value.status
    });
    
    if (error.value) {
      toastStore.error(error.value);
    }
  } catch (err) {
    console.error('Error refreshing accounts:', err);
    toastStore.error('Une erreur est survenue lors du chargement des comptes d\'épargne');
  }
};

// Créer une version debounce de la fonction de recherche
const debouncedSearch = debounce(() => {
  refreshAccounts();
}, 500);

// Fonctions pour la pagination
const changePage = async (page) => {
  if (page < 1 || page > pagination.value.totalPages) {
    return;
  }
  
  await store.dispatch('savings/fetchAccounts', {
    page,
    perPage: pagination.value.perPage,
    search: searchQuery.value,
    status: filters.value.status
  });
};

const getVisiblePageNumbers = () => {
  const currentPage = pagination.value.currentPage;
  const lastPage = pagination.value.totalPages;
  
  if (lastPage <= 7) {
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

// Fonction pour formater la monnaie
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF', // FCFA
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

// Fonction pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Obtenir le texte du statut
const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'inactive':
      return 'Inactif';
    case 'closed':
      return 'Clôturé';
    default:
      return status;
  }
};

const activeDropdown = ref(null);

// Version améliorée du toggle dropdown qui ajuste la position
const toggleDropdown = (accountId) => {
  // Fermer d'abord tous les autres dropdowns
  if (activeDropdown.value !== accountId) {
    activeDropdown.value = accountId;
    
    // Permettre au DOM de se mettre à jour
    setTimeout(() => {
      // Trouver le menu déroulant actuel
      const dropdownEl = document.querySelector(`[data-account-id="${accountId}"]`);
      if (dropdownEl) {
        // Ajouter des classes pour le positionnement fixe
        dropdownEl.classList.add('dropdown-menu-fixed');
        
        // Positionner le menu en fonction du bouton
        const button = document.querySelector(`[data-dropdown-button="${accountId}"]`);
        if (button) {
          const buttonRect = button.getBoundingClientRect();
          const windowWidth = window.innerWidth;
          
          // Positionner à droite du bouton, mais pas hors de l'écran
          let leftPos = buttonRect.right - dropdownEl.offsetWidth;
          if (leftPos < 10) leftPos = 10;
          
          dropdownEl.style.top = `${buttonRect.bottom + 5}px`;
          dropdownEl.style.left = `${leftPos}px`;
        }
      }
    }, 10);
  } else {
    // Si on clique sur le même bouton, fermer le dropdown
    activeDropdown.value = null;
  }
};

const goToAccountDetails = (accountId) => {
  router.push(`/savings/${accountId}`);
};

const closeDropdowns = (event) => {
  // Vérifier si le clic est à l'extérieur d'un menu déroulant ou d'un bouton de menu
  if (activeDropdown.value !== null) {
    const dropdownEl = document.querySelector(`[data-account-id="${activeDropdown.value}"]`);
    const buttonEl = document.querySelector(`[data-dropdown-button="${activeDropdown.value}"]`);
    
    if (dropdownEl && buttonEl && 
        !dropdownEl.contains(event.target) && 
        !buttonEl.contains(event.target)) {
      activeDropdown.value = null;
    }
  }
};
</script>

<style>
/* Styles pour les menus déroulants */
.dropdown-menu-fixed {
  position: fixed !important;
  z-index: 100 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: white;
  border-radius: 0.375rem;
  overflow: visible !important;
}

.btn {
  @apply inline-flex justify-center items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary;
}
</style>