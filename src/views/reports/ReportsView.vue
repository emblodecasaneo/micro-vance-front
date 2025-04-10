<template>
  <div>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <div class="flex border-b">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="[
            'px-4 py-3 text-xs font-medium',
            activeTab === tab.id 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Filtres communs -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
      <!-- Boutons de filtrage rapide -->
      <div class="mb-4">
        <label class="block text-xs font-medium text-gray-500 mb-2">Filtrage rapide</label>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="applyQuickFilter('today')"
            :class="[
              activeFilter === 'today' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors'
            ]"
          >
            Aujourd'hui
          </button>
          <button 
            @click="applyQuickFilter('thisMonth')"
            :class="[
              activeFilter === 'thisMonth' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors'
            ]"
          >
            Ce mois
          </button>
          <button 
            @click="applyQuickFilter('lastMonth')"
            :class="[
              activeFilter === 'lastMonth' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors'
            ]"
          >
            Mois dernier
          </button>
          <button 
            @click="applyQuickFilter('thisYear')"
            :class="[
              activeFilter === 'thisYear' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors'
            ]"
          >
            Cette année
          </button>
          <button 
            v-if="activeFilter"
            @click="clearQuickFilter"
            class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            Effacer le filtre
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Date de début</label>
          <input 
            type="date" 
            v-model="filters.start_date"
            class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
            />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Date de fin</label>
          <input 
            type="date" 
            v-model="filters.end_date"
            class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
            />
        </div>
        <div class="flex items-end">
          <button 
            @click="loadReport"
            class="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
          >
            Générer le rapport
          </button>
          <button 
            @click="resetFilters"
            class="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu du rapport -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="reportData">
      <div v-if="activeTab === 'loans'">
        <LoanReport :data="reportData" />
      </div>
      
      <div v-else-if="activeTab === 'repayments'">
        <RepaymentReport :data="reportData" />
      </div>
      
      <div v-else-if="activeTab === 'savings'">
        <SavingsReport :data="reportData" />
      </div>
      
      <div v-else-if="activeTab === 'clients'">
        <ClientReport :data="reportData" />
      </div>
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-sm p-6 text-center">
      <p class="text-gray-500">Sélectionnez des filtres et cliquez sur "Générer le rapport" pour afficher les données.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '@/services/api';
import LoanReport from './LoanReport.vue';
import RepaymentReport from './RepaymentReport.vue';
import SavingsReport from './SavingsReport.vue';
import ClientReport from './ClientReport.vue';
import { useToast } from '@/composables/toast';

const { showToast } = useToast();

const tabs = [
  { id: 'loans', label: 'Prêts' },
  { id: 'repayments', label: 'Remboursements' },
  { id: 'savings', label: 'Épargne' },
  { id: 'clients', label: 'Clients' }
];

const activeTab = ref('loans');
const loading = ref(false);
const reportData = ref(null);
const filters = ref({
  start_date: '',
  end_date: '',
  status: '',
  agent_id: ''
});
const activeFilter = ref(null);

// Recharger le rapport quand on change d'onglet
watch(activeTab, () => {
  if (filters.value.start_date || filters.value.end_date) {
    loadReport();
  }
});

async function loadReport() {
  loading.value = true;
  
  try {
    let response;
    
    switch (activeTab.value) {
      case 'loans':
        response = await api.getLoanReport(filters.value);
        break;
      case 'repayments':
        response = await api.getRepaymentReport(filters.value);
        break;
      case 'savings':
        response = await api.getSavingsReport(filters.value);
        break;
      case 'clients':
        response = await api.getClientReport(filters.value);
        break;
    }
    
    reportData.value = response.data.data;
  } catch (error) {
    console.error('Erreur lors du chargement du rapport:', error);
    showToast('Erreur lors du chargement du rapport', 'error');
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  activeFilter.value = null;
  filters.value = {
    start_date: '',
    end_date: '',
    status: '',
    agent_id: ''
  };
  reportData.value = null;
}

// Fonction pour appliquer les filtres rapides
function applyQuickFilter(filter) {
  // Mettre à jour le filtre actif
  activeFilter.value = filter;
  
  const today = new Date();
  let startDate, endDate;
  
  switch (filter) {
    case 'today':
      // Aujourd'hui
      startDate = formatDate(today);
      endDate = formatDate(today);
      break;
      
    case 'thisMonth':
      // Ce mois-ci (du 1er du mois actuel jusqu'à aujourd'hui)
      startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
      endDate = formatDate(today);
      break;
      
    case 'lastMonth':
      // Le mois dernier (du 1er au dernier jour du mois précédent)
      startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      endDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0));
      break;
      
    case 'thisYear':
      // Cette année (du 1er janvier de l'année en cours jusqu'à aujourd'hui)
      startDate = formatDate(new Date(today.getFullYear(), 0, 1));
      endDate = formatDate(today);
      break;
  }
  
  // Mise à jour des filtres
  filters.value.start_date = startDate;
  filters.value.end_date = endDate;
  
  // Chargement automatique du rapport avec les nouveaux filtres
  loadReport();
}

function clearQuickFilter() {
  activeFilter.value = null;
  filters.value.start_date = '';
  filters.value.end_date = '';
  loadReport();
}

// Fonction helper pour formater les dates au format YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script> 