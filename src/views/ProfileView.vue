<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h1 class="text-sm font-semibold text-gray-500 mb-6">Profile</h1>
    
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Photo de profil et informations principales -->
      <div class="md:w-1/3">
        <div class="mb-6 flex flex-col items-center">
          <div class="w-28 h-28 bg-primary rounded-full text-white flex items-center justify-center text-4xl font-bold mb-4">
            {{ authStore.user?.name.charAt(0).toUpperCase() }}
          </div>
          <h2 class="text-sm text-gray-900 font-semibold">{{ authStore.user?.name }}</h2>
          <p class="text-gray-500 text-sm">{{ authStore.user?.email }}</p>
          <span class="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs mt-2">
            {{ userRole }}
          </span>
        </div>
        
        <!-- Dernières connexions -->
        <div class="mt-6">
        <h1 class="text-sm font-semibold text-gray-500 mb-6">Dernières connexions</h1>
          <div v-if="lastLogins.length > 0" class="space-y-3">
            <div v-for="login in lastLogins" :key="login.id" class="bg-gray-50 p-3 rounded-md">
              <div class="flex items-center">
                <div class="p-2 rounded-full mr-3" :class="getDeviceIconClass(login.device_type)">
                  <svg v-if="login.device_type === 'desktop'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="login.device_type === 'mobile'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="login.device_type === 'tablet'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-grow">
                  <div class="text-xs font-medium text-gray-800">
                    {{ formatDate(login.logged_at) }}
                  </div>
                  <div class="text-xs text-gray-500">{{ formatLocation(login) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 italic">
            Aucun historique de connexion disponible
          </div>
        </div>
      </div>
      
      <!-- Formulaire d'informations -->
      <div class="md:w-2/3">
        <form @submit.prevent="updateProfile">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Nom complet</label>
              <input 
                type="text"
                v-model="profileData.name"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-200 py-1 px-2"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                v-model="profileData.email"
                class="w-full rounded-md border-gray-300 px-2 py-1 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 bg-gray-50"
                disabled
              />
              <p class="mt-1 text-xs text-gray-500">L'email ne peut pas être modifié.</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
              <input 
                type="text"
                :value="authStore.currentOrganizationName"
                class="w-full rounded-md border-gray-300 px-2 py-1 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 bg-gray-50"
                disabled
              />
            </div>
            
            <div class="pt-4">
              <button 
                type="submit"
                class="bg-primary text-white rounded-md px-4 py-2 hover:bg-primary-dark"
                :disabled="loading"
              >
                <div class="flex items-center">
                  <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mettre à jour
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useToastStore } from '@/store/toast';
import api from '@/services/api';

const authStore = useAuthStore();
const toastStore = useToastStore();
const loading = ref(false);
const error = ref(null);
const lastLogins = ref([]);

// Données du formulaire de profil
const profileData = ref({
  name: '',
  email: ''
});

// Formater le rôle pour l'affichage
const userRole = computed(() => {
  const role = authStore.user?.role;
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'admin') return 'Administrateur';
  if (role === 'agent') return 'Agent';
  return role;
});

// Récupérer les dernières connexions
const fetchLastLogins = async () => {
  try {
    const response = await api.getLastLogins();
    if (response.data.status === 'success') {
      lastLogins.value = response.data.data;
    }
  } catch (err) {
    console.error('Erreur lors de la récupération des dernières connexions:', err);
  }
};

// Formater la date de connexion
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formater l'emplacement de la connexion
const formatLocation = (login) => {
  const locationInfo = [];
  
  if (login.device_type) {
    locationInfo.push(login.device_type === 'desktop' ? 'Ordinateur' : 
                      login.device_type === 'mobile' ? 'Mobile' : 
                      login.device_type === 'tablet' ? 'Tablette' : login.device_type);
  }
  
  if (login.ip_address) {
    locationInfo.push(`IP: ${login.ip_address}`);
  }
  
  if (login.location) {
    locationInfo.push(login.location);
  }
  
  return locationInfo.join(' · ') || 'Information non disponible';
};

// Obtenir la classe d'icône en fonction du type d'appareil
const getDeviceIconClass = (deviceType) => {
  if (deviceType === 'mobile') {
    return 'bg-blue-100 text-blue-600';
  } else if (deviceType === 'tablet') {
    return 'bg-purple-100 text-purple-600';
  } else {
    // desktop ou autre
    return 'bg-green-100 text-green-600';
  }
};

// Initialiser le composant
onMounted(() => {
  if (authStore.user) {
    profileData.value.name = authStore.user.name;
    profileData.value.email = authStore.user.email;
  }
  
  // Récupérer les dernières connexions
  fetchLastLogins();
});

// Mettre à jour le profil
const updateProfile = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Appel à l'API via le store auth
    const success = await authStore.updateProfile({
      name: profileData.value.name
    });
    
    if (success) {
      // Rafraîchir les données du formulaire avec les nouvelles valeurs
      profileData.value.name = authStore.user.name;
      
      // Afficher une notification toast de succès
      toastStore.success('Profil mis à jour avec succès !');
    } else {
      error.value = authStore.error || 'Une erreur est survenue lors de la mise à jour';
      // Afficher une notification toast d'erreur
      toastStore.error(error.value);
    }
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue';
    // Afficher une notification toast d'erreur
    toastStore.error(error.value);
  } finally {
    loading.value = false;
  }
};
</script> 