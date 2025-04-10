<template>
  <div>
    <!-- En-tête avec bouton de retour -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
    >
      <div class="flex items-center">
        <router-link to="/savings" class="text-gray-500 hover:text-gray-700 mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </router-link>
        <h1 class="text-sm font-medium tracking-widest text-gray-700 ml-2">
          Détails du compte d'épargne
        </h1>
      </div>

      <div v-if="account" class="mt-4 md:mt-0 flex space-x-2">
        <router-link
          :to="`/savings/${accountId}/deposit`"
          class="btn bg-primary bg-opacity-5 flex items-center"
          style="height: 34px;"
        >
        
          <div class="rounded-full p-1.5 mr-1 bg-primary"><ArrowDownIcon class="h-3 w-3 text-white transform rotate-45" /></div>
          
          Dépôt
        </router-link>
        <router-link
          :to="`/savings/${accountId}/withdraw`"
          class="btn bg-orange-400 bg-opacity-5 flex items-center"
          style="height: 34px;"
        >
        <div class="rounded-full p-1.5 mr-1 bg-orange-400"><ArrowUpIcon class="h-3 w-3 text-white transform rotate-45" /></div>

          Retrait
        </router-link>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="bg-white shadow rounded-lg p-6 text-center text-gray-500">
      <svg
        class="animate-spin h-5 w-5 mx-auto mb-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p>Chargement des informations...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div class="flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-red-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="account" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Informations sur le compte d'épargne -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 bg-primary bg-opacity-10 border-b border-gray-200">
            <h3 class="text-xs font-medium text-primary">Informations du compte</h3>
          </div>
          <div class="p-4 space-y-3">
            <div class="grid grid-cols-2 items-center gap-2">
              <span class="text-xs text-gray-500">N° Compte:</span>
              <span class="text-xs font-medium text-gray-600">{{
                account.account_number
              }}</span>

              <span class="text-xs text-gray-500">Statut:</span>
              <span
                class="px-2 py-1 w-[70px] inline-flex text-xs leading-5 font-medium rounded-lg"
                :class="{
                  'bg-green-100 text-green-800': account.status === 'active',
                  'bg-yellow-100 text-yellow-800': account.status === 'inactive',
                  'bg-red-100 text-red-800': account.status === 'closed',
                }"
              >
                {{ getSavingsStatusText(account.status) }}
              </span>

              <span class="text-xs text-gray-500">Solde actuel:</span>
              <span class="text-xs font-semibold text-primary">{{
                formatCurrency(account.balance)
              }}</span>

              <span class="text-xs text-gray-500">Taux d'intérêt:</span>
              <span class="text-xs font-medium text-gray-700"
                >{{ account.interest_rate }}%</span
              >

              <span class="text-xs text-gray-500">Date d'ouverture:</span>
              <span class="text-xs font-medium text-gray-700">{{
                formatDate(account.opening_date)
              }}</span>

              <template v-if="account.closing_date">
                <span class="text-xs text-gray-500">Date de clôture:</span>
                <span class="text-xs font-medium text-gray-700">{{
                  formatDate(account.closing_date)
                }}</span>
              </template>

              <span class="text-xs text-gray-500">Dernière capitalisation:</span>
              <span class="text-xs font-medium text-gray-800">{{
                formatDate(account.last_interest_calculation_date) || "Aucune"
              }}</span>
            </div>
          </div>
        </div>

        <!-- Nouvelle section de prévision d'intérêts -->
        <div class="bg-white shadow rounded-lg overflow-hidden mt-4">
          <div class="p-4 bg-blue-50 border-b border-gray-200">
            <h3 class="text-xs font-medium text-blue-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.172a2 2 0 00-1.414.586l-.828.828A2 2 0 0011.172 6H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
              Prévision des intérêts
            </h3>
          </div>
          <div class="p-4 space-y-3">
            <p class="text-xs text-gray-500 mb-2">Estimation des intérêts basée sur le solde actuel et le taux d'intérêt de {{ account.interest_rate }}%</p>
            
            <div class="bg-blue-50 p-3 rounded-md">
              <div class="grid grid-cols-2 gap-2">
                <span class="text-xs text-gray-600">Prochain versement:</span>
                <span class="text-xs font-medium text-blue-700">
                  {{ getNextInterestDate() }}
                </span>
                
                <span class="text-xs text-gray-600">Intérêts estimés:</span>
                <span class="text-xs font-medium text-blue-700">
                  {{ formatCurrency(calculateEstimatedInterest()) }}
                </span>
                
                <span class="text-xs text-gray-600">Intérêts annuels:</span>
                <span class="text-xs font-medium text-blue-700">
                  {{ formatCurrency(calculateYearlyInterest()) }}
                </span>
              </div>
            </div>

            <div class="mt-3 text-center">
              <button 
                @click="showInterestCalculator = !showInterestCalculator" 
                class="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                {{ showInterestCalculator ? 'Masquer' : 'Afficher' }} le simulateur d'intérêts
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-3 w-3 ml-1" 
                  :class="{ 'transform rotate-180': showInterestCalculator }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- Simulateur d'intérêts -->
            <div v-if="showInterestCalculator" class="mt-3 border-t border-gray-200 pt-3">
              <h4 class="text-xs font-semibold text-gray-700 mb-2">Simulateur d'intérêts</h4>
              <div class="space-y-2">
                <div>
                  <label for="sim-amount" class="block text-xs text-gray-600 mb-1">Montant à simuler</label>
                  <input 
                    type="number" 
                    id="sim-amount" 
                    v-model="simulationAmount" 
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label for="sim-period" class="block text-xs text-gray-600 mb-1">Période (mois)</label>
                  <input 
                    type="number" 
                    id="sim-period" 
                    v-model="simulationPeriod" 
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                    min="1"
                    max="60"
                  />
                </div>
                <div class="bg-blue-50 p-3 rounded-md">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-medium text-gray-600">Intérêts simulés:</span>
                    <span class="text-sm font-bold text-blue-700">
                      {{ formatCurrency(calculateSimulatedInterest()) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center mt-1">
                    <span class="text-xs font-medium text-gray-600">Montant final:</span>
                    <span class="text-sm font-bold text-blue-700">
                      {{ formatCurrency(Number(simulationAmount) + calculateSimulatedInterest()) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Informations sur le client -->
        <div
          v-if="account.client"
          class="bg-white shadow rounded-lg overflow-hidden mt-4"
        >
          <div class="p-4 bg-secondary bg-opacity-10 border-b border-gray-200">
            <h3 class="text-xs font-medium text-secondary">Informations du client</h3>
          </div>
          <div class="p-4">
            <div class="flex items-center mb-3">
              <div
                class="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-medium"
              >
                {{ getInitials(account.client) }}
              </div>
              <div class="ml-3">
                <router-link
                  :to="`/clients/${account.client.id}`"
                  class="text-xs font-medium text-secondary hover:text-secondary-dark"
                >
                  {{ account.client.first_name }} {{ account.client.last_name }}
                </router-link>
                <p class="text-xs text-gray-500">{{ account.client.id_card_number }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mt-2">
              <span class="text-xs text-gray-500">Téléphone:</span>
              <span class="text-xs font-medium text-gray-700">{{
                account.client.phone_number || "Non spécifié"
              }}</span>

              <span class="text-xs text-gray-500">Email:</span>
              <span class="text-xs font-medium text-gray-700">{{
                account.client.email || "Non spécifié"
              }}</span>

              <span class="text-xs text-gray-500">Statut:</span>
              <span
                class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-lg w-[70px]"
                :class="{
                  'bg-green-100 text-green-800': account.client.status === 'active',
                  'bg-yellow-100 text-yellow-800': account.client.status === 'inactive',
                  'bg-red-100 text-red-800': account.client.status === 'blacklisted',
                }"
              >
                {{ getClientStatusText(account.client.status) }}
              </span>
            </div>

            <div class="mt-3">
              <router-link
                :to="`/clients/${account.client.id}`"
                class="text-xs text-secondary hover:underline"
              >
                Voir profil complet
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div
            class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center"
          >
            <h3 class="text-sm font-medium text-gray-500">Transactions récentes</h3>
            <button
              @click="refreshTransactions"
              title="Rafraîchir"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          <!-- Filtres de transactions -->
          <div class="p-4 bg-gray-50 border-b border-gray-200">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <!-- Filtre par type de transaction -->
              <div>
                <label
                  for="transaction-type"
                  class="block text-xs font-medium text-primary-gray mb-1"
                  >Type de transaction</label
                >
                <select
                  id="transaction-type"
                  v-model="filters.type"
                  class="block w-full text-xs border text-primary-gray border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  @change="applyFilters"
                >
                  <option value="">Tous les types</option>
                  <option value="deposit">Dépôts</option>
                  <option value="withdrawal">Retraits</option>
                  <option value="interest">Intérêts</option>
                  <option value="fee">Frais</option>
                  <option value="transfer">Transferts</option>
                </select>
              </div>

              <!-- Filtre par date de début -->
              <div>
                <label
                  for="start-date"
                  class="block text-xs font-medium text-primary-gray mb-1"
                  >A partir du</label
                >
                <input
                  type="date"
                  id="start-date"
                  v-model="filters.startDate"
                  class="block w-full text-xs text-primary-gray border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div class="flex items-end justify-end space-x-3">
                <button
                  @click="resetFilters"
                  style="height: 34px;"
                  class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                >
                  Réinitialiser
                </button>
                <button
                  @click="applyFilters"
                  style="height: 34px;"
                  class="px-3 py-1.5 text-xs font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
          <div v-if="loadingTransactions" class="p-4 text-center text-gray-500">
            <svg
              class="animate-spin h-5 w-5 mx-auto mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>Chargement des transactions...</p>
          </div>

          <div
            v-else-if="transactions.length === 0"
            class="p-4 text-center text-gray-500"
          >
            <p>Aucune transaction trouvée pour ce compte.</p>
          </div>

          <div v-else class="overflow-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="transaction in transactions"
                  :key="transaction.id"
                  class="hover:bg-gray-50"
                >
                  <td class="py-2 px-4 whitespace-nowrap">
                    <div class="text-xs font-medium text-primary-gray">
                      {{ formatDateTime(transaction.created_at) }}
                    </div>
                  </td>
                  <td class="py-2.5 px-4 font-medium whitespace-nowrap">
                    <span
                      class="px-2 py-1 inline-flex text-xs leading-5 font-meduim rounded-lg"
                      :class="{
                        'bg-green-100 text-green-800': transaction.type === 'deposit',
                        'bg-red-100 text-red-800': transaction.type === 'withdrawal',
                        'bg-blue-100 text-blue-800': transaction.type === 'interest',
                        'bg-yellow-100 text-yellow-800': transaction.type === 'fee',
                        'bg-purple-100 text-purple-800': transaction.type === 'transfer',
                      }"
                    >
                      <!-- Icônes pour chaque type de transaction -->
                      <svg v-if="transaction.type === 'deposit'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <svg v-else-if="transaction.type === 'withdrawal'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                      <svg v-else-if="transaction.type === 'interest'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <svg v-else-if="transaction.type === 'fee'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <svg v-else-if="transaction.type === 'transfer'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {{ getTransactionTypeText(transaction.type) }}
                    </span>
                  </td>
                  <td class="py-2.5 px-4 whitespace-nowrap">
                    <div class="text-xs font-medium text-gray-500" :class="{'font-medium': transaction.type === 'interest'}">
                      {{ transaction.description || "N/A" }}
                    </div>
                    <div
                      v-if="transaction.reference_number"
                      class="text-xs text-gray-500"
                    >
                      Réf: {{ transaction.reference_number }}
                    </div>
                  </td>
                  <td class="py-2.5 text-xs px-4 whitespace-nowrap">
                    <div
                      class="text-xs font-medium"
                      :class="{
                        'text-green-600':
                          transaction.type === 'deposit' ||
                          transaction.type === 'interest',
                        'text-red-600':
                          transaction.type === 'withdrawal' || transaction.type === 'fee',
                        'text-gray-900': transaction.type === 'transfer',
                      }"
                    >
                      {{
                        transaction.type === "deposit" || transaction.type === "interest"
                          ? "+"
                          : transaction.type === "withdrawal" ||
                            transaction.type === "fee"
                          ? "-"
                          : ""
                      }}
                      {{ formatCurrency(transaction.amount) }}
                    </div>
                    <!-- Highlight pour les intérêts -->
                    <div v-if="transaction.type === 'interest'" class="text-xs text-blue-600 italic">
                      Intérêts créditées
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination pour les transactions -->
          <div v-if="transactions.length > 0" class="mt-4 border-t border-gray-200 px-4 py-3 flex justify-between items-center">
            <div class="text-xs text-gray-700">
              Affichage de {{ (currentPage - 1) * perPage + 1 }} à {{ Math.min(currentPage * perPage, total) }} sur {{ total }} transactions
            </div>
            <div class="flex space-x-1">
              <button 
                @click="changePage(currentPage - 1)" 
                :disabled="currentPage === 1" 
                :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Précédent
              </button>
              <div v-for="page in getVisiblePageNumbers()" :key="page">
                <button 
                  v-if="page !== '...'" 
                  @click="changePage(page)"
                  :class="currentPage === page ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                  class="px-3 py-1 text-xs border border-gray-300 rounded-md"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 py-1 text-xs">{{ page }}</span>
              </div>
              <button 
                @click="changePage(currentPage + 1)" 
                :disabled="currentPage === totalPages" 
                :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
                class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
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

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { useToastStore } from "@/store/toast";
import Chart from 'chart.js/auto';
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  getInitials,
  getSavingsStatusText,
  getClientStatusText,
} from "@/utils/formatters";

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

const route = useRoute();
const router = useRouter();
const store = useStore();
const toastStore = useToastStore();

const accountId = route.params.id;
const loading = computed(() => store.getters["savings/isLoading"]);
const account = computed(() => store.getters["savings/getAccount"]);
const transactions = computed(() => store.getters["savings/getTransactions"]);
const error = computed(() => store.getters["savings/getError"]);
const showCancelDialog = ref(false);
const selectedTransaction = ref(null);
const cancellationReason = ref("");
const cancelLoading = ref(false);
const loadingTransactions = ref(false);
const currentPage = ref(1);
const perPage = ref(10);
const totalPages = ref(1);
const total = ref(0);
const filters = ref({
  type: "",
  startDate: "",
  endDate: "",
});
const showInterestCalculator = ref(false);
const simulationAmount = ref(0);
const simulationPeriod = ref(1);
const loadingChart = ref(false);
const chartData = ref({
  labels: [],
  balances: [],
  interests: [],
  deposits: [],
  withdrawals: []
});
const chartPeriod = ref('1m');
const balanceChart = ref(null);
const chartInstance = ref(null);

// Charger les données au montage du composant
onMounted(async () => {
  await loadAccountDetails();
  await refreshTransactions();
  await loadChartData();
});

// Nettoyer le graphique lors du démontage du composant
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});

