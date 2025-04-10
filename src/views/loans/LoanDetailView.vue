<template>
  <div>
    <!-- Barre de navigation et actions -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <router-link to="/loans" class="text-primary hover:text-primary-dark flex items-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
        <h1 class="text-sm tracking-widest font-medium text-gray-800">Détails du prêt #{{ loan.id }}</h1>
      </div>
      <div class="flex space-x-2">
        <button 
          v-if="loan.status === 'pending'" 
          @click="approveLoan" 
          class="btn btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Approuver
        </button>
        <button 
          v-if="loan.status === 'pending'" 
          @click="deleteLoan" 
          class="btn btn-danger flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Supprimer
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center py-6">
      <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else>
      <!-- Alerte si le prêt est en retard -->
      <div v-if="loan.status === 'active' && isLate" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-xs">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p>Ce prêt est actuellement en retard de paiement.</p>
          </div>
        </div>
      </div>
      
      <!-- Informations du prêt -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
          <h2 class="text-xs font-medium text-gray-700 mb-3">Informations générales</h2>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs text-gray-500">ID du prêt</p>
              <p class="text-xs font-medium text-gray-700">{{ loan.id }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Statut</p>
              <span :class="getStatusClass(loan.status)" class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStatusLabel(loan.status) }}
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-500">Client</p>
              <p class="text-xs font-medium text-gray-700">{{ clientName }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Montant</p>
              <p class="text-xs font-medium text-gray-700">{{ formatCurrency(loan.amount) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Taux d'intérêt</p>
              <p class="text-xs font-medium text-gray-700">{{ loan.interest_rate }}%</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Durée</p>
              <p class="text-xs font-medium text-gray-700">{{ loan.term_months }} mois</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Date de début</p>
              <p class="text-xs font-medium text-gray-700">{{ formatDate(loan.start_date) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Date de fin</p>
              <p class="text-xs font-medium text-gray-700">{{ formatDate(loan.end_date) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Garantie</p>
              <p class="text-xs font-medium text-gray-700">{{ loan.collateral_description || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Valeur de la garantie</p>
              <p class="text-xs font-medium text-gray-700">{{ loan.collateral_value ? formatCurrency(loan.collateral_value) : 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Créé le</p>
              <p class="text-xs font-medium text-gray-700">{{ formatDate(loan.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Approuvé par</p>
              <p class="text-xs font-medium text-gray-700">{{ loan.approver ? `${loan.approver.name}` : 'N/A' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
          <h2 class="text-xs text-gray-700 font-medium mb-3">Statistiques du prêt</h2>
          
          <div class="mb-3">
            <p class="text-xs text-gray-500 mb-1">Progression du remboursement</p>
            <div class="w-full h-3 bg-gray-200 rounded-full">
              <div 
                class="h-3 bg-primary rounded-full" 
                :style="{ width: `${stats.progress}%` }"
              ></div>
            </div>
            <p class="text-right text-xs mt-1">{{ stats.progress }}%</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs text-gray-500">Montant total à rembourser</p>
              <p class="text-xs font-medium text-gray-700">{{ formatCurrency(stats.total_amount) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Montant remboursé</p>
              <p class="text-xs font-medium text-gray-700">{{ formatCurrency(stats.paid_amount) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Reste à rembourser</p>
              <p class="text-xs font-medium text-gray-700">{{ formatCurrency(stats.remaining_amount) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Échéances payées</p>
              <p class="text-xs font-medium text-gray-700">{{ stats.paid_repayments }} / {{ stats.total_repayments }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Échéances restantes</p>
              <p class="text-xs font-medium text-gray-700">{{ stats.remaining_repayments }}</p>
            </div>
            <div v-if="loan.status === 'active'">
              <p class="text-xs text-gray-500">Jours restants</p>
              <p class="text-xs font-medium text-gray-700">{{ stats.days_remaining }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Échéancier de remboursement -->
      <div class="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
        <h2 class="text-xs text-gray-700 font-medium mb-3">Échéancier de remboursement</h2>
        
        <div v-if="loan.repayments && loan.repayments.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'échéance</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de paiement</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pénalité</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(repayment, index) in paginatedRepayments" :key="repayment.id" class="hover:bg-gray-50">
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="text-xs font-medium text-gray-600">{{ ((currentRepaymentPage - 1) * repaymentsPerPage) + index + 1 }}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="text-xs font-medium text-gray-600">{{ formatDate(repayment.due_date) }}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="text-xs font-medium text-gray-600">{{ formatCurrency(repayment.amount) }}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="text-xs font-medium text-gray-600">{{ repayment.payment_date ? formatDate(repayment.payment_date) : '-' }}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="text-xs font-medium text-gray-600">{{ repayment.penalty_amount ? formatCurrency(repayment.penalty_amount) : '-' }}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span :class="getRepaymentStatusClass(repayment.status)" class="px-2 inline-flex text-xs leading-5 font-medium rounded-lg ">
                    {{ getRepaymentStatusLabel(repayment.status) }}
                  </span>
                </td>
                <td class="py-3 px-4 whitespace-nowrap text-center">
                  <div class="relative" v-if="(repayment.status === 'pending' || repayment.status === 'late') && loan.status === 'active'">
                    <button 
                      @click="toggleActionMenu(repayment.id)"
                      class="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <div 
                      v-if="activeActionMenu === repayment.id"
                      class="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1"
                      role="menu"
                    >
                      <a 
                        href="#" 
                        @click.prevent="openPaymentModal(repayment)" 
                        class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Enregistrer un paiement
                      </a>
                      <a 
                        href="#" 
                        @click.prevent="markAsMissed(repayment)"
                        class="block px-4 py-2 text-xs text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Marquer comme manqué
                      </a>
                    </div>
                  </div>
                  <span v-else class="text-gray-400">—</span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Pagination pour les remboursements -->
          <div class="mt-4 flex justify-between items-center">
            <div class="text-xs text-gray-700">
              Affichage de {{ (currentRepaymentPage - 1) * repaymentsPerPage + 1 }} à {{ Math.min(currentRepaymentPage * repaymentsPerPage, loan.repayments.length) }} sur {{ loan.repayments.length }} échéances
            </div>
            <div class="flex space-x-1">
              <button 
                @click="goToRepaymentPage(currentRepaymentPage - 1)" 
                :disabled="currentRepaymentPage === 1" 
                :class="currentRepaymentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Précédent
              </button>
              <div v-for="page in displayedRepaymentPages" :key="page">
                <button 
                  v-if="page !== '...'" 
                  @click="goToRepaymentPage(page)"
                  :class="currentRepaymentPage === page ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                  class="px-3 py-1 text-xs border border-gray-300 rounded-md"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 py-1 text-xs">{{ page }}</span>
              </div>
              <button 
                @click="goToRepaymentPage(currentRepaymentPage + 1)" 
                :disabled="currentRepaymentPage === totalRepaymentPages" 
                :class="currentRepaymentPage === totalRepaymentPages ? 'opacity-50 cursor-not-allowed' : ''"
                class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-3 text-xs text-gray-500">
          Aucune échéance de remboursement trouvée.
        </div>
      </div>
    </div>
    
    <!-- Modal pour enregistrer un paiement -->
    <div v-if="showPaymentModal" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black opacity-50" @click="showPaymentModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-lg p-4 max-w-md w-full mx-4">
        <h3 class="text-xs font-medium text-gray-900 mb-3">Enregistrer un paiement</h3>
        <div class="mb-3">
          <div class="flex justify-between mb-2">
            <span class="text-xs text-gray-600">Échéance</span>
            <span class="text-xs font-medium">{{ selectedRepaymentIndex + 1 }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-xs text-gray-600">Date d'échéance</span>
            <span class="text-xs font-medium">{{ formatDate(selectedRepayment.due_date) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-xs text-gray-600">Montant</span>
            <span class="text-xs font-medium">{{ formatCurrency(selectedRepayment.amount) }}</span>
          </div>
          <div class="flex justify-between mb-2" v-if="isLatePayment">
            <span class="text-xs text-gray-600">Pénalité (5%)</span>
            <span class="text-xs font-medium text-red-600">{{ formatCurrency(calculatePenalty()) }}</span>
          </div>
          <div class="flex justify-between mb-2" v-if="isLatePayment">
            <span class="text-xs text-gray-600">Montant total</span>
            <span class="text-xs font-medium">{{ formatCurrency(selectedRepayment.amount + calculatePenalty()) }}</span>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="block text-xs font-medium text-gray-700 mb-1">Méthode de paiement *</label>
          <select 
            v-model="paymentData.payment_method" 
            required
            disabled
            class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="cash">Espèces</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="bank_transfer">Virement bancaire</option>
          </select>
        </div>
        
        <div class="mb-3">
          <label class="block text-xs font-medium text-gray-700 mb-1">Référence de transaction</label>
          <input 
            type="text" 
            disabled
            v-model="paymentData.transaction_reference" 
            class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="N° de transaction, reçu, etc."
          />
        </div>
        
        <div class="mb-3" v-if="isLatePayment">
          <label class="block text-xs font-medium text-gray-700 mb-1">Pénalité de retard (XAF)</label>
          <input 
            type="number" 
            v-model.number="paymentData.penalty_amount" 
            min="0"
            class="block w-full text-xs text-gray-600 py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p class="text-xs text-gray-500 mt-1">La pénalité par défaut est de 5% du montant de l'échéance.</p>
        </div>
        
        <div class="flex justify-end space-x-2 mt-4">
          <button 
            @click="showPaymentModal = false" 
            class="btn btn-secondary"
          >
            Annuler
          </button>
          <button 
            @click="recordPayment" 
            class="btn btn-primary"
            :disabled="savingPayment"
          >
            <span v-if="savingPayment">
              <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </span>
            <span v-else class="text-xs">Enregistrer le paiement</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black opacity-50" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-lg p-4 max-w-md w-full mx-4">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Confirmer la suppression</h3>
        <p class="text-xs text-gray-600 mb-4">Êtes-vous sûr de vouloir supprimer ce prêt ? Cette action est irréversible.</p>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="showDeleteModal = false" 
            class="btn btn-secondary"
          >
            Annuler
          </button>
          <button 
            @click="confirmDelete" 
            class="btn btn-danger"
            :disabled="deleting"
          >
            <span v-if="deleting">
              <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Suppression...
            </span>
            <span v-else>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from '@/composables/toast';

export default {
  name: 'LoanDetailView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { showToast } = useToast();
    
    const loan = ref({});
    const stats = ref({
      total_amount: 0,
      paid_amount: 0,
      remaining_amount: 0,
      progress: 0,
      paid_repayments: 0,
      total_repayments: 0,
      remaining_repayments: 0,
      days_remaining: 0
    });
    const isLate = ref(false);
    const loading = ref(true);
    
    // Modal de paiement
    const showPaymentModal = ref(false);
    const selectedRepayment = ref({});
    const paymentData = ref({
      payment_method: 'cash',
      transaction_reference: '',
      penalty_amount: 0
    });
    const paymentProcessing = ref(false);
    
    // Modal de suppression
    const showDeleteModal = ref(false);
    const deleting = ref(false);
    
    // Menu d'actions pour les remboursements
    const activeActionMenu = ref(null);
    
    const loanId = route.params.id;
    
    // Calculer l'index de l'échéance sélectionnée
    const selectedRepaymentIndex = computed(() => {
      if (!selectedRepayment.value || !loan.value.repayments) return -1;
      return loan.value.repayments.findIndex(r => r.id === selectedRepayment.value.id);
    });
    
    // Déterminer si le paiement est en retard
    const isLatePayment = computed(() => {
      if (!selectedRepayment.value.due_date) return false;
      const dueDate = new Date(selectedRepayment.value.due_date);
      const today = new Date();
      return today > dueDate;
    });
    
    // Calculer la pénalité pour un paiement en retard (5% par défaut)
    const calculatePenalty = () => {
      if (!selectedRepayment.value.amount) return 0;
      return Math.round(selectedRepayment.value.amount * 0.05 * 100) / 100;
    };
    
    // Nom complet du client
    const clientName = computed(() => {
      if (!loan.value.client) return 'N/A';
      return `${loan.value.client.last_name} ${loan.value.client.first_name}`;
    });
    
    // Charger les détails du prêt
    const loadLoan = async () => {
      loading.value = true;
      try {
        const response = await api.getLoan(loanId);
        loan.value = response.data.data.loan;
        stats.value = response.data.data.stats;
        isLate.value = response.data.data.is_late;
        
        // Réinitialiser la pagination des échéances
        currentRepaymentPage.value = 1;
      } catch (error) {
        console.error('Erreur lors du chargement du prêt:', error);
        showToast('Erreur lors du chargement du prêt.', 'error');
        router.push('/loans');
      } finally {
        loading.value = false;
      }
    };
    
    // Approuver un prêt
    const approveLoan = async () => {
      try {
        loading.value = true;
        await api.approveLoan(loanId);
        showToast('Prêt approuvé avec succès.', 'success');
        loadLoan();
      } catch (error) {
        console.error('Erreur lors de l\'approbation du prêt:', error);
        showToast('Erreur lors de l\'approbation du prêt.', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    // Supprimer un prêt
    const deleteLoan = async () => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce prêt ?')) {
        return;
      }
      
      try {
        loading.value = true;
        await api.deleteLoan(loanId);
        showToast('Prêt supprimé avec succès.', 'success');
        router.push('/loans');
      } catch (error) {
        console.error('Erreur lors de la suppression du prêt:', error);
        showToast('Erreur lors de la suppression du prêt.', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    // Vérifier si un remboursement est en retard
    const isRepaymentLate = (repayment) => {
      const today = new Date();
      const dueDate = new Date(repayment.due_date);
      return today > dueDate;
    };
    
    // Ouvrir le modal de paiement
    const openPaymentModal = (repayment) => {
      selectedRepayment.value = repayment;
      
      // Réinitialiser les données de paiement
      paymentData.value = {
        payment_method: 'cash',
        transaction_reference: '',
        penalty_amount: isRepaymentLate(repayment) ? Math.round(repayment.amount * 0.05 * 100) / 100 : 0
      };
      
      showPaymentModal.value = true;
    };
    
    // Enregistrer un paiement
    const recordPayment = async () => {
      paymentProcessing.value = true;
      try {
        await api.recordRepayment(loanId, selectedRepayment.value.id, paymentData.value);
        showToast('Paiement enregistré avec succès.', 'success');
        showPaymentModal.value = false;
        loadLoan(); // Recharger les données du prêt
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
        await api.missingRepayment(loanId, repayment.id);
        showToast('Remboursement marqué comme manqué.', 'success');
        loadLoan(); // Recharger les données du prêt
      } catch (error) {
        console.error('Erreur lors du marquage du remboursement:', error);
        showToast('Erreur lors du marquage du remboursement.', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    // Formater la devise
    const formatCurrency = (amount) => {
      if (!amount) return '0 XAF';
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
    
    // Obtenir la classe CSS pour le statut du prêt
    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        defaulted: 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    };
    
    // Obtenir le libellé pour le statut du prêt
    const getStatusLabel = (status) => {
      const labels = {
        pending: 'En attente',
        active: 'Actif',
        completed: 'Complété',
        defaulted: 'Défaillant'
      };
      return labels[status] || status;
    };
    
    // Obtenir la classe CSS pour le statut du remboursement
    const getRepaymentStatusClass = (status) => {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        late: 'bg-orange-100 text-orange-800',
        missed: 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    };
    
    // Obtenir le libellé pour le statut du remboursement
    const getRepaymentStatusLabel = (status) => {
      const labels = {
        pending: 'En attente',
        paid: 'Payé',
        late: 'En retard',
        missed: 'Manqué'
      };
      return labels[status] || status;
    };
    
    // Toggle le menu d'actions
    const toggleActionMenu = (id) => {
      activeActionMenu.value = activeActionMenu.value === id ? null : id;
    };
    
    // Fermer le menu d'actions si on clique en dehors
    const closeActionMenuOutside = (event) => {
      const actionMenus = document.querySelectorAll('[role="menu"]');
      const actionButtons = document.querySelectorAll('button[class^="text-gray-500"]');
      
      // Vérifier si le clic est à l'intérieur du menu ou sur le bouton
      let shouldClose = true;
      
      // Vérifier les menus
      actionMenus.forEach(menu => {
        if (menu.contains(event.target)) {
          shouldClose = false;
        }
      });
      
      // Vérifier les boutons
      actionButtons.forEach(button => {
        if (button.contains(event.target)) {
          shouldClose = false;
        }
      });
      
      // Si le clic est à l'extérieur, fermer le menu
      if (shouldClose) {
        activeActionMenu.value = null;
      }
    };
    
    // Pagination pour les échéances
    const repaymentsPerPage = 5;
    const currentRepaymentPage = ref(1);
    const totalRepaymentPages = computed(() => {
      if (!loan.value.repayments) return 1;
      return Math.ceil(loan.value.repayments.length / repaymentsPerPage);
    });
    const displayedRepaymentPages = computed(() => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalRepaymentPages.value <= maxVisiblePages) {
        // Si le nombre total de pages est inférieur ou égal au maximum de pages visibles, afficher toutes les pages
        for (let i = 1; i <= totalRepaymentPages.value; i++) {
          pages.push(i);
        }
      } else {
        // Toujours afficher la première page
        pages.push(1);
        
        // Calculer les pages intermédiaires à afficher
        let startPage = Math.max(2, currentRepaymentPage.value - 1);
        let endPage = Math.min(totalRepaymentPages.value - 1, currentRepaymentPage.value + 1);
        
        // Ajuster startPage et endPage pour afficher 3 pages au milieu
        if (startPage > 2) pages.push('...');
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        if (endPage < totalRepaymentPages.value - 1) pages.push('...');
        
        // Toujours afficher la dernière page
        if (totalRepaymentPages.value > 1) {
          pages.push(totalRepaymentPages.value);
        }
      }
      
      return pages;
    });
    const paginatedRepayments = computed(() => {
      if (!loan.value.repayments) return [];
      const start = (currentRepaymentPage.value - 1) * repaymentsPerPage;
      const end = start + repaymentsPerPage;
      return loan.value.repayments.slice(start, end);
    });
    
    // Fonction pour aller à une page spécifique
    const goToRepaymentPage = (page) => {
      currentRepaymentPage.value = page;
    };
    
    onMounted(() => {
      loadLoan();
      
      // Ajouter un gestionnaire d'événement pour fermer le menu lors d'un clic à l'extérieur
      document.addEventListener('click', closeActionMenuOutside);
    });
    
    onBeforeUnmount(() => {
      // Nettoyer l'écouteur d'événements lors de la destruction du composant
      document.removeEventListener('click', closeActionMenuOutside);
    });
    
    return {
      loan,
      stats,
      isLate,
      loading,
      showPaymentModal,
      selectedRepayment,
      paymentData,
      paymentProcessing,
      isSelectedRepaymentLate: computed(() => {
        if (!selectedRepayment.value.due_date) return false;
        const today = new Date();
        const dueDate = new Date(selectedRepayment.value.due_date);
        return today > dueDate;
      }),
      clientName,
      loadLoan,
      approveLoan,
      deleteLoan,
      isRepaymentLate,
      openPaymentModal,
      recordPayment,
      markAsMissed,
      formatCurrency,
      formatDate,
      getStatusClass,
      getStatusLabel,
      getRepaymentStatusClass,
      getRepaymentStatusLabel,
      selectedRepaymentIndex,
      isLatePayment,
      calculatePenalty,
      toggleActionMenu,
      showDeleteModal,
      deleting,
      activeActionMenu,
      repaymentsPerPage,
      currentRepaymentPage,
      totalRepaymentPages,
      displayedRepaymentPages,
      paginatedRepayments,
      goToRepaymentPage
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

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white;
}
</style> 