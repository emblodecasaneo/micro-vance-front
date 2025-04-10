<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <router-link to="/loans" class="text-primary hover:text-primary-dark flex items-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs">Retour à la liste</span>
        </router-link>
        <h1 class="text-sm font-medium text-gray-800">{{ isEditMode ? 'Modifier le prêt' : 'Nouveau prêt' }}</h1>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center py-6">
      <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else class="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
      <form @submit.prevent="saveLoan">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Colonne de gauche -->
          <div class="space-y-3">
            <!-- Sélection du client -->
            <div>
              <label for="client_id" class="block text-xs font-medium text-gray-700 mb-1">Client *</label>
              <div class="relative">
                <input 
                  type="text"
                  id="client-search"
                  v-model="clientSearch"
                  @input="searchClients"
                  @focus="showClientDropdown = true"
                  placeholder="Rechercher un client par nom..."
                  class="block w-full text-xs focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                  :disabled="isEditMode"
                />
                
                <div v-if="showClientDropdown && filteredClients.length > 0 && !isEditMode" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
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
                            {{ client.id_card_number || 'Pas d\'ID' }} • {{ client.phone_number || 'Pas de téléphone' }}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div v-else-if="showClientDropdown && clientSearch && filteredClients.length === 0 && !isEditMode" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
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
                      {{ selectedClient.id_card_number || 'Pas d\'ID' }} • {{ selectedClient.phone_number || 'Pas de téléphone' }}
                    </div>
                  </div>
                  <button 
                    v-if="!isEditMode"
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
              <div v-if="errors.client_id" class="text-red-500 text-xs mt-1">{{ errors.client_id }}</div>
            </div>
            
            <!-- Montant du prêt -->
            <div>
              <label for="amount" class="block text-xs font-medium text-gray-700 mb-1">Montant (XAF) *</label>
              <input 
                id="amount" 
                type="number" 
                v-model.number="loanData.amount" 
                required
                min="1000"
                class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <div v-if="errors.amount" class="text-red-500 text-xs mt-1">{{ errors.amount }}</div>
            </div>
            
            <!-- Taux d'intérêt -->
            <div>
              <label for="interest_rate" class="block text-xs font-medium text-gray-700 mb-1">Taux d'intérêt (%) *</label>
              <input 
                id="interest_rate" 
                type="number" 
                v-model.number="loanData.interest_rate" 
                required
                min="0"
                max="100"
                step="0.01"
                class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <div v-if="errors.interest_rate" class="text-red-500 text-xs mt-1">{{ errors.interest_rate }}</div>
            </div>
            
            <!-- Durée du prêt -->
            <div>
              <label for="term_months" class="block text-xs font-medium text-gray-700 mb-1">Durée (mois) *</label>
              <input 
                id="term_months" 
                type="number" 
                v-model.number="loanData.term_months" 
                required
                min="1"
                max="60"
                class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <div v-if="errors.term_months" class="text-red-500 text-xs mt-1">{{ errors.term_months }}</div>
            </div>
          </div>

          <!-- Colonne de droite -->
          <div class="space-y-3">
            <!-- Date de début -->
            <div>
              <label for="start_date" class="block text-xs font-medium text-gray-700 mb-1">Date de début *</label>
              <input 
                id="start_date" 
                type="date" 
                v-model="loanData.start_date" 
                required
                :min="today"
                class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <div v-if="errors.start_date" class="text-red-500 text-xs mt-1">{{ errors.start_date }}</div>
            </div>
            
            <!-- Garantie du prêt -->
            <div>
              <label for="collateral_description" class="block text-xs font-medium text-gray-700 mb-1">Description de la garantie</label>
              <textarea 
                id="collateral_description" 
                v-model="loanData.collateral_description" 
                class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                rows="2"
              ></textarea>
              <div v-if="errors.collateral_description" class="text-red-500 text-xs mt-1">{{ errors.collateral_description }}</div>
            </div>
            
            <!-- Valeur de la garantie -->
            <div>
              <label for="collateral_value" class="block text-xs font-medium text-gray-700 mb-1">Valeur de la garantie (XAF)</label>
              <input 
                id="collateral_value" 
                type="number" 
                v-model.number="loanData.collateral_value" 
                min="0"
                class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <div v-if="errors.collateral_value" class="text-red-500 text-xs mt-1">{{ errors.collateral_value }}</div>
            </div>
            
            <!-- Photo de la garantie -->
            <div>
              <label for="collateral_photo_path" class="block text-xs font-medium text-gray-700 mb-1">Photo de la garantie (URL)</label>
              <input 
                id="collateral_photo_path" 
                type="text" 
                v-model="loanData.collateral_photo_path" 
                class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <div v-if="errors.collateral_photo_path" class="text-red-500 text-xs mt-1">{{ errors.collateral_photo_path }}</div>
            </div>
          </div>
        </div>
        
        <!-- Résumé du prêt (simulé) - conservé sur toute la largeur -->
        <div v-if="showSimulation" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 mt-4">
          <h3 class="text-xs font-semibold text-gray-800 mb-2">Résumé du prêt</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <p class="text-xs text-gray-500">Montant du prêt</p>
              <p class="text-xs font-medium text-gray-700">{{ formatCurrency(loanData.amount) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Intérêts totaux</p>
              <p class="text-xs font-medium text-gray-700">{{ formatCurrency(calculatedInterest) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Montant total</p>
              <p class="text-xs font-medium text-gray-700">{{ formatCurrency(calculatedTotalAmount) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Mensualité</p>
              <p class="text-xs font-medium text-gray-700">{{ formatCurrency(calculatedMonthlyPayment) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Date de début</p>
              <p class="text-xs font-medium text-gray-700">{{ formatDate(loanData.start_date) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Date de fin estimée</p>
              <p class="text-xs font-medium text-gray-700">{{ formatDate(estimatedEndDate) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Boutons d'action -->
        <div class="flex justify-between mt-4">
          <button 
            type="button" 
            @click="simulateLoan" 
            class="btn btn-secondary"
          >
            Simuler le prêt
          </button>
          <div class="flex space-x-2">
            <button 
              type="button" 
              @click="cancel" 
              class="btn btn-secondary"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="saving"
            >
              <span v-if="saving">
                <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
              <span v-else>Enregistrer</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from '@/composables/toast';

export default {
  name: 'LoanFormView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { showToast } = useToast();
    
    const loanId = route.params.id;
    const isEditMode = computed(() => !!loanId);
    
    const loanData = ref({
      client_id: '',
      amount: 0,
      interest_rate: 10,
      term_months: 12,
      start_date: new Date().toISOString().slice(0, 10),
      collateral_description: '',
      collateral_value: 0,
      collateral_photo_path: ''
    });
    
    const clients = ref([]);
    const loading = ref(false);
    const saving = ref(false);
    const errors = ref({});
    const showSimulation = ref(false);
    
    const clientSearch = ref('');
    const showClientDropdown = ref(false);
    const filteredClients = ref([]);
    const selectedClient = ref(null);
    
    // Calculer pour la simulation
    const calculatedInterest = computed(() => {
      const principal = loanData.value.amount || 0;
      const rate = (loanData.value.interest_rate || 0) / 100;
      const term = loanData.value.term_months || 0;
      return principal * rate * (term / 12);
    });
    
    const calculatedTotalAmount = computed(() => {
      return (loanData.value.amount || 0) + calculatedInterest.value;
    });
    
    const calculatedMonthlyPayment = computed(() => {
      const term = loanData.value.term_months || 1;
      return calculatedTotalAmount.value / term;
    });
    
    const estimatedEndDate = computed(() => {
      if (!loanData.value.start_date) return '';
      const date = new Date(loanData.value.start_date);
      date.setMonth(date.getMonth() + (loanData.value.term_months || 0));
      return date.toISOString().slice(0, 10);
    });
    
    const today = computed(() => {
      return new Date().toISOString().slice(0, 10);
    });
    
    // Charger les données du prêt si on est en mode édition
    const loadLoan = async () => {
      if (!isEditMode.value) {
        // Si on est en mode création et qu'un client_id est passé dans l'URL, le pré-remplir
        if (route.query.client_id) {
          try {
            const response = await api.getClient(route.query.client_id);
            if (response.data && response.data.status === 'success') {
              const client = response.data.data;
              selectedClient.value = client;
              loanData.value.client_id = client.id;
              clientSearch.value = `${client.first_name} ${client.last_name}`.trim();
            }
          } catch (error) {
            console.error('Erreur lors du chargement du client:', error);
          }
        }
        return;
      }
      
      loading.value = true;
      try {
        const response = await api.getLoan(loanId);
        const loan = response.data.data.loan;
        
        // Formater la date de début
        loan.start_date = loan.start_date ? new Date(loan.start_date).toISOString().slice(0, 10) : '';
        
        // Copier les données dans le formulaire
        Object.keys(loanData.value).forEach(key => {
          if (loan[key] !== undefined) {
            loanData.value[key] = loan[key];
          }
        });
        
        // Si le prêt a un client, charger ses informations
        if (loan.client && loan.client_id) {
          selectedClient.value = loan.client;
          clientSearch.value = `${loan.client.first_name} ${loan.client.last_name}`.trim();
        }
      } catch (error) {
        console.error('Erreur lors du chargement du prêt:', error);
        showToast('Erreur lors du chargement du prêt.', 'error');
        router.push('/loans');
      } finally {
        loading.value = false;
      }
    };
    
    // Charger la liste des clients
    const loadClients = async () => {
      try {
        const response = await api.getClients({ per_page: 100 });
        console.log('Réponse API clients:', response.data);
        
        // Vérifier la structure de la réponse et extraire les clients correctement
        if (response.data.status === 'success') {
          // Les clients sont directement dans response.data.data
          clients.value = response.data.data;
          console.log('Clients chargés:', clients.value.length);
        } else {
          console.error('Format de réponse API inattendu:', response.data);
          showToast('Format de réponse API inattendu.', 'error');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
        showToast('Erreur lors du chargement des clients.', 'error');
      }
    };
    
    // Simuler le prêt
    const simulateLoan = () => {
      showSimulation.value = true;
    };
    
    // Enregistrer le prêt
    const saveLoan = async () => {
      saving.value = true;
      errors.value = {};
      
      try {
        let response;
        
        if (isEditMode.value) {
          response = await api.updateLoan(loanId, loanData.value);
        } else {
          response = await api.createLoan(loanData.value);
        }
        
        showToast(`Prêt ${isEditMode.value ? 'mis à jour' : 'créé'} avec succès.`, 'success');
        
        // Rediriger vers la page du prêt
        const savedLoanId = isEditMode.value ? loanId : response.data.data.id;
        router.push(`/loans/${savedLoanId}`);
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du prêt:', error);
        showToast('Erreur lors de l\'enregistrement du prêt.', 'error');
        
        // Récupérer les erreurs de validation
        if (error.response && error.response.data && error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
      } finally {
        saving.value = false;
      }
    };
    
    // Annuler et retourner à la liste
    const cancel = () => {
      router.push('/loans');
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
    
    const searchClients = () => {
      // Si aucun client chargé ou si la recherche est vide
      if (!clients.value || clients.value.length === 0 || !clientSearch.value.trim()) {
        filteredClients.value = [];
        return;
      }
      
      const searchTerm = clientSearch.value.toLowerCase();
      filteredClients.value = clients.value.filter(client => {
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
    };
    
    const selectClient = (client) => {
      selectedClient.value = client;
      loanData.value.client_id = client.id;
      clientSearch.value = `${client.first_name} ${client.last_name}`.trim();
      showClientDropdown.value = false;
    };
    
    const clearSelectedClient = () => {
      selectedClient.value = null;
      loanData.value.client_id = '';
      clientSearch.value = '';
    };
    
    // Fermer le dropdown quand on clique en dehors
    const handleClickOutside = (event) => {
      if (showClientDropdown.value && !event.target.closest('#client-search')) {
        showClientDropdown.value = false;
      }
    };
    
    onMounted(() => {
      loadClients();
      loadLoan();
      document.addEventListener('click', handleClickOutside);
    });
    
    // Nettoyage lors de la destruction du composant
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      loanData,
      clients,
      loading,
      saving,
      errors,
      isEditMode,
      showSimulation,
      calculatedInterest,
      calculatedTotalAmount,
      calculatedMonthlyPayment,
      estimatedEndDate,
      today,
      loadLoan,
      simulateLoan,
      saveLoan,
      cancel,
      formatCurrency,
      formatDate,
      clientSearch,
      showClientDropdown,
      filteredClients,
      selectedClient,
      searchClients,
      selectClient,
      clearSelectedClient,
      handleClickOutside
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
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700;
}
</style> 