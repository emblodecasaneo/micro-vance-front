<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <button 
          @click="goBack" 
          class="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-sm tracking-widest font-medium text-gray-800">{{ isEditMode ? 'Modifier le client' : 'Nouveau client' }}</h1>
      </div>
    </div>
    
    <!-- Chargement -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-500">{{ isEditMode ? 'Chargement des informations du client...' : 'Initialisation du formulaire...' }}</p>
    </div>
    
    <!-- Formulaire -->
    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Note d'information sur l'organisation -->
      <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-light text-blue-800">
              Ce client sera automatiquement associé à l'organisation <strong class="text-orange-400">{{ authStore.currentOrganizationName }}</strong>.
              {{ authStore.user?.role === 'agent' ? 'Vous serez automatiquement défini comme l\'agent responsable.' : '' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Erreurs -->
      <div v-if="errors && Object.keys(errors).length > 0" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Veuillez corriger les erreurs suivantes:
            </h3>
            <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
              <li v-for="(errorArray, field) in errors" :key="field">
                {{ errorArray[0] }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Succès -->
      <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              {{ successMessage }}
            </p>
          </div>
        </div>
      </div>
      
      <form @submit.prevent="submitForm" class="p-6">
        <!-- Formulaire compact en deux colonnes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Colonne 1: Informations personnelles -->
          <div>
            <h2 class="text-xs font-medium text-gray-500 mb-4">Informations personnelles</h2>
            
            <div class="space-y-4">
              <div>
                <label for="first_name" class="block text-xs font-normal text-gray-500 mb-1">Prénom <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="first_name" 
                  v-model="form.first_name" 
                  class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                  required
                />
              </div>
              
              <div>
                <label for="last_name" class="block text-xs font-normal  text-gray-500 mb-1">Nom <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="last_name" 
                  v-model="form.last_name" 
                  class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                  required
                />
              </div>
              
              <div>
                <label for="id_card_number" class="block text-xs font-normal  text-gray-500 mb-1">Numéro de carte d'identité <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="id_card_number" 
                  v-model="form.id_card_number" 
                  class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                  required
                />
              </div>
              
              <div>
                <label for="profession" class="block text-xs font-normal  text-gray-500 mb-1">Profession <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="profession" 
                  v-model="form.profession" 
                  class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                  required
                />
              </div>
            </div>
          </div>
          
          <!-- Colonne 2: Informations de contact -->
          <div>
            <h2 class="text-xs font-medium text-gray-500 mb-4">Informations de contact</h2>
            
            <div class="space-y-4">
              <div>
                <label for="phone_number" class="block text-xs font-normal  text-gray-500 mb-1">Téléphone <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="phone_number" 
                  v-model="form.phone_number" 
                  class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                  required
                />
              </div>
              
              <div>
                <label for="email" class="block text-xs font-normal  text-gray-500 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                />
              </div>
              
              <div>
                <label for="address" class="block text-xs font-normal  text-gray-500 mb-1">Adresse <span class="text-red-500">*</span></label>
                <input 
                  id="address" 
                  v-model="form.address" 
                  rows="3" 
                  class="block w-full text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                  required
                ></input>
              </div>
            </div>
            
            <!-- Agent assigné (pour admins uniquement) -->
            <div v-if="authStore.isAdmin || authStore.isSuperAdmin || isEditMode" class="mt-4">              
              <div class="space-y-4">
                <div v-if="authStore.isAdmin || authStore.isSuperAdmin">
                  <label for="agent_id" class="block text-xs font-normal  text-gray-500 mb-1">Gertionnaire assigné <span class="text-red-500">*</span></label>
                  <select 
                    id="agent_id" 
                    v-model="form.agent_id" 
                    class="block w-full text-primary-gray text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    required
                  >
                    <option value="">Sélectionnez un agent</option>
                    <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                      {{ agent.name }} {{ agent.pivot?.role === 'admin' ? '(Admin)' : '(Agent)' }}
                    </option>
                  </select>
                </div>
                
                <div v-if="isEditMode">
                  <label for="status" class="block text-sm font-normal  text-gray-500 mb-1">Statut</label>
                  <select 
                    id="status" 
                    v-model="form.status" 
                    class="block w-full py-2 px-3 border font-normal  text-gray-800 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="blacklisted">Liste noire</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Boutons d'action -->
        <div class="flex justify-end space-x-3 border-t mt-2 border-gray-200 pt-6">
          <button 
            type="button" 
            @click="goBack" 
            class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-normal  text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            :disabled="submitting"
          >
            <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditMode ? 'Mettre à jour' : 'Créer le client' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Vérifier si c'est un mode édition ou création
const isEditMode = computed(() => route.name === 'ClientEdit');
const clientId = computed(() => route.params.id);

// Déterminer si l'utilisateur est un agent
const isAgent = computed(() => authStore.user?.role === 'agent');

// État
const loading = ref(true);
const submitting = ref(false);
const errors = ref(null);
const successMessage = ref('');
const agents = ref([]);

// Initialiser le formulaire
const form = reactive({
  first_name: '',
  last_name: '',
  id_card_number: '',
  profession: '',
  address: '',
  phone_number: '',
  email: '',
  // Si c'est un agent, on préremplit son ID dans le formulaire
  agent_id: isAgent.value ? authStore.user?.id : '',
  status: 'active'
});

// Charger les données du client en mode édition
onMounted(async () => {
  try {
    // Si l'utilisateur est admin ou super admin, charger la liste des agents
    if (authStore.isAdmin || authStore.isSuperAdmin) {
      await loadAgents();
    }
    
    if (isEditMode.value) {
      const response = await api.getClient(clientId.value);
      
      if (response.data && response.data.status === 'success') {
        const client = response.data.data;
        
        // Remplir le formulaire avec les données du client
        form.first_name = client.first_name;
        form.last_name = client.last_name;
        form.id_card_number = client.id_card_number;
        form.profession = client.profession;
        form.address = client.address;
        form.phone_number = client.phone_number;
        form.email = client.email || '';
        form.agent_id = client.agent_id;
        form.status = client.status;
      } else {
        throw new Error('Impossible de récupérer les informations du client');
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    if (isEditMode.value) {
      // Rediriger vers la liste des clients en cas d'erreur
      router.push('/clients');
    }
  } finally {
    loading.value = false;
  }
});

// Charger la liste des agents disponibles
const loadAgents = async () => {
  try {
    const response = await api.getOrganizationAgents();
    if (response.data && response.data.status === 'success') {
      agents.value = response.data.data;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des agents:', error);
  }
};

// Soumettre le formulaire
const submitForm = async () => {
  submitting.value = true;
  errors.value = null;
  successMessage.value = '';
  
  try {
    // Log des données à envoyer
    console.log('Envoi du formulaire client:', { 
      data: form,
      estAdmin: authStore.isAdmin,
      estSuperAdmin: authStore.isSuperAdmin, 
      estAgent: isAgent.value,
      organisationId: authStore.currentOrganizationId,
      organisation: authStore.currentOrganizationName
    });
    
    let response;
    
    // Édition ou création
    if (isEditMode.value) {
      response = await api.updateClient(clientId.value, form);
    } else {
      response = await api.createClient(form);
    }
    
    console.log('Réponse API:', response.data); // Log de la réponse
    
    if (response.data && response.data.status === 'success') {
      // Afficher un message de succès
      successMessage.value = isEditMode.value 
        ? 'Le client a été mis à jour avec succès!'
        : 'Le client a été créé avec succès!';
      
      // Si création, rediriger vers la page de liste après un court délai
      if (!isEditMode.value) {
        // Réinitialiser le formulaire après création
        Object.keys(form).forEach(key => {
          if (key !== 'agent_id' && key !== 'status') {
            form[key] = '';
          }
        });
        
        // Rediriger vers la liste des clients après un délai plus long (3 secondes)
        // pour permettre à l'API de mettre à jour sa base de données
        setTimeout(() => {
          console.log('Redirection vers la liste des clients avec refresh:', Date.now()); // Log de la redirection
          router.push({
            path: '/clients',
            query: { refresh: Date.now() } // Ajouter un paramètre unique pour forcer le rechargement
          });
        }, 3000); // Augmenter le délai à 3000ms
      } else {
        // En mode édition, rediriger vers la page de détails avec paramètre refresh
        setTimeout(() => {
          console.log('Redirection vers les détails du client avec refresh:', Date.now()); // Log de la redirection
          router.push({
            path: `/clients/${clientId.value}`,
            query: { refresh: Date.now() } // Ajouter un paramètre unique pour forcer le rechargement
          });
        }, 1500);
      }
    } else {
      throw new Error('Une erreur est survenue');
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error);
    
    // Afficher les erreurs de validation
    if (error.response && error.response.status === 422 && error.response.data.errors) {
      errors.value = error.response.data.errors;
      console.log('Erreurs de validation:', errors.value); // Log des erreurs de validation
    } else {
      // Erreur générique
      errors.value = {
        general: ['Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.']
      };
    }
  } finally {
    submitting.value = false;
  }
};

// Retourner à la page précédente
const goBack = () => {
  if (isEditMode.value) {
    router.push(`/clients/${clientId.value}`);
  } else {
    router.push('/clients');
  }
};
</script> 