// Observer les changements de période pour recharger les données du graphique
watch(chartPeriod, async () => {
  await loadChartData();
});

// Fonction pour charger les détails du compte
const loadAccountDetails = async () => {
  try {
    await store.dispatch("savings/fetchAccount", accountId);
    await loadTransactions();
  } catch (err) {
    console.error("Erreur lors du chargement du compte:", err);
    toastStore.error("Erreur lors du chargement des détails du compte");
  }
};

// Fonction pour charger les transactions du compte
const loadTransactions = async () => {
  loadingTransactions.value = true;
  try {
    await store.dispatch("savings/fetchTransactions", {
      accountId: accountId,
      page: currentPage.value,
      perPage: perPage.value,
      type: filters.value.type,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
    });

    // Mettre à jour les variables de pagination
    const pagination = store.getters["savings/getTransactionPagination"];
    currentPage.value = pagination.currentPage;
    totalPages.value = pagination.totalPages;
    total.value = pagination.totalItems;
    perPage.value = pagination.perPage;
  } catch (err) {
    console.error("Erreur lors du chargement des transactions:", err);
    toastStore.error("Erreur lors du chargement des transactions");
  } finally {
    loadingTransactions.value = false;
  }
};

// Fonction pour ouvrir le dialogue d'annulation de transaction
const openCancelDialog = (transaction) => {
  selectedTransaction.value = transaction;
  cancellationReason.value = "";
  showCancelDialog.value = true;
};

