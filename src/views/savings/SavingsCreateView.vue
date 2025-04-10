<template>
  <div>
    <!-- En-tête avec bouton de retour -->
    <div class="flex items-center mb-6">
      <router-link to="/savings" class="text-gray-500 hover:text-gray-700 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <h1 class="text-sm font-medium text-gray-700 ml-2">Nouveau compte</h1>
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
      <div class="flex">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-sm text-red-700">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Formulaire de création de compte d'épargne -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-4 bg-primary bg-opacity-10 border-b border-gray-200">
        <h3 class="text-sm font-medium text-primary">Informations du compte</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="createAccount">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sélection du client -->
            <div class="col-span-2">
              <label for="client" class="block text-xs font-medium text-gray-700 mb-1">Client <span class="text-red-500">*</span></label>
              <div class="relative">
                <input 
                  type="text"
                  id="client-search"
                  v-model="clientSearch"
                  @input="searchClients"
                  @focus="showClientDropdown = true"
                  placeholder="Rechercher un client par nom..."
                  class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                />
                
                <div v-if="showClientDropdown && filteredClients.length > 0" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <ul class="max-h-60 overflow-auto">
                    <li 
                      v-for="client in filteredClients" 
                      :key="client.id" 
                      @click="selectClient(client)"
                      class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-medium">
                          {{ client.first_name.charAt(0).toUpperCase() + client.last_name.charAt(0).toUpperCase() }}
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ client.first_name }} {{ client.last_name }}</div>
                          <div class="text-xs text-gray-500">
                            {{ client.id_card_number }} • {{ client.phone_number || 'Pas de téléphone' }}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div v-else-if="showClientDropdown && clientSearch && filteredClients.length === 0" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <div class="px-4 py-2 text-sm text-gray-500">
                    Aucun client trouvé. <router-link to="/clients/new" class="text-primary hover:underline">Créer un nouveau client</router-link>
                  </div>
                </div>
              </div>
              
              <!-- Client sélectionné -->
              <div v-if="selectedClient" class="mt-3 p-3 bg-gray-50 rounded-md">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-medium">
                    {{ selectedClient.first_name.charAt(0).toUpperCase() + selectedClient.last_name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-3 flex-grow">
                    <div class="text-sm font-medium text-gray-900">{{ selectedClient.first_name }} {{ selectedClient.last_name }}</div>
                    <div class="text-xs text-gray-500">
                      {{ selectedClient.id_card_number }} • {{ selectedClient.phone_number || 'Pas de téléphone' }}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    @click="clearSelectedClient" 
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Montant initial -->
            <div>
              <label for="balance" class="block text-xs font-medium text-gray-700 mb-1">Montant initial <span class="text-red-500">*</span></label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 text-xs sm:text-xs">FCFA</span>
                </div>
                <input 
                  type="number"
                  id="balance"
                  v-model="formData.balance"
                  min="0"
                  required
                  placeholder="0"
                  class="pl-16 text-xs block focus:ring-primary focus:border-primary focus:outline-none w-full rounded-md h-[34px] px-3 border border-gray-300"
                />
              </div>
            </div>
            
            <!-- Taux d'intérêt -->
            <div>
              <label for="interest_rate" class="block text-xs font-medium text-gray-700 mb-1">Taux d'intérêt (%) <span class="text-red-500">*</span></label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  type="number"
                  id="interest_rate"
                  v-model="formData.interest_rate"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  placeholder="0.00"
                  class="pr-8 block w-full focus:ring-primary focus:border-primary text-xs rounded-md h-[34px] px-3 border focus:outline-none border-gray-300"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 text-xs sm:text-xs">%</span>
                </div>
              </div>
            </div>
            
            <!-- Numéro de compte -->
            <div>
              <label for="account_number" class="block text-xs font-medium text-gray-700 mb-1">Numéro de compte <span class="text-gray-400 font-normal">(Optionnel)</span></label>
              <input 
                type="text"
                id="account_number"
                disabled
                v-model="formData.account_number"
                placeholder="Généré automatiquement si vide"
                class="block w-full focus:ring-primary focus:border-primary rounded-md h-[34px] px-3 border focus:outline-none text-xs border-gray-300"
              />
              <p class="text-xs text-gray-500 mt-1">Laissez vide pour une génération automatique.</p>
            </div>
            
            <!-- Date d'ouverture -->
            <div>
              <label for="opening_date" class="block text-xs font-medium text-gray-700 mb-1">Date d'ouverture <span class="text-red-500">*</span></label>
              <input 
                type="date"
                id="opening_date"
                v-model="formData.opening_date"
                required
                class="block w-full focus:ring-primary focus:border-primary text-xs focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
              />
            </div>
            
            <!-- Statut -->
            <div>
              <label for="status" class="block text-xs font-medium text-gray-700 mb-1">Statut <span class="text-red-500">*</span></label>
              <select 
                id="status"
                v-model="formData.status"
                required
                disabled
                class="block w-full focus:ring-primary focus:border-primary rounded-md text-xs h-[34px] focus:outline-none px-3 border border-gray-300"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <router-link 
              to="/savings" 
              class="btn btn-secondary mr-2"
            >
              Annuler
            </router-link>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading || !selectedClient"
            >
              <div class="flex items-center">
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Créer le compte
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToastStore } from '@/store/toast';
import api from '@/services/api';

const router = useRouter();
const store = useStore();
const toastStore = useToastStore();

// Data
const clients = ref([]);
const loadingClients = ref(false);
const formData = ref({
  client_id: '',
  balance: 0,
  interest_rate: 3.5,
  status: 'active',
  opening_date: new Date().toISOString().split('T')[0],
  account_number: ''
});
const loading = computed(() => store.getters['savings/isLoading']);
const errors = ref({});
const errorMessage = ref('');
const submitting = ref(false);

// Recherche de clients
const clientSearch = ref('');
const allClients = ref([]);
const filteredClients = ref([]);
const showClientDropdown = ref(false);
const selectedClient = ref(null);

// Charger la liste des clients au montage du composant
onMounted(async () => {
  await fetchClients();
  document.addEventListener('click', handleClickOutside);
});

// Récupérer la liste des clients
const fetchClients = async () => {
  loadingClients.value = true;
  try {
    const response = await api.getClients({ per_page: 100 });
    console.log('Réponse API clients:', response.data);
    
    // Vérifier la structure de la réponse et extraire les clients
    if (response.data.status === 'success') {
      // Les clients sont directement dans response.data.data
      clients.value = response.data.data;
      allClients.value = response.data.data;
      console.log('Clients chargés:', clients.value.length);
    } else {
      errorMessage.value = 'Format de réponse API inattendu';
      console.error('Format de réponse API inattendu:', response.data);
    }
  } catch (err) {
    console.error('Erreur lors du chargement des clients:', err);
    toastStore.error('Impossible de charger la liste des clients');
    errorMessage.value = 'Impossible de charger la liste des clients';
  } finally {
    loadingClients.value = false;
  }
};

// Filtrer les clients en fonction de la recherche
const searchClients = () => {
  console.log('Recherche de clients avec:', clientSearch.value);
  console.log('État de allClients:', { length: allClients.value?.length, isDefined: !!allClients.value });
  
  // Si allClients n'est pas encore chargé
  if (!allClients.value || allClients.value.length === 0) {
    console.log('Aucun client chargé, tentative de chargement...');
    // Si nous n'avons pas encore chargé les clients, essayons de le faire
    if (!loadingClients.value) {
      fetchClients();
    }
    filteredClients.value = [];
    return;
  }
  
  // Si la recherche est vide, ne pas afficher de suggestions
  if (clientSearch.value.trim() === '') {
    console.log('Recherche vide, aucun résultat affiché');
    filteredClients.value = [];
    return;
  }
  
  // Recherche avec le terme saisi
  const searchTerm = clientSearch.value.toLowerCase();
  console.log('Terme de recherche:', searchTerm);
  
  // Filtrer les clients qui correspondent à la recherche
  try {
    filteredClients.value = allClients.value.filter(client => {
      // Protection contre les valeurs null/undefined
      const firstName = client.first_name || '';
      const lastName = client.last_name || '';
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const phone = (client.phone_number || '').toLowerCase();
      const email = (client.email || '').toLowerCase();
      const idCard = (client.id_card_number || '').toLowerCase();
      
      return fullName.includes(searchTerm) || 
             phone.includes(searchTerm) || 
             email.includes(searchTerm) || 
             idCard.includes(searchTerm);
    });
    
    console.log(`Résultats de recherche: ${filteredClients.value.length} clients trouvés`);
    
    // Si la recherche ne donne aucun résultat mais que le terme existe, afficher un message
    if (filteredClients.value.length === 0) {
      console.log('Aucun client ne correspond à la recherche');
    }
  } catch (error) {
    console.error('Erreur lors du filtrage des clients:', error);
    errorMessage.value = 'Erreur lors de la recherche de clients';
    filteredClients.value = [];
  }
};

// Sélectionner un client
const selectClient = (client) => {
  console.log('Client sélectionné:', client);
  
  // Vérifier que le client a un ID valide
  if (!client || !client.id) {
    console.error('Client invalide sélectionné:', client);
    errorMessage.value = 'Client invalide sélectionné';
    return;
  }
  
  selectedClient.value = client;
  formData.value.client_id = client.id;
  console.log('ID client défini dans le formulaire:', formData.value.client_id);
  
  // Construire le nom complet pour l'affichage
  const firstName = client.first_name || '';
  const lastName = client.last_name || '';
  clientSearch.value = `${firstName} ${lastName}`.trim();
  
  // Masquer la liste déroulante
  showClientDropdown.value = false;
};

// Effacer le client sélectionné
const clearSelectedClient = () => {
  selectedClient.value = null;
  formData.value.client_id = '';
  clientSearch.value = '';
};

// Fermer le dropdown quand on clique en dehors
const handleClickOutside = (event) => {
  if (showClientDropdown.value && !event.target.closest('#client-search')) {
    showClientDropdown.value = false;
  }
};

// Fonction de soumission du formulaire
const createAccount = async () => {
  submitting.value = true;
  errors.value = {};
  errorMessage.value = ''; // Réinitialiser le message d'erreur
  
  // Validation simple
  if (!selectedClient.value) {
    errors.value.client_id = 'Veuillez sélectionner un client';
    errorMessage.value = 'Veuillez sélectionner un client';
    submitting.value = false;
    return;
  }
  
  if (formData.value.balance < 0) {
    errors.value.balance = 'Le solde initial ne peut pas être négatif';
    errorMessage.value = 'Le solde initial ne peut pas être négatif';
    submitting.value = false;
    return;
  }
  
  try {
    const result = await store.dispatch('savings/createAccount', formData.value);
    
    if (result.success) {
      toastStore.success('Compte d\'épargne créé avec succès');
      // Rediriger vers la page de détails du compte
      router.push(`/savings/${result.data.id}`);
    } else {
      if (result.errors) {
        errors.value = result.errors;
        errorMessage.value = 'Veuillez corriger les erreurs dans le formulaire.';
      } else {
        errorMessage.value = 'Erreur lors de la création du compte d\'épargne';
        toastStore.error('Erreur lors de la création du compte d\'épargne');
      }
    }
  } catch (err) {
    console.error('Erreur lors de la création du compte:', err);
    errorMessage.value = 'Une erreur est survenue lors de la création du compte d\'épargne';
    toastStore.error('Une erreur est survenue lors de la création du compte d\'épargne');
  } finally {
    submitting.value = false;
  }
};

// Nettoyer les événements lors de la destruction du composant
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script> 