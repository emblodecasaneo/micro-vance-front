<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <button
          @click="$router.push('/clients')"
          class="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-5 text-gray-600"
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
        </button>
        <h1 class="text-sm font-medium text-gray-800">Détails du client</h1>
      </div>
      <div class="flex space-x-2">
        <router-link
          :to="`/clients/${clientId}/edit`"
          class="btn btn-secondary flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span class="text-sm">Modifier</span>
        </router-link>
        <button
          @click="confirmDeleteClient()"
          class="btn text-sm btn-danger flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span class="text-sm">Supprimer</span>
        </button>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"
      ></div>
      <p class="mt-2 text-gray-500">Chargement des informations du client...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center text-red-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-sm font-medium">Erreur</h2>
      </div>
      <p class="text-gray-600">{{ error }}</p>
      <button @click="fetchClient()" class="mt-4 btn btn-primary">Réessayer</button>
    </div>

    <!-- Informations du client -->
    <div v-else-if="client" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Carte d'informations personnelles -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div
              class="flex-shrink-0 h-14 w-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center"
            >
              <span class="text-primary text-lg font-medium">{{
                getInitials(client.first_name, client.last_name)
              }}</span>
            </div>
            <div class="ml-4">
              <h2 class="text-sm mb-3 font-medium text-gray-600">
                {{ client.first_name }} {{ client.last_name }}
              </h2>
              <span :class="getStatusClass(client.status)">
                {{ getStatusLabel(client.status) }}
              </span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <dl class="divide-y divide-gray-200">
              <div class="py-3 flex justify-between">
                <dt class="text-sm font-medium text-gray-500">ID Carte</dt>
                <dd class="text-sm text-gray-600">{{ client.id_card_number }}</dd>
              </div>
              <div class="py-3 flex justify-between">
                <dt class="text-sm font-medium text-gray-500">Profession</dt>
                <dd class="text-sm text-gray-600">{{ client.profession }}</dd>
              </div>
              <div class="py-3 flex justify-between">
                <dt class="text-sm font-medium text-gray-500">Agent assigné</dt>
                <dd class="text-sm text-gray-600">
                  {{ client.agent?.name || "Non assigné" }}
                </dd>
              </div>
              <div class="py-3 flex justify-between">
                <dt class="text-sm font-medium text-gray-500">Créé le</dt>
                <dd class="text-sm text-gray-600">{{ formatDate(client.created_at) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Carte de contact -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-500">Informations de contact</h3>
        </div>
        <div class="p-6">
          <dl class="divide-y divide-gray-200">
            <div class="py-3 flex items-center">
              <dt class="text-sm font-medium text-gray-500 w-24">Adresse</dt>
              <dd class="text-sm text-gray-800 flex-1">{{ client.address }}</dd>
            </div>
            <div class="py-3 flex items-center">
              <dt class="text-sm font-medium text-gray-500 w-24">Téléphone</dt>
              <dd class="text-sm text-gray-800 flex-1">
                <a
                  :href="`tel:${client.phone_number}`"
                  class="text-primary hover:text-primary-dark"
                >
                  {{ client.phone_number }}
                </a>
              </dd>
            </div>
            <div class="py-3 flex items-center">
              <dt class="text-sm font-medium text-gray-500 w-24">Email</dt>
              <dd class="text-sm text-gray-600 flex-1">
                <a
                  v-if="client.email"
                  :href="`mailto:${client.email}`"
                  class="text-primary hover:text-primary-dark"
                >
                  {{ client.email }}
                </a>
                <span v-else class="text-gray-500 italic">Non renseigné</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Résumé des comptes -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-500">Résumé financier</h3>
        </div>
        <div class="p-6 space-y-6">
          <!-- Prêts -->
          <div>
            <h4
              class="font-noromal text-sm text-gray-600 opacity-1 mb-2 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-5 mr-2 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Prêts
            </h4>
            <div
              v-if="client.loans && client.loans.length > 0"
              class="bg-gray-50 rounded-md p-2"
            >
              <div class="text-sm text-gray-600">
                <div>
                  <div class="overflow-hidden">
                    <ul class="divide-y divide-gray-200">
                      <li
                        v-for="loan in client.loans"
                        :key="loan.id"
                        class="py-1"
                      >
                        <div class="flex items-center justify-between">
                          <div>
                            <router-link
                              :to="`/loans/${loan.id}`"
                              class="text-xs font-medium text-primary hover:text-primary-dark"
                            >
                              Prêt #{{ loan.id }}
                            </router-link>
                            <span
                              class="ml-2 px-2 inline-flex text-xs leading-5 font-medium rounded-lg"
                              :class="{
                                'bg-green-100 text-green-800': loan.status === 'active',
                                'bg-yellow-100 text-yellow-800': loan.status === 'pending',
                                'bg-blue-100 text-blue-800': loan.status === 'completed',
                                'bg-red-100 text-red-800': loan.status === 'defaulted',
                              }"
                            >
                              {{ getLoanStatusLabel(loan.status) }}
                            </span>
                          </div>
                          <div class="text-xs font-medium text-gray-600">
                            {{ formatCurrency(loan.amount) }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 italic">
              Aucun prêt
              <router-link
                :to="`/loans/new?client_id=${client.id}`"
                class="text-primary hover:text-primary-dark ml-2"
              >
                Créer un prêt
              </router-link>
            </div>
          </div>

          <!-- Comptes d'épargne -->
          <div>
            <h4
              class="font-normal text-sm text-gray-600 opacity-1 mb-2 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-5 mr-2 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Comptes d'épargne
            </h4>
            <div
              v-if="client.savings_accounts && client.savings_accounts.length > 0"
              class="bg-gray-50 rounded-md p-2"
            >
              <div class="text-sm text-gray-600">
                <!-- Liste des comptes d'épargne -->
                <div class="overflow-hidden">
                  <ul class="divide-y divide-gray-200">
                    <li
                      v-for="account in client.savings_accounts"
                      :key="account.id"
                      class="py-1"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <router-link
                            :to="`/savings/${account.id}`"
                            class="text-xs font-medium text-primary hover:text-primary-dark"
                          >
                            {{ account.account_number }}
                          </router-link>
                          <span
                            class="ml-2 px-2 inline-flex text-xs leading-5 font-medium rounded-lg"
                            :class="{
                              'bg-green-100 text-green-800': account.status === 'active',
                              'bg-yellow-100 text-yellow-800':
                                account.status === 'inactive',
                              'bg-red-100 text-red-800': account.status === 'closed',
                            }"
                          >
                            {{ getSavingsAccountStatusLabel(account.status) }}
                          </span>
                        </div>
                        <div class="text-xs font-medium text-gray-600">
                          {{ formatCurrency(account.balance) }}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 italic">Aucun compte d'épargne</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="showDeleteModal = false"
        ></div>
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-4 w-4 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-sm leading-6 font-normal text-gray-800" id="modal-title">
                  Supprimer le client
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer ce client ? Cette action est
                    irréversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-400 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deleteClient"
              :disabled="deleteLoading"
            >
              <svg
                v-if="deleteLoading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Supprimer
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const router = useRouter();
const clientId = computed(() => route.params.id);

// État
const client = ref(null);
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);
const deleteLoading = ref(false);

