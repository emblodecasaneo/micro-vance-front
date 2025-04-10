<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <router-link to="/loans" class="text-primary hover:text-primary-dark flex items-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
        <h1 class="text-sm font-medium text-gray-700">Remboursements en retard</h1>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="overdueRepayments.length === 0" class="bg-white rounded-lg shadow-sm p-6 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Aucun remboursement en retard</h3>
      <p class="text-xs text-gray-500">Tous les remboursements sont à jour.</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow-sm">
      <!-- Filtres -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex-grow min-w-[200px]">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Rechercher un client..." 
              class="w-full text-xs rounded-md border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button 
            @click="loadOverdueRepayments" 
            class="btn btn-secondary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            Rafraîchir
          </button>
        </div>
      </div>

      <!-- Liste des remboursements -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prêt ID</th>
              <th scope="col" class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th scope="col" class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'échéance</th>
              <th scope="col" class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours de retard</th>
              <th scope="col" class="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="repayment in filteredRepayments" :key="repayment.id" class="hover:bg-gray-50">
              <td class="px-6 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-medium">
                    {{ getInitials(repayment.loan.client) }}
                  </div>
                  <div class="ml-3">
                    <div class="text-xs font-medium text-gray-900">
                      {{ getClientName(repayment.loan.client) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ repayment.loan.client.phone_number || 'Pas de téléphone' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-3 whitespace-nowrap text-xs text-gray-500">
                <router-link :to="`/loans/${repayment.loan.id}`" class="text-primary hover:underline">
                  #{{ repayment.loan.id }}
                </router-link>
              </td>
              <td class="px-6 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatCurrency(repayment.amount) }}
              </td>
              <td class="px-6 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(repayment.due_date) }}
              </td>
              <td class="px-6 py-3 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  {{ getDaysLate(repayment.due_date) }} jours
                </span>
              </td>
              <td class="px-6 py-3 whitespace-nowrap text-right text-xs space-x-2">
                <button
                  @click="openPaymentModal(repayment)"
                  class="btn btn-primary btn-xs"
                >
                  Payer
                </button>
                <button
                  @click="markAsMissed(repayment)"
                  class="btn btn-danger btn-xs"
                >
                  Marquer manqué
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="page > 1 ? page-- : null" 
            :disabled="page <= 1"
            class="btn btn-secondary btn-sm"
          >
            Précédent
          </button>
          <button 
            @click="page < lastPage ? page++ : null" 
            :disabled="page >= lastPage"
            class="btn btn-secondary btn-sm"
          >
            Suivant
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-xs text-gray-700">
              Affichage de <span class="font-medium">{{ (page - 1) * perPage + 1 }}</span> à <span class="font-medium">{{ Math.min(page * perPage, totalItems) }}</span> sur <span class="font-medium">{{ totalItems }}</span> remboursements
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="page > 1 ? page-- : null" 
                :disabled="page <= 1"
                class="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Précédent</span>
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button 
                @click="page < lastPage ? page++ : null" 
                :disabled="page >= lastPage"
                class="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Suivant</span>
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de paiement -->
    <div v-if="showPaymentModal" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black opacity-50" @click="showPaymentModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Enregistrer un paiement</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Détails du remboursement</label>
            <div class="bg-gray-50 p-3 rounded-md">
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span class="text-gray-500">Client:</span>
                  <p class="font-medium">{{ getClientName(selectedRepayment.loan?.client) }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Prêt ID:</span>
                  <p class="font-medium">#{{ selectedRepayment.loan?.id }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Montant:</span>
                  <p class="font-medium">{{ formatCurrency(selectedRepayment.amount) }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Date d'échéance:</span>
                  <p class="font-medium">{{ formatDate(selectedRepayment.due_date) }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label for="payment_method" class="block text-xs font-medium text-gray-700 mb-1">Méthode de paiement *</label>
            <select 
              id="payment_method" 
              v-model="paymentData.payment_method" 
              class="block w-full text-xs rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="cash">Espèces</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Virement bancaire</option>
            </select>
          </div>
          
          <div v-if="paymentData.payment_method !== 'cash'">
            <label for="transaction_reference" class="block text-xs font-medium text-gray-700 mb-1">Référence de transaction</label>
            <input 
              id="transaction_reference" 
              type="text" 
              v-model="paymentData.transaction_reference" 
              class="block w-full text-xs rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label for="penalty_amount" class="block text-xs font-medium text-gray-700 mb-1">Montant de pénalité</label>
            <input 
              id="penalty_amount" 
              type="number" 
              v-model.number="paymentData.penalty_amount" 
              min="0"
              step="0.01"
              class="block w-full text-xs rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
            <p class="mt-1 text-xs text-gray-500">
              Une pénalité de 5% ({{ formatCurrency(selectedRepayment.amount * 0.05) }}) est appliquée par défaut pour les paiements en retard.
            </p>
          </div>
          
          <div>
            <p class="text-xs font-medium text-gray-700">Montant total à payer</p>
            <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(selectedRepayment.amount + paymentData.penalty_amount) }}</p>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-2">
          <button 
            @click="showPaymentModal = false" 
            class="btn btn-secondary"
          >
            Annuler
          </button>
          <button 
            @click="recordPayment" 
            class="btn btn-primary"
            :disabled="paymentProcessing"
          >
            <span v-if="paymentProcessing">
              <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </span>
            <span v-else>Enregistrer le paiement</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from '@/composables/toast';

export default {
  name: 'RepaymentOverdueView',
  setup() {
    const router = useRouter();
    const { showToast } = useToast();
    
    const loading = ref(true);
    const overdueRepayments = ref([]);
    const searchQuery = ref('');
    const page = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);
    const lastPage = ref(1);
    
    // Modal de paiement
    const showPaymentModal = ref(false);
    const selectedRepayment = ref({});
    const paymentData = ref({
      payment_method: 'cash',
      transaction_reference: '',
      penalty_amount: 0
    });
    const paymentProcessing = ref(false);
    
    // Charger les remboursements en retard
    const loadOverdueRepayments = async () => {
      loading.value = true;
      try {
        const response = await api.getOverdueRepayments({
          page: page.value,
          per_page: perPage.value
        });
        
        overdueRepayments.value = response.data.data.data;
        totalItems.value = response.data.data.total;
        lastPage.value = response.data.data.last_page;
      } catch (error) {
        console.error('Erreur lors du chargement des remboursements en retard:', error);
        showToast('Erreur lors du chargement des remboursements en retard.', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    // Filtrer les remboursements par recherche
    const filteredRepayments = computed(() => {
      if (!searchQuery.value) return overdueRepayments.value;
      
      const query = searchQuery.value.toLowerCase();
      return overdueRepayments.value.filter(repayment => {
        const client = repayment.loan.client;
        if (!client) return false;
        
        const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
        const phone = (client.phone_number || '').toLowerCase();
        
        return fullName.includes(query) || phone.includes(query);
      });
    });
    
    // Observer les changements de page
    watch(page, () => {
      loadOverdueRepayments();
    });
    
    // Formater la devise
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF'
      }).format(amount || 0);
    };
    
    // Formater la date
    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A';
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    };
    
    // Obtenir le nombre de jours de retard
    const getDaysLate = (dueDate) => {
      if (!dueDate) return 0;
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = Math.abs(today - due);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };
    
    // Obtenir les initiales du client
    const getInitials = (client) => {
      if (!client) return 'N/A';
      return (client.first_name?.charAt(0) || '') + (client.last_name?.charAt(0) || '');
    };
    
    // Obtenir le nom complet du client
    const getClientName = (client) => {
      if (!client) return 'N/A';
      return `${client.first_name || ''} ${client.last_name || ''}`.trim();
    };
    
    // Ouvrir le modal de paiement
    const openPaymentModal = (repayment) => {
      selectedRepayment.value = repayment;
      
      // Réinitialiser les données de paiement avec 5% de pénalité par défaut pour les paiements en retard
      paymentData.value = {
        payment_method: 'cash',
        transaction_reference: '',
        penalty_amount: Math.round(repayment.amount * 0.05 * 100) / 100
      };
      
      showPaymentModal.value = true;
    };
    
    // Enregistrer un paiement
    const recordPayment = async () => {
      paymentProcessing.value = true;
      try {
        await api.recordRepayment(
          selectedRepayment.value.loan.id, 
          selectedRepayment.value.id, 
          paymentData.value
        );
        
        showToast('Paiement enregistré avec succès.', 'success');
        showPaymentModal.value = false;
        loadOverdueRepayments(); // Recharger les remboursements
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du paiement:', error);
        showToast('Erreur lors de l\'enregistrement du paiement.', 'error');
      } finally {
        paymentProcessing.value = false;
      }
    };
    
    // Marquer un remboursement comme manqué
    const markAsMissed = async (repayment) => {
      if (!confirm('Êtes-vous sûr de vouloir marquer ce remboursement comme manqué ?')) {
        return;
      }
      
      try {
        loading.value = true;
        await api.missingRepayment(repayment.loan.id, repayment.id);
        showToast('Remboursement marqué comme manqué.', 'success');
        loadOverdueRepayments(); // Recharger les remboursements
      } catch (error) {
        console.error('Erreur lors du marquage du remboursement comme manqué:', error);
        showToast('Erreur lors du marquage du remboursement comme manqué.', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(() => {
      loadOverdueRepayments();
    });
    
    return {
      loading,
      overdueRepayments,
      searchQuery,
      page,
      perPage,
      totalItems,
      lastPage,
      filteredRepayments,
      showPaymentModal,
      selectedRepayment,
      paymentData,
      paymentProcessing,
      formatCurrency,
      formatDate,
      getDaysLate,
      getInitials,
      getClientName,
      loadOverdueRepayments,
      openPaymentModal,
      recordPayment,
      markAsMissed
    };
  }
};
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
</style> 