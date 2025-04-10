<template>
  <div class="container mx-auto py-8 px-4 sm:px-6">
    <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 class="text-sm tracking-widest font-medium text-gray-600">Mes gestionnaires</h1>
        <p class="text-gray-600 text-xs mt-1">Gérez les membres de votre entreprise</p>
      </div>
      
      <button v-if="organizationUsersStore.canManageUsers" 
        @click="showAddUserModal = true"
        class="mt-4 md:mt-0 btn btn-primary">
        <UserPlusIcon class="h-5 w-5 mr-2" />
        Nouvel utilisateur
      </button>
    </div>
    
    <!-- Message d'erreur -->
    <div v-if="organizationUsersStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
      <div class="flex">
        <ExclamationCircleIcon class="h-5 w-5 text-red-500 mr-2" />
        <p class="text-sm text-red-700">{{ organizationUsersStore.error }}</p>
      </div>
    </div>
    
    <!-- Sections par rôle -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-8">
      <div class="bg-primary-light bg-opacity-10 py-3 px-4 border-b border-gray-200">
        <h2 class="font-medium text-xs text-primary">Administrateurs</h2>
      </div>
      
      <div v-if="organizationUsersStore.loading" class="p-4 text-center text-gray-500">
        <svg class="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Chargement des utilisateurs...</p>
      </div>
      
      <div v-else-if="organizationUsersStore.admins.length === 0" class="p-4 text-center text-gray-500">
        <p>Aucun administrateur trouvé.</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th v-if="organizationUsersStore.canManageUsers" class="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in organizationUsersStore.admins" :key="user.id" class="hover:bg-gray-50">
              <td class="py-4 px-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-3">
                    <div class="text-xs font-medium text-gray-600">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="py-4 px-4 whitespace-nowrap">
                <span class="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs">
                  Administrateur
                </span>
              </td>
              <td v-if="organizationUsersStore.canManageUsers" class="py-4 px-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end space-x-2">
                  <button 
                    v-if="!isCurrentUser(user.id)" 
                    @click="openChangeRoleModal(user)" 
                    class="text-blue-600 hover:text-blue-800"
                    title="Changer le rôle"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button 
                    v-if="!isCurrentUser(user.id)" 
                    @click="confirmRemoveUser(user)" 
                    class="text-red-600 hover:text-red-800"
                    title="Retirer de l'organisation"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div class="bg-secondary-light bg-opacity-10 py-3 px-4 border-b border-gray-200">
        <h2 class="font-medium text-xs text-secondary">Gestionnaire</h2>
      </div>
      
      <div v-if="organizationUsersStore.loading" class="p-4 text-center text-gray-500">
        <svg class="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Chargement des utilisateurs...</p>
      </div>
      
      <div v-else-if="organizationUsersStore.agents.length === 0" class="p-4 text-center text-gray-500">
        <p>Aucun agent trouvé.</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th v-if="organizationUsersStore.canManageUsers" class="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in organizationUsersStore.agents" :key="user.id" class="hover:bg-gray-50">
              <td class="py-4 px-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-medium">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-3">
                    <div class="text-xs font-medium text-gray-600">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="py-4 px-4 whitespace-nowrap">
                <span class="bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded-full text-xs">
                  Agent
                </span>
              </td>
              <td v-if="organizationUsersStore.canManageUsers" class="py-4 px-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end space-x-2">
                  <button 
                    v-if="!isCurrentUser(user.id)" 
                    @click="openChangeRoleModal(user)" 
                    class="text-blue-600 hover:text-blue-800"
                    title="Changer le rôle"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button 
                    v-if="!isCurrentUser(user.id)" 
                    @click="confirmRemoveUser(user)" 
                    class="text-red-600 hover:text-red-800"
                    title="Retirer de l'organisation"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-xs text-gray-700">
        Affichage de {{ (currentPage - 1) * perPage + 1 }} à {{ Math.min(currentPage * perPage, totalItems) }} sur {{ totalItems }} résultats
      </div>
      <div class="flex space-x-1">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1" 
          :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
          class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Précédent
        </button>
        <div v-for="page in displayedPages" :key="page">
          <button 
            v-if="page !== '...'" 
            @click="goToPage(page)"
            :class="currentPage === page ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md"
          >
            {{ page }}
          </button>
          <span v-else class="px-2 py-1 text-xs">{{ page }}</span>
        </div>
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages" 
          :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
          class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Suivant
        </button>
      </div>
    </div>
    
    <!-- Modal pour ajouter un utilisateur -->
    <div v-if="showAddUserModal" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showAddUserModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 my-8">
        <div class="flex justify-between items-center py-3 px-4 border-b border-gray-200">
          <h3 class="font-medium text-xs text-gray-600">Ajouter un gestionnaire</h3>
          <button @click="showAddUserModal = false" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="addUser" class="p-4">
          <div v-if="organizationUsersStore.formError" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-500 mr-2" />
              <p class="text-sm text-red-700">{{ organizationUsersStore.formError }}</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="name" class="text-xs text-primary-gray">Nom complet</label>
              <input 
                type="text"
                id="name"
                v-model="newUser.name"
                required
                class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                placeholder="Entrez le nom"
              />
            </div>
            
            <div>
              <label for="email" class="text-xs text-primary-gray">Email</label>
              <input 
                type="email"
                id="email"
                v-model="newUser.email"
                required
                class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                placeholder="Entrez l'email"
              />
            </div>
            
            <div>
              <label for="password" class="text-xs text-primary-gray">Mot de passe</label>
              <input 
                type="password"
                id="password"
                v-model="newUser.password"
                required
                class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                />
            </div>
            
            <div>
              <label for="role" class="text-xs text-primary-gray">Rôle</label>
              <select 
                id="role"
                v-model="newUser.role"
                required
                class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                >
                <option value="">Sélectionnez un rôle</option>
                <option value="admin">Administrateur</option>
                <option value="agent">Agent</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showAddUserModal = false"
              class="btn btn-secondary"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="organizationUsersStore.loading"
            >
              <svg v-if="organizationUsersStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal pour changer le rôle -->
    <div v-if="showChangeRoleModal" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showChangeRoleModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 my-8">
        <div class="flex justify-between items-center py-3 px-4 border-b border-gray-200">
          <h3 class="font-medium text-gray-900">Changer le rôle de {{ selectedUser?.name }}</h3>
          <button @click="showChangeRoleModal = false" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="changeUserRole" class="p-4">
          <div class="space-y-4">
            <div>
              <label for="change_role" class="text-xs text-primary-gray">Rôle</label>
              <select 
                id="change_role"
                v-model="newRole"
                required
                class="input"
              >
                <option value="admin">Administrateur</option>
                <option value="agent">Agent</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showChangeRoleModal = false"
              class="btn btn-secondary"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="organizationUsersStore.loading"
            >
              <svg v-if="organizationUsersStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Changer le rôle
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <div v-if="showConfirmModal" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showConfirmModal = false"></div>
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 my-8">
        <div class="flex justify-between items-center py-3 px-4 border-b border-gray-200">
          <h3 class="font-medium text-gray-900">Confirmation</h3>
          <button @click="showConfirmModal = false" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        
        <div class="p-4">
          <p class="text-gray-600">
            Êtes-vous sûr de vouloir retirer <span class="font-semibold">{{ selectedUser?.name }}</span> de l'organisation ?
          </p>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showConfirmModal = false"
              class="btn btn-secondary"
            >
              Annuler
            </button>
            <button 
              type="button" 
              @click="removeUser"
              class="btn btn-danger"
              :disabled="organizationUsersStore.loading"
            >
              <svg v-if="organizationUsersStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useOrganizationUsersStore } from '@/store/organizationUsers';