// Charger les détails du client
onMounted(() => {
  fetchClient();
});

// Surveiller les changements de route pour recharger les données si l'ID change
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchClient();
    }
  }
);

// Surveiller aussi les paramètres de requête pour recharger après une édition
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.refresh) {
      fetchClient();
    }
  },
  { deep: true }
);

// Méthodes
const fetchClient = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.getClient(clientId.value);

    if (response.data && response.data.status === "success") {
      client.value = response.data.data;
      console.log("Client chargé:", client.value); // Log pour débogage
    } else {
      throw new Error("Impossible de récupérer les informations du client");
    }
  } catch (err) {
    console.error("Erreur lors du chargement du client:", err);
    error.value =
      "Une erreur est survenue lors du chargement des informations du client. Veuillez réessayer.";
  } finally {
    loading.value = false;
  }
};

// Obtenir les initiales d'un nom
const getInitials = (firstName, lastName) => {
  return (firstName ? firstName.charAt(0) : "") + (lastName ? lastName.charAt(0) : "");
};

// Obtenir les classes CSS pour le statut
const getStatusClass = (status) => {
  const baseClass = "px-2 py-1 text-sm leading-5 font-semibold rounded-full";

  switch (status) {
    case "active":
      return `${baseClass} bg-green-100 text-green-800`;
    case "inactive":
      return `${baseClass} bg-gray-100 text-gray-800`;
    case "blacklisted":
      return `${baseClass} bg-red-100 text-red-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
};

// Obtenir le libellé du statut
const getStatusLabel = (status) => {
  switch (status) {
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "blacklisted":
      return "Liste noire";
    default:
      return status;
  }
};

// Formater une date
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

// Formater un montant en devise
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

// Calculer le solde total des comptes d'épargne
const getTotalSavingsBalance = () => {
  if (
    !client.value ||
    !client.value.savings_accounts ||
    client.value.savings_accounts.length === 0
  ) {
    return 0;
  }

  return client.value.savings_accounts.reduce(
    (total, account) => total + (account.balance || 0),
    0
  );
};

// Confirmer la suppression du client
const confirmDeleteClient = () => {
  showDeleteModal.value = true;
};

// Supprimer un client
const deleteClient = async () => {
  deleteLoading.value = true;

  try {
    const response = await api.deleteClient(clientId.value);

    if (response.data && response.data.status === "success") {
      // Rediriger vers la liste des clients
      router.push("/clients");
    }
  } catch (err) {
    console.error("Erreur lors de la suppression du client:", err);

    // Gérer l'erreur (afficher un message, etc.)
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("Une erreur est survenue lors de la suppression du client.");
    }

    // Fermer la modal
    showDeleteModal.value = false;
  } finally {
    deleteLoading.value = false;
  }
};

// Obtenir le libellé du statut d'un compte d'épargne
const getSavingsAccountStatusLabel = (status) => {
  switch (status) {
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "closed":
      return "Fermé";
    default:
      return status;
  }
};

// Obtenir le libellé du statut d'un prêt
const getLoanStatusLabel = (status) => {
  switch (status) {
    case "active":
      return "Actif";
    case "pending":
      return "En attente";
    case "completed":
      return "Terminé";
    case "defaulted":
      return "En défaut";
    default:
      return status;
  }
};
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500;
}

.btn-danger {
  @apply bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary;
}
</style>
