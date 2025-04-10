<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-sm tracking-widest font-medium text-gray-800">Liste de clients</h1>
      <router-link 
        to="/clients/new" 
        class="btn btn-primary flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Nouveau client
      </router-link>
    </div>
    
    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="col-span-2">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              class="block w-auto text-xs pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary" 
              placeholder="Rechercher par nom, email..."
              v-model="searchQuery"
              @input="debounceSearch"
            />
          </div>
        </div>

        <div>
          <select 
            id="status-filter"
            v-model="filters.status"
            class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            @change="fetchClients"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="blacklisted">Liste noire</option>
          </select>
        </div>

        <div>
          <select 
            id="agent-filter"
            v-model="filters.agent_id"
            class="block w-full text-xs py-1.5 px-3 text-gray-600 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            @change="fetchClients"
          >
            <option value="">Tous les agents</option>
            <option v-if="authStore.isAdmin" value="me">Mes clients</option>
          </select>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-500">Chargement des clients...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-6 my-4">
      <div class="flex items-center text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-lg font-medium">Erreur de chargement</h2>
      </div>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <div class="flex space-x-2">
        <button 
          @click="refreshFromRoute()" 
          class="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Réessayer
        </button>
        <button 
          @click="error = null" 
          class="btn btn-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Fermer
        </button>
      </div>
    </div>

    <!-- Liste des clients vide -->
    <div v-else-if="clients.length === 0" class="bg-white rounded-lg shadow-sm p-4 my-4 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="text-md font-medium text-gray-700 mb-1">Aucun client trouvé</h3>
      <p class="text-sm text-gray-500 mb-3">
        {{ searchQuery || filters.status || filters.agent_id ? 
          'Aucun client ne correspond à vos critères de recherche.' : 
          'Commencez par ajouter votre premier client.' }}
      </p>
      <router-link to="/clients/new" class="btn btn-primary inline-block text-sm py-1.5 px-3">
        Nouveauclient
      </router-link>
    </div>

    <!-- Tableau des clients -->
    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profession
            </th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gestionnaire
            </th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="client in clients" :key="client.id" 
              class="hover:bg-gray-50  cursor-pointer"
              @click="goToClientDetails(client.id)">
            <td class="px-4 py-2 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                  <span class="text-primary text-sm font-medium">{{ getInitials(client.first_name, client.last_name) }}</span>
                </div>
                <div class="ml-3">
                  <div class="text-xs font-medium text-gray-600">
                    {{ client.first_name }} {{ client.last_name }}
                  </div>
                  <div class="text-xs text-gray-500">
                    ID: {{ client.id_card_number }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
              <div class="text-xs text-gray-600">{{ client.phone_number }}</div>
              <div class="text-xs text-gray-500">{{ client.email || 'Non renseigné' }}</div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
              <div class="text-xs text-gray-600">{{ client.profession || 'Sans profession' }}</div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
              <div class="text-xs text-gray-600">{{ client.agent?.name || 'Non assigné' }}</div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
              <span :class="getStatusClass(client.status)">
                {{ getStatusLabel(client.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3">
        <div class="text-xs text-gray-700">
          Affichage de {{ pagination.from }} à {{ pagination.to }} sur {{ pagination.total }} résultats
        </div>
        <div class="flex space-x-1">
          <button 
            @click="changePage(pagination.current_page - 1)" 
            :disabled="pagination.current_page === 1" 
            :class="pagination.current_page === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Précédent
          </button>
          <div v-for="page in getVisiblePageNumbers()" :key="page">
            <button 
              v-if="page !== '...'" 
              @click="changePage(page)"
              :class="pagination.current_page === page ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
              class="px-3 py-1 text-xs border border-gray-300 rounded-md"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 py-1 text-xs">{{ page }}</span>
          </div>
          <button 
            @click="changePage(pagination.current_page + 1)" 
            :disabled="pagination.current_page === pagination.last_page" 
            :class="pagination.current_page === pagination.last_page ? 'opacity-50 cursor-not-allowed' : ''"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-4 pb-3">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 sm:mx-0 sm:h-8 sm:w-8">
                <svg class="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-md font-medium text-gray-900" id="modal-title">
                  Supprimer le client
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer <span class="font-medium">{{ clientToDelete?.first_name }} {{ clientToDelete?.last_name }}</span> ? Cette action est irréversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-red-600 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto"
              @click="deleteClient"
              :disabled="deleteLoading"
            >
              <svg v-if="deleteLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Supprimer
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto"
              @click="showDeleteModal = false"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import api from '@/services/api';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// État
const clients = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const filters = reactive({
  status: '',
  agent_id: ''
});
const pagination = reactive({
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  last_page: 1,
  per_page: 10
});
const showDeleteModal = ref(false);
const clientToDelete = ref(null);
const deleteLoading = ref(false);
const error = ref(null);

// Surveiller les changements de route pour recharger les données
const refreshFromRoute = () => {
  // Réinitialiser à la première page
  pagination.current_page = 1;
  // Forcer le rechargement complet
  fetchClients();
};

// Méthode principale pour charger les clients
const fetchClients = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Construire les paramètres de requête
    const params = {
      page: pagination.current_page,
      per_page: pagination.per_page
    };
    
    // Ajouter les filtres de recherche si nécessaire
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }
    
    if (filters.status) {
      params.status = filters.status;
    }
    
    if (filters.agent_id) {
      params.agent_id = filters.agent_id;
    }
    
    // Log pour le débogage
    console.log('Envoi de la requête avec paramètres:', params);
    
    // Appel API
    const response = await api.getClients(params);
    
    // Log de la réponse pour débogage
    console.log('Réponse API complète:', response.data);
    
    if (response.data && response.data.status === 'success') {
      // Analyser la structure de la réponse
      const responseData = response.data;
      
      // Obtenir les données des clients - ajuster selon votre structure de réponse
      if (Array.isArray(responseData.data)) {
        // Si les clients sont directement dans data
        clients.value = responseData.data;
      } else if (responseData.data && Array.isArray(responseData.data.data)) {
        // Si les clients sont dans data.data (structure imbriquée)
        clients.value = responseData.data.data;
      }
      
      // Mettre à jour la pagination
      // Vérifier où se trouvent les métadonnées de pagination
      let metaData = null;
      
      if (responseData.meta) {
        // Cas 1: Les métadonnées sont dans response.data.meta
        metaData = responseData.meta;
      } else if (responseData.data && responseData.data.meta) {
        // Cas 2: Les métadonnées sont dans response.data.data.meta
        metaData = responseData.data.meta;
      } else if (responseData.data && !Array.isArray(responseData.data)) {
        // Cas 3: Les métadonnées sont directement dans response.data.data
        // (Extrait current_page, from, etc. directement)
        const paginationData = responseData.data;
        
        if (paginationData.current_page !== undefined) {
          metaData = {
            current_page: paginationData.current_page,
            from: paginationData.from,
            to: paginationData.to,
            total: paginationData.total,
            last_page: paginationData.last_page,
            per_page: paginationData.per_page
          };
        }
      }
      
      // Mettre à jour l'état de pagination si nous avons trouvé des métadonnées
      if (metaData) {
        pagination.current_page = metaData.current_page || 1;
        pagination.from = metaData.from || 0;
        pagination.to = metaData.to || 0;
        pagination.total = metaData.total || 0;
        pagination.last_page = metaData.last_page || 1;
        pagination.per_page = metaData.per_page || 10;
        
        console.log('Pagination mise à jour:', pagination);
      } else {
        console.warn('Aucune donnée de pagination trouvée dans la réponse');
      }
    } else {
      throw new Error('Format de réponse inattendu');
    }
  } catch (err) {
    console.error('Erreur lors du chargement des clients:', err);
    error.value = 'Une erreur est survenue lors du chargement des clients: ' + (err.message || '');
    clients.value = [];
  } finally {
    loading.value = false;
  }
};

// Fonction de recherche avec debounce
let searchTimeout = null;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.current_page = 1; // Réinitialiser à la première page lors d'une recherche
    fetchClients();
  }, 300);
};

