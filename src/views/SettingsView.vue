<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>
    
    <div class="space-y-8">
      <!-- Section mot de passe -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 mb-4">Modifier le mot de passe</h2>
        <div class="bg-gray-50 p-4 rounded-md">
          <form @submit.prevent="updatePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
              <input 
                type="password"
                v-model="passwordData.current_password"
                class="w-full md:w-2/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <input 
                type="password"
                v-model="passwordData.new_password"
                class="w-full md:w-2/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
              />
              <p class="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmation du mot de passe</label>
              <input 
                type="password"
                v-model="passwordData.new_password_confirmation"
                class="w-full md:w-2/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
              />
            </div>
            
            <div class="pt-2">
              <button 
                type="submit"
                class="bg-primary text-white rounded-md px-4 py-2 hover:bg-primary-dark"
                :disabled="passwordLoading"
              >
                <div class="flex items-center">
                  <svg v-if="passwordLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mettre à jour le mot de passe
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Section Préférences d'interface -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 mb-4">Préférences d'interface</h2>
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Thème</label>
              <div class="flex space-x-4">
                <button 
                  @click="setTheme('light')"
                  class="px-4 py-2 rounded-md border text-sm"
                  :class="theme === 'light' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'"
                >
                  Clair
                </button>
                <button 
                  @click="setTheme('dark')"
                  class="px-4 py-2 rounded-md border text-sm"
                  :class="theme === 'dark' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'"
                >
                  Sombre
                </button>
                <button 
                  @click="setTheme('system')"
                  class="px-4 py-2 rounded-md border text-sm"
                  :class="theme === 'system' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'"
                >
                  Système
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="email-notifications" 
                    v-model="preferences.emailNotifications"
                    class="rounded text-primary focus:ring-primary"
                  />
                  <label for="email-notifications" class="ml-2 text-sm text-gray-700">Recevoir des notifications par email</label>
                </div>
                
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="browser-notifications" 
                    v-model="preferences.browserNotifications"
                    class="rounded text-primary focus:ring-primary"
                  />
                  <label for="browser-notifications" class="ml-2 text-sm text-gray-700">Recevoir des notifications dans le navigateur</label>
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
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useToastStore } from '@/store/toast';

const authStore = useAuthStore();
const toastStore = useToastStore();
const passwordLoading = ref(false);
const passwordError = ref(null);

// Données du formulaire de changement de mot de passe
const passwordData = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
});

// Préférences d'interface
const preferences = ref({
  emailNotifications: true,
  browserNotifications: false
});

// Thème
const theme = ref('light');

// Mettre à jour le mot de passe
const updatePassword = async () => {
  passwordLoading.value = true;
  passwordError.value = null;

  // Vérifier que tous les champs sont remplis
  if (!passwordData.value.current_password || !passwordData.value.new_password || !passwordData.value.new_password_confirmation) {
    passwordError.value = 'Veuillez remplir tous les champs';
    toastStore.error(passwordError.value);
    passwordLoading.value = false;
    return;
  }

  // Vérifier que les nouveaux mots de passe correspondent
  if (passwordData.value.new_password !== passwordData.value.new_password_confirmation) {
    passwordError.value = 'Les nouveaux mots de passe ne correspondent pas';
    toastStore.error(passwordError.value);
    passwordLoading.value = false;
    return;
  }

  try {
    // Simuler une mise à jour de mot de passe (à remplacer par l'appel API réel)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Réinitialiser le formulaire après succès
    passwordData.value = {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    };
    
    // Afficher un message de succès
    toastStore.success('Mot de passe mis à jour avec succès !');
  } catch (err) {
    passwordError.value = err.message || 'Une erreur est survenue';
    toastStore.error(passwordError.value);
  } finally {
    passwordLoading.value = false;
  }
};

// Changer le thème
const setTheme = (newTheme) => {
  theme.value = newTheme;
  toastStore.success(`Thème ${newTheme} appliqué !`);
};

// Sauvegarder les préférences
const savePreferences = async () => {
  prefLoading.value = true;
  
  try {
    // Simuler une mise à jour des préférences (à remplacer par l'appel API réel)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Afficher un message de succès
    toastStore.success('Préférences mises à jour avec succès !');
  } catch (err) {
    toastStore.error(err.message || 'Une erreur est survenue');
  } finally {
    prefLoading.value = false;
  }
};
</script> 