// Fonction pour annuler une transaction
const cancelTransaction = async () => {
  if (!selectedTransaction.value) return;

  cancelLoading.value = true;

  try {
    const result = await store.dispatch("savings/cancelTransaction", {
      accountId: accountId,
      transactionId: selectedTransaction.value.id,
      reason: cancellationReason.value || "Annulé par l'utilisateur",
    });

    if (result.success) {
      toastStore.success("Transaction annulée avec succès");
      showCancelDialog.value = false;
      // Recharger les transactions
      await loadTransactions();
    } else {
      toastStore.error("Erreur lors de l'annulation de la transaction");
    }
  } catch (err) {
    console.error("Erreur lors de l'annulation:", err);
    toastStore.error(
      err.response?.data?.message || "Erreur lors de l'annulation de la transaction"
    );
  } finally {
    cancelLoading.value = false;
  }
};

// Fonction pour changer de page dans la pagination des transactions
const changePage = async (page) => {
  if (page < 1 || page > totalPages.value) {
    return;
  }

  currentPage.value = page;
  await loadTransactions();
};

// Fonction pour appliquer les filtres
const applyFilters = async () => {
  currentPage.value = 1; // Réinitialiser à la première page lors de l'application des filtres
  await loadTransactions();
};

// Fonction pour réinitialiser les filtres
const resetFilters = async () => {
  filters.value = {
    type: "",
    startDate: "",
    endDate: "",
  };
  currentPage.value = 1;
  await loadTransactions();
};