// Changer de page
const changePage = (page) => {
  if (page < 1 || page > pagination.last_page) {
    return;
  }
  pagination.current_page = page;
  fetchClients();
};

// Obtenir la liste des numéros de page à afficher
const getVisiblePageNumbers = () => {
  const totalPages = pagination.last_page;
  const currentPage = pagination.current_page;
  
  // Si pas de pagination ou seulement une page
  if (!totalPages || totalPages <= 1) {
    return [1];
  }
  
  // Tableau pour stocker les pages à afficher
  let pages = [];
  
  // Toujours afficher la première page
  pages.push(1);
  
  // Nombre de pages à afficher de chaque côté de la page courante
  const sidesCount = 1;
  
  // Calculer la plage de pages à afficher
  let leftBound = Math.max(2, currentPage - sidesCount);
  let rightBound = Math.min(totalPages - 1, currentPage + sidesCount);
  
  // Ajuster les limites pour assurer un nombre minimum de pages affichées
  if (rightBound - leftBound < sidesCount * 2) {
    if (currentPage < totalPages / 2) {
      // Près du début, étendre vers la droite
      rightBound = Math.min(totalPages - 1, leftBound + sidesCount * 2);
    } else {
      // Près de la fin, étendre vers la gauche
      leftBound = Math.max(2, rightBound - sidesCount * 2);
    }
  }
  
  // Ajouter "..." après la première page si nécessaire
  if (leftBound > 2) {
    pages.push('...');
  }
  
  // Ajouter les pages du milieu
  for (let i = leftBound; i <= rightBound; i++) {
    pages.push(i);
  }
  
  // Ajouter "..." avant la dernière page si nécessaire
  if (rightBound < totalPages - 1) {
    pages.push('...');
  }
  
  // Toujours afficher la dernière page si elle est différente de 1
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
};

