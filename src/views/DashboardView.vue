<template>
  <div>
    
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else>
      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Carte pour les clients -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex border-b border-gray-100 py-2 items-center">
            <div class="rounded-full bg-primary bg-opacity-10 p-2 mr-3">
              <UserGroupIcon class="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 class="text-sm font-medium text-gray-600">Clients</h2>
              <p class="text-sm font-medium mt-1 text-gray-800">{{ stats.clients || 0 }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <p class="text-xs text-gray-500">Actifs : {{ stats.activeClients || 0 }}</p> 
            <router-link to="/clients" class="text-primary hover:text-primary-dark text-xs flex items-center">
              Détails
              <ArrowRightIcon class="h-3 w-3 ml-1" />
            </router-link>
          </div>
        </div>
        
        <!-- Carte pour les prêts -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex border-b border-gray-100 py-2 items-center">
            <div class="rounded-full bg-secondary bg-opacity-10 p-2 mr-3">
              <BanknotesIcon class="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 class="text-sm font-medium text-gray-600">Prêts</h2>
              <p class="text-sm font-semibold mt-1 text-gray-700">{{ stats.loans || 0 }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <p class="text-xs text-gray-500">Actifs : {{ stats.activeLoans || 0 }}</p>
            <router-link to="/loans" class="text-primary hover:text-primary-dark text-xs flex items-center">
              Détails
              <ArrowRightIcon class="h-3 w-3 ml-1" />
            </router-link>
          </div>
        </div>
        
        <!-- Carte pour l'épargne -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-info bg-opacity-10 p-2 mr-3">
              <CurrencyDollarIcon class="h-5 w-5 text-info" />
            </div>
            <div>
              <h2 class="text-sm font-medium text-gray-600">Épargne</h2>
              <p class="text-sm font-semibold mt-1 text-gray-700">{{ formatCurrency(stats.savingsTotal || 0) }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <p class="text-xs text-gray-500">Comptes actifs : {{ stats.savingsAccounts || 0 }}</p>
            <router-link to="/savings" class="text-primary hover:text-primary-dark text-xs flex items-center">
              Détails
              <ArrowRightIcon class="h-3 w-3 ml-1" />
            </router-link>
          </div>
        </div>
        
        <!-- Carte pour les remboursements -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-accent bg-opacity-10 p-2 mr-3">
              <CalendarIcon class="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 class="text-sm font-medium text-gray-600">Échéances</h2>
              <p class="text-lg font-semibold mt-1 text-gray-800">{{ stats.upcomingRepayments || 0 }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <p class="text-xs text-gray-500">À venir (30j)</p>
            <router-link to="/loans/overdue" class="text-primary hover:text-primary-dark text-xs flex items-center">
              Voir en retard
              <ArrowRightIcon class="h-3 w-3 ml-1" />
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Section de graphiques et transactions récentes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <!-- Graphique d'évolution -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-sm font-medium text-gray-600">Évolution des activités</h2>
            <div class="flex space-x-2">
              <button class="px-2 py-1 text-xs rounded-md bg-primary text-white">Mois</button>
              <button class="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">Semaine</button>
              <button class="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">Jour</button>
            </div>
          </div>
          <div class="h-64 w-full">
            <!-- Simulation d'un graphique -->
            <div class="relative h-full w-full">
              <!-- Lignes horizontales de la grille -->
              <div class="absolute inset-0 flex flex-col justify-between">
                <div v-for="i in 5" :key="i" class="h-px w-full bg-gray-100"></div>
              </div>

              <!-- Axe Y (valeurs) -->
              <div class="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500">
                <div>1M FCFA</div>
                <div>800k</div>
                <div>600k</div>
                <div>400k</div>
                <div>200k</div>
                <div>0</div>
              </div>

              <!-- Graphique avec courbe pour Prêts et Épargne -->
              <div class="absolute inset-0 pl-12">
                <!-- Barres - utilisant les données dynamiques -->
                <div class="h-full flex items-end space-x-6 pt-6 pb-5 relative">
                  <!-- Lignes de tendance -->
                  <svg class="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                    <!-- Courbe pour les prêts -->
                    <polyline 
                      :points="getGraphPoints('loans')" 
                      fill="none" 
                      stroke="rgba(59, 130, 246, 0.7)" 
                      stroke-width="2"
                      class="polyline-loans"
                    />
                    <!-- Courbe pour les épargnes -->
                    <polyline 
                      :points="getGraphPoints('savings')" 
                      fill="none" 
                      stroke="rgba(236, 72, 153, 0.7)" 
                      stroke-width="2"
                      class="polyline-savings"
                    />
                  </svg>
                  
                  <div v-for="(monthData, index) in graphData" :key="index" class="flex flex-col items-center relative z-10" style="flex-grow: 1;">
                    <div class="flex space-x-1">
                      <!-- Barre pour les prêts -->
                      <div 
                        class="w-3 bg-primary rounded-t-sm" 
                        :style="`height: ${getHeightPercentage(monthData.loans, getMaxValue(graphData, 'loans'))}%`"
                      ></div>
                      <!-- Barre pour les épargnes -->
                      <div 
                        class="w-3 bg-accent rounded-t-sm" 
                        :style="`height: ${getHeightPercentage(monthData.savings, getMaxValue(graphData, 'savings'))}%`"
                      ></div>
                    </div>
                    <!-- Mois sur l'axe X -->
                    <div class="text-xs text-gray-500 mt-2">{{ monthData.month }}</div>
                  </div>
                </div>
              </div>

              <!-- Légende -->
              <div class="absolute right-0 top-0 flex items-center space-x-4">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-primary rounded-sm mr-1"></div>
                  <span class="text-xs text-gray-600">Prêts</span>
                </div>
        <div class="flex items-center">
                  <div class="w-3 h-3 bg-accent rounded-sm mr-1"></div>
                  <span class="text-xs text-gray-600">Épargne</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dernières transactions -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xs font-medium text-gray-500">Dernières transactions</h2>
            <router-link to="/savings" class="text-primary hover:text-primary-dark text-xs flex items-center">
              Voir tout
              <ArrowRightIcon class="h-3 w-3 ml-1" />
            </router-link>
          </div>
          
          <div class="space-y-3">
            <div v-for="(transaction, index) in recentTransactions" :key="index" class="flex items-center p-2 hover:bg-gray-50 rounded-md">
              <!-- Icône (dépôt ou retrait) -->
              <div :class="`rounded-full p-1.5 mr-3 ${transaction.type === 'deposit' ? 'bg-secondary bg-opacity-10' : 'bg-red-100'}`">
                <ArrowUpIcon v-if="transaction.type === 'deposit'" class="h-3 w-3 text-secondary transform rotate-45" />
                <ArrowDownIcon v-else class="h-3 w-3 text-red-500 transform rotate-45" />
              </div>
              
              <!-- Détails de la transaction -->
              <div class="flex-grow">
                <div class="flex justify-between items-start">
                  <span class="text-xs font-medium text-gray-500">{{ transaction.client }}</span>
                  <span :class="`text-xs font-medium ${transaction.type === 'deposit' ? 'text-secondary' : 'text-red-500'}`">
                    {{ transaction.type === 'deposit' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                  </span>
                </div>
                <div class="flex justify-between items-start mt-0.5">
                  <span class="text-xs text-gray-500">{{ transaction.account }}</span>
                  <span class="text-xs text-gray-500">{{ transaction.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import api from '@/services/api';
import {
  UserGroupIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowRightIcon,
  UserCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const loading = ref(true);
const stats = ref({
  clients: 0,
  loans: 0,
  savingsTotal: 0,
  upcomingRepayments: 0
});

const recentTransactions = ref([]);
const graphData = ref([]);

onMounted(async () => {
  try {
    // Appel API pour récupérer les statistiques du tableau de bord
    const response = await api.getDashboardStats();
    stats.value = response.data.data.stats;
    recentTransactions.value = response.data.data.recentTransactions || [];
    graphData.value = response.data.data.graphData || [];
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
  } finally {
    loading.value = false;
  }
});

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

// Fonction pour calculer le pourcentage de hauteur par rapport à la valeur maximale
function getHeightPercentage(value, maxValue) {
  if (maxValue === 0) return 0;
  return Math.round((value / maxValue) * 100);
}

// Fonction pour obtenir la valeur maximale d'une propriété dans un tableau d'objets
function getMaxValue(data, property) {
  if (!data || data.length === 0) return 1;
  const values = data.map(item => item[property] || 0);
  return Math.max(...values, 1); // Éviter division par zéro
}

// Fonction pour calculer les points de la courbe pour le graphique SVG
function getGraphPoints(property) {
  if (!graphData.value || graphData.value.length === 0) return '';
  
  const maxValue = getMaxValue(graphData.value, property);
  const width = 100 / (graphData.value.length - 1);
  
  return graphData.value.map((item, index) => {
    const x = index * width;
    const heightPercentage = getHeightPercentage(item[property], maxValue);
    // Y inversé pour SVG (0 est en haut)
    const y = 100 - heightPercentage;
    return `${x}% ${y}%`;
  }).join(' ');
}
</script>

<style scoped>
.polyline-loans {
  filter: drop-shadow(0 2px 2px rgba(59, 130, 246, 0.3));
}

.polyline-savings {
  filter: drop-shadow(0 2px 2px rgba(236, 72, 153, 0.3));
}
</style> 