// Fonction pour obtenir les numéros de page visibles dans la pagination
const getVisiblePageNumbers = () => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  if (currentPage.value <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages.value];
  }

  if (currentPage.value >= totalPages.value - 3) {
    return [
      1,
      "...",
      totalPages.value - 4,
      totalPages.value - 3,
      totalPages.value - 2,
      totalPages.value - 1,
      totalPages.value,
    ];
  }

  return [
    1,
    "...",
    currentPage.value - 1,
    currentPage.value,
    currentPage.value + 1,
    "...",
    totalPages.value,
  ];
};

// Obtenir le texte du type de transaction
const getTransactionTypeText = (type) => {
  switch (type) {
    case "deposit":
      return "Dépôt";
    case "withdrawal":
      return "Retrait";
    case "interest":
      return "Intérêt";
    case "fee":
      return "Frais";
    case "transfer":
      return "Transfert";
    default:
      return type;
  }
};

// Fonction pour rafraîchir les transactions
const refreshTransactions = async () => {
  loadingTransactions.value = true;

  try {
    await loadTransactions();
  } catch (error) {
    console.error("Error refreshing transactions:", error);
    toastStore.error("Erreur lors du rafraîchissement des transactions");
  } finally {
    loadingTransactions.value = false;
  }
};