// Obtenir les initiales d'un nom
const getInitials = (firstName, lastName) => {
  return (firstName ? firstName.charAt(0) : '') + (lastName ? lastName.charAt(0) : '');
};

// Obtenir les classes CSS pour le statut
const getStatusClass = (status) => {
  const baseClass = 'px-1.5 py-0.5 inline-flex text-xs leading-4 font-normal rounded-lg';
  
  switch (status) {
    case 'active':
      return `${baseClass} bg-green-100 p-2 text-green-800`;
    case 'inactive':
      return `${baseClass} bg-gray-100 text-gray-800`;
    case 'blacklisted':
      return `${baseClass} bg-red-100 text-red-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
};

// Obtenir le libellé du statut
const getStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'inactive':
      return 'Inactif';
    case 'blacklisted':
      return 'Liste noire';
    default:
      return status;
  }
};

// Confirmer la suppression
const confirmDeleteClient = (client) => {
  clientToDelete.value = client;
  showDeleteModal.value = true;
};

// Supprimer un client
const deleteClient = async () => {
  if (!clientToDelete.value) return;
  
  deleteLoading.value = true;
  try {
    const response = await api.deleteClient(clientToDelete.value.id);
    
    if (response.data && response.data.status === 'success') {
      // Fermer la modal
      showDeleteModal.value = false;
      clientToDelete.value = null;
      
      // Rafraîchir la liste des clients
      fetchClients();
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    
    // Si le client a des prêts actifs, afficher un message spécifique
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert('Une erreur est survenue lors de la suppression du client.');
    }
  } finally {
    deleteLoading.value = false;
  }
};

// Rediriger vers les détails du client
const goToClientDetails = (clientId) => {
  router.push({ name: 'ClientDetail', params: { id: clientId } });
};

// Charger les clients au montage du composant et surveiller les changements de route
onMounted(() => {
  fetchClients();
  
  // Surveiller les changements de route avec le paramètre "refresh"
  watch(() => route.query.refresh, (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      refreshFromRoute();
    }
  });
});
</script>

<style scoped>
.btn {
  @apply inline-flex justify-center items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary;
}

.btn-secondary {
  @apply bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary;
}
</style>