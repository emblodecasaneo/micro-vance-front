<template>
  <div>
    <!-- En-tête avec bouton de retour -->
    <div class="flex items-center mb-6">
      <router-link :to="`/savings/${accountId}`" class="text-gray-500 hover:text-gray-700 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <h1 class="text-sm font-medium tracking-widest text-gray-600 ml-2">Retrait sur compte d'épargne</h1>
    </div>

    <!-- État de chargement -->
    <div v-if="loadingAccount" class="bg-white shadow rounded-lg p-6 text-center text-gray-500">
      <svg class="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p>Chargement des informations du compte...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
      <div class="flex">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-sm text-red-700">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Formulaire de retrait -->
    <div v-else-if="account" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Informations du compte -->
      <div class="md:col-span-1">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 bg-blue-50 border-b border-gray-200">
            <h3 class="text-xs font-semibold text-blue-700">Informations du compte</h3>
          </div>
          <div class="p-4 space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <span class="text-xs text-gray-500">N° Compte:</span>
              <span class="text-xs font-medium text-gray-800">{{ account.account_number }}</span>
              
              <span class="text-xs text-gray-500">Client:</span>
              <span class="text-xs font-medium text-gray-800">
                {{ account.client ? `${account.client.first_name} ${account.client.last_name}` : 'N/A' }}
              </span>
              
              <span class="text-xs text-gray-500">Solde actuel:</span>
              <span class="text-xs font-bold text-blue-600">{{ formatCurrency(account.balance) }}</span>
              
              <span class="text-xs text-gray-500">Statut:</span>
              <span 
                class="px-2 w-[70px] inline-flex text-xs leading-5 font-semibold rounded-lg" 
                :class="{
                  'bg-green-100 text-green-800': account.status === 'active',
                  'bg-yellow-100 text-yellow-800': account.status === 'inactive',
                  'bg-red-100 text-red-800': account.status === 'closed'
                }">
                {{ getStatusText(account.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Informations du client -->
        <div class="bg-white mt-6 shadow rounded-lg overflow-hidden">
            <div class="p-4 bg-primary bg-opacity-5 border-b border-gray-200">
              <h3 class="text-xs font-semibold text-primary">Informations du client associé</h3>
            </div>
            <div class="p-4 space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <span class="text-xs text-gray-500">Nom :</span>
                <span class="text-xs font-medium text-gray-800">{{ account.client.first_name }}</span>
                
                <span class="text-xs text-gray-500">Prénom :</span>
                <span class="text-xs font-medium text-gray-800">
                  {{ account.client.last_name }}
                </span>
                
                <span class="text-xs text-gray-500">Téléphone :</span>
                <span class="text-xs font-medium text-gray-800">{{ account.client.phone_number }}</span>
                
                <span class="text-xs text-gray-500">Statut:</span>
                <span 
                  class="px-2 w-[70px] inline-flex text-xs leading-5 font-semibold rounded-lg" 
                  :class="{
                    'bg-green-100 text-green-800': account.client.status === 'active',
                    'bg-yellow-100 text-yellow-800': account.client.status === 'inactive',
                    'bg-red-100 text-red-800': account.client.status === 'closed'
                  }">
                  {{ getStatusText(account.status) }}
                </span>
              </div>
            </div>
          </div>
          
      </div>
      
      <!-- Formulaire de retrait -->
      <div class="md:col-span-2">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 bg-primary bg-opacity-10 border-b border-gray-200">
            <h3 class="text-xs font-semibold text-primary">Effectuer un retrait</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="handleWithdraw">
              <!-- Montant du retrait -->
              <div class="mb-4">
                <label for="amount" class="block text-xs font-medium text-gray-700 mb-1">Montant du retrait <span class="text-red-500">*</span></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 text-xs sm:text-xs">FCFA</span>
                  </div>
                  <input 
                    type="number"
                    id="amount"
                    v-model="withdrawData.amount"
                    min="0.01"
                    :max="account.balance"
                    step="0.01"
                    required
                    placeholder="0.00"
                    class="pl-16 block w-full focus:outline-none focus:ring-primary focus:border-primary text-xs rounded-md h-[34px] px-3 border border-gray-300"
                    :disabled="processing"
                  />
                </div>
                <p v-if="formErrors.amount" class="mt-1 text-xs text-red-600">
                  {{ formErrors.amount }}
                </p>
                <p v-else-if="withdrawData.amount > 0 && withdrawData.amount <= account.balance" class="mt-1 text-xs text-blue-600">
                  Nouveau solde après retrait: {{ formatCurrency(parseFloat(account.balance) - parseFloat(withdrawData.amount)) }}
                </p>
              </div>
              
              <!-- Mode de paiement -->
              <div class="mb-4">
                <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-1">Mode de paiement <span class="text-red-500">*</span></label>
                <select 
                  id="payment_method"
                  v-model="withdrawData.payment_method"
                  required
                  disabled
                  class="block w-full text-xs rounded-md border-gray-300 h-[34px] px-3"
                  :disabled="processing"
                >
                  <option value="cash">Espèces</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="transfer">Virement bancaire</option>
                  <option value="check">Chèque</option>
                </select>
              </div>
              
              <!-- Description -->
              <div class="mb-4">
                <label for="description" class="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  id="description"
                  v-model="withdrawData.description"
                  rows="1"
                  disabled
                  placeholder="Description du retrait (optionnel)"
                  class="block text-xs text-gray-800 w-full rounded-md p-3 border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                  :disabled="processing"
                ></textarea>
              </div>
              
              <div class="mt-6 flex justify-end">
                <router-link 
                  :to="`/savings/${accountId}`" 
                  class="btn btn-success mr-2"
                  :disabled="processing"
                >
                  Annuler
                </router-link>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="processing || !isFormValid"
                >
                  <div class="flex items-center">
                    <svg v-if="processing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Valider le retrait
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToastStore } from '@/store/toast';

const route = useRoute();
const router = useRouter();
const store = useStore();
const toastStore = useToastStore();

const accountId = route.params.id;
const loading = computed(() => store.getters['savings/isLoading']);
const account = computed(() => store.getters['savings/getAccount']);
const error = computed(() => store.getters['savings/getError']);

const withdrawData = ref({
  amount: '5000',
  description: 'Retrait en espèces par le client',
  payment_method: 'cash',
  transaction_date: new Date().toISOString().split('T')[0]
});
const formErrors = ref({});
const processing = ref(false);

// Charger les détails du compte au montage du composant
onMounted(async () => {
  await loadAccountDetails();
});

// Variables pour gérer l'état de chargement et les erreurs
const loadingAccount = ref(false);
const errorMessage = ref('');

// Récupérer les informations du compte d'épargne
const loadAccountDetails = async () => {
  loadingAccount.value = true;
  errorMessage.value = '';
  
  try {
    await store.dispatch('savings/fetchAccount', accountId);
    
    if (error.value) {
      errorMessage.value = error.value;
      toastStore.error('Erreur lors du chargement des informations du compte');
      return;
    }
    
    // Vérifier que le compte est actif
    if (account.value && account.value.status !== 'active') {
      errorMessage.value = 'Ce compte n\'est pas actif. Les retraits ne sont autorisés que sur les comptes actifs.';
      toastStore.error(errorMessage.value);
      // Rediriger vers la page de détails
      router.push(`/savings/${accountId}`);
    }
  } catch (err) {
    console.error('Erreur lors du chargement du compte:', err);
    errorMessage.value = 'Une erreur est survenue lors du chargement des informations du compte';
    toastStore.error(errorMessage.value);
  } finally {
    loadingAccount.value = false;
  }
};

// Effectuer un retrait sur le compte
const handleWithdraw = async () => {
  // Réinitialiser les erreurs
  formErrors.value = {};
  
  // Validation simple
  if (!withdrawData.value.amount || parseFloat(withdrawData.value.amount) <= 0) {
    formErrors.value.amount = 'Veuillez entrer un montant valide';
    return;
  }
  
  if (account.value && parseFloat(withdrawData.value.amount) > account.value.balance) {
    formErrors.value.amount = 'Le montant du retrait ne peut pas dépasser le solde du compte';
    return;
  }
  
  if (!withdrawData.value.payment_method) {
    formErrors.value.payment_method = 'Veuillez sélectionner un mode de paiement';
    return;
  }
  
  if (!withdrawData.value.transaction_date) {
    formErrors.value.transaction_date = 'Veuillez spécifier une date de transaction';
    return;
  }
  
  processing.value = true;
  
  try {
    const result = await store.dispatch('savings/withdrawFromAccount', {
      accountId,
      withdrawData: withdrawData.value
    });
    
    if (result.success) {
      toastStore.success('Retrait effectué avec succès');
      // Rediriger vers la page de détails du compte
      router.push(`/savings/${accountId}`);
    } else {
      if (result.errors) {
        formErrors.value = result.errors;
      } else {
        toastStore.error('Erreur lors du retrait');
      }
    }
  } catch (err) {
    console.error('Erreur lors du retrait:', err);
    toastStore.error('Une erreur est survenue lors du retrait');
  } finally {
    processing.value = false;
  }
};

// Formatter la monnaie
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF', // FCFA
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

// Annuler l'opération et retourner à la page précédente
const cancelOperation = () => {
  router.back();
};

// Valider le montant du retrait
const validateAmount = () => {
  const amount = parseFloat(withdrawData.value.amount);
  
  if (isNaN(amount) || amount <= 0) {
    formErrors.value.amount = 'Le montant doit être supérieur à 0';
    return false;
  }
  
  if (amount > parseFloat(account.value?.balance || 0)) {
    formErrors.value.amount = 'Le montant ne peut pas dépasser le solde actuel';
    return false;
  }
  
  formErrors.value.amount = '';
  return true;
};

// Validation du formulaire
const isFormValid = computed(() => {
  if (formErrors.value.amount) {
    return false;
  }
  
  const amount = parseFloat(withdrawData.value.amount);
  if (isNaN(amount) || amount <= 0 || amount > parseFloat(account.value?.balance || 0)) {
    return false;
  }
  
  if (withdrawData.value.payment_method !== 'cash' && !withdrawData.value.reference_number) {
    return false;
  }
  
  return true;
});

// Obtenir le texte du statut du compte
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
</script> 