// Fonction pour calculer la date du prochain versement d'intérêts
const getNextInterestDate = () => {
  if (!account.value || !account.value.last_interest_calculation_date) {
    // Si aucune date de dernier calcul d'intérêts, supposer que les intérêts sont calculés mensuellement
    // à partir de la date d'ouverture
    const openingDate = account.value?.opening_date ? new Date(account.value.opening_date) : new Date();
    const nextDate = new Date(openingDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return formatDate(nextDate);
  }
  
  // Sinon, calculer la prochaine date basée sur la dernière date de calcul
  const lastDate = new Date(account.value.last_interest_calculation_date);
  const nextDate = new Date(lastDate);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return formatDate(nextDate);
};

// Fonction pour calculer les intérêts estimés jusqu'au prochain versement
const calculateEstimatedInterest = () => {
  if (!account.value || account.value.status !== 'active') {
    return 0;
  }
  
  const interestRate = account.value.interest_rate || 0;
  const balance = account.value.balance || 0;
  
  // Calculer les intérêts pour un mois (intérêts mensuels)
  // Formule: (solde * taux annuel) / 12
  return (balance * (interestRate / 100)) / 12;
};

// Fonction pour calculer les intérêts annuels
const calculateYearlyInterest = () => {
  if (!account.value || account.value.status !== 'active') {
    return 0;
  }
  
  const interestRate = account.value.interest_rate || 0;
  const balance = account.value.balance || 0;
  
  // Calculer les intérêts annuels
  // Formule: solde * taux annuel / 100
  return balance * (interestRate / 100);
};

// Fonction pour calculer les intérêts simulés
const calculateSimulatedInterest = () => {
  if (!account.value || simulationAmount.value <= 0 || simulationPeriod.value <= 0) {
    return 0;
  }
  
  const interestRate = account.value.interest_rate || 0;
  const amount = Number(simulationAmount.value);
  const periodInMonths = Number(simulationPeriod.value);
  
  // Calculer les intérêts pour la période donnée
  // Pour simplifier, nous utilisons un calcul d'intérêt simple
  // Formule: (montant * taux annuel * période en mois) / (12 * 100)
  const simpleInterest = (amount * interestRate * periodInMonths) / (12 * 100);
  
  // Pour un calcul d'intérêt composé (plus complexe mais plus précis):
  // Formule: montant * ((1 + taux mensuel) ^ période - 1)
  // const monthlyRate = interestRate / 100 / 12;
  // const compoundInterest = amount * (Math.pow(1 + monthlyRate, periodInMonths) - 1);
  
  return simpleInterest;
};

// Fonction pour charger les données du graphique
const loadChartData = async () => {
  loadingChart.value = true;
  try {
    // Simuler des données du graphique pour le moment
    // Dans un cas réel, on récupérerait ces données depuis l'API
    generateMockChartData();
    renderChart();
  } catch (error) {
    console.error("Error loading chart data:", error);
    toastStore.error("Erreur lors du chargement des données du graphique");
  } finally {
    loadingChart.value = false;
  }
};

// Fonction pour générer des données fictives pour le graphique
const generateMockChartData = () => {
  const labels = [];
  const balances = [];
  const interests = [];
  const deposits = [];
  const withdrawals = [];
  
  let numberOfPoints;
  let startDate = new Date();
  
  // Définir le nombre de points et la date de début en fonction de la période
  switch(chartPeriod.value) {
    case '1m':
      numberOfPoints = 30;
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '3m':
      numberOfPoints = 12;
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '6m':
      numberOfPoints = 24;
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case '1y':
      numberOfPoints = 12;
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      numberOfPoints = 30;
      startDate.setMonth(startDate.getMonth() - 1);
  }
  
  let currentBalance = account.value?.balance || 10000;
  let totalInterest = 0;
  
  // Générer les points de données
  for (let i = 0; i < numberOfPoints; i++) {
    const date = new Date(startDate);
    
    if (chartPeriod.value === '1m') {
      date.setDate(date.getDate() + i);
    } else if (chartPeriod.value === '3m') {
      date.setDate(date.getDate() + i * 7);
    } else if (chartPeriod.value === '6m') {
      date.setDate(date.getDate() + i * 7);
    } else {
      date.setMonth(date.getMonth() + i);
    }
    
    // Générer des montants aléatoires pour les dépôts et retraits
    const depositAmount = Math.random() > 0.7 ? Math.round(Math.random() * 5000) : 0;
    const withdrawalAmount = Math.random() > 0.8 ? Math.round(Math.random() * 3000) : 0;
    
    // Calculer l'intérêt mensuel (simplifié)
    const interestAmount = Math.round((currentBalance * (account.value?.interest_rate || 3.5) / 100) / 12);
    totalInterest += interestAmount;
    
    // Mettre à jour le solde
    currentBalance = currentBalance + depositAmount - withdrawalAmount + interestAmount;
    
    // Formater la date pour l'affichage
    const formattedDate = new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    }).format(date);
    
    labels.unshift(formattedDate);
    balances.unshift(currentBalance);
    interests.unshift(totalInterest);
    deposits.unshift(depositAmount);
    withdrawals.unshift(withdrawalAmount);
  }
  
  // Inverser les tableaux pour avoir les dates les plus récentes à droite
  chartData.value = {
    labels: labels.reverse(),
    balances: balances.reverse(),
    interests: interests.reverse(),
    deposits: deposits.reverse(),
    withdrawals: withdrawals.reverse()
  };
};

// Fonction pour rendre le graphique
const renderChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  
  const ctx = balanceChart.value?.getContext('2d');
  if (!ctx || !chartData.value.labels.length) return;
  
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.value.labels,
      datasets: [
        {
          label: 'Solde',
          data: chartData.value.balances,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Intérêts cumulés',
          data: chartData.value.interests,
          backgroundColor: 'rgba(96, 165, 250, 0.2)',
          borderColor: 'rgba(96, 165, 250, 1)',
          borderWidth: 1,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatCurrency(context.raw);
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return formatCurrency(value, false);
            }
          }
        }
      }
    }
  });
};

// Fonction pour changer la période du graphique
const changeChartPeriod = (period) => {
  chartPeriod.value = period;
};
</script>