import { useAuthStore } from '@/store/auth';
import { 
  ExclamationCircleIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const organizationUsersStore = useOrganizationUsersStore();
const authStore = useAuthStore();

// État des modals
const showAddUserModal = ref(false);
const showChangeRoleModal = ref(false);
const showConfirmModal = ref(false);

// État du formulaire d'ajout d'utilisateur
const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: ''
});

// État pour la modification du rôle
const selectedUser = ref(null);
const newRole = ref('');

// Pagination
const currentPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value));

// Calcul des pages à afficher dans la pagination
const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  
  if (totalPages.value <= maxVisiblePages) {
    // Si le nombre total de pages est inférieur ou égal au maximum de pages visibles, afficher toutes les pages
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Toujours afficher la première page
    pages.push(1);
    
    // Calculer les pages intermédiaires à afficher
    let startPage = Math.max(2, currentPage.value - 1);
    let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);
    
    // Ajuster startPage et endPage pour afficher 3 pages au milieu
    if (startPage > 2) pages.push('...');
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages.value - 1) pages.push('...');
    
    // Toujours afficher la dernière page
    pages.push(totalPages.value);
  }
  
  return pages;
});

// Vérifier si c'est l'utilisateur courant
const isCurrentUser = (userId) => {
  return authStore.user && authStore.user.id == userId;
};

// Ajouter un nouvel utilisateur
const addUser = async () => {
  organizationUsersStore.clearError();
  
  const success = await organizationUsersStore.addUser(newUser.value);
  
  if (success) {
    // Réinitialiser le formulaire et fermer le modal
    newUser.value = {
      name: '',
      email: '',
      password: '',
      role: ''
    };
    showAddUserModal.value = false;
  }
};

// Ouvrir le modal de changement de rôle
const openChangeRoleModal = (user) => {
  selectedUser.value = user;
  newRole.value = user.pivot.role;
  showChangeRoleModal.value = true;
};

// Changer le rôle d'un utilisateur
const changeUserRole = async () => {
  if (!selectedUser.value) return;
  
  organizationUsersStore.clearError();
  
  const success = await organizationUsersStore.updateUserRole(selectedUser.value.id, {
    role: newRole.value
  });
  
  if (success) {
    showChangeRoleModal.value = false;
    selectedUser.value = null;
  }
};

// Confirmer la suppression d'un utilisateur
const confirmRemoveUser = (user) => {
  selectedUser.value = user;
  showConfirmModal.value = true;
};

// Supprimer un utilisateur
const removeUser = async () => {
  if (!selectedUser.value) return;
  
  organizationUsersStore.clearError();
  
  const success = await organizationUsersStore.removeUser(selectedUser.value.id);
  
  if (success) {
    showConfirmModal.value = false;
    selectedUser.value = null;
  }
};

// Fonction pour changer de page
function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  organizationUsersStore.fetchUsers({
    page: currentPage.value,
    per_page: perPage.value
  });
}

// Chargement des données
onMounted(async () => {
  totalItems.value = 0; // Initialisé à zéro, à mettre à jour après avoir récupéré les données
  await organizationUsersStore.fetchUsers({
    page: currentPage.value,
    per_page: perPage.value
  });
  // Mettre à jour le nombre total d'items après avoir chargé les données
  totalItems.value = organizationUsersStore.admins.length + organizationUsersStore.agents.length;
});
</script>

<style scoped>
.text-xs text-primary-gray {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.input {
  @apply block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-primary focus:border-primary;
}
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500;
}
.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}
</style> 