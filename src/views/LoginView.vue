<template>
  <div class="min-h-screen flex bg-surface">
    <!-- Bloc de gauche avec description -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary-dark flex-col justify-center px-12 relative overflow-hidden">
      <div class="relative z-10">
        <div class="mb-10">
          <h2 class="text-3xl font-bold text-white mb-2">Micro. Vance</h2>
          <div class="h-1 w-20 bg-white"></div>
        </div>
        
        <h3 class="text-xl font-semibold text-white mb-6">Accédez à votre espace de gestion</h3>
        
        <div class="space-y-6 text-white/90 max-w-md">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <BanknotesIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="text-white font-medium text-lg mb-1">Gestion des prêts</h4>
              <p class="text-sm text-white/80">Suivez tous vos prêts en temps réel avec des tableaux de bord personnalisés et un calendrier de remboursement clair.</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <UsersIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="text-white font-medium text-lg mb-1">Gestion de clientèle</h4>
              <p class="text-sm text-white/80">Centralisez les informations de vos clients, leur historique et analysez leur comportement financier.</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <DevicePhoneMobileIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="text-white font-medium text-lg mb-1">Application mobile</h4>
              <p class="text-sm text-white/80">Restez connecté à votre activité où que vous soyez avec notre application mobile intuitive et sécurisée.</p>
            </div>
          </div>
        </div>
        
        <div class="mt-10 flex items-center text-white/90">
          <StarIcon class="h-5 w-5 text-yellow-300 mr-1" />
          <StarIcon class="h-5 w-5 text-yellow-300 mr-1" />
          <StarIcon class="h-5 w-5 text-yellow-300 mr-1" />
          <StarIcon class="h-5 w-5 text-yellow-300 mr-1" />
          <StarIcon class="h-5 w-5 text-yellow-300 mr-3" />
          <span class="text-sm italic">"Micro. Vance a révolutionné notre gestion de microfinance"</span>
        </div>
      </div>
      
      <!-- Éléments décoratifs en arrière-plan -->
      <div class="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 rounded-full bg-white/5"></div>
      <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 rounded-full bg-white/5"></div>
      <div class="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white/5"></div>
    </div>
    
    <!-- Formulaire de connexion -->
    <div class="w-full lg:w-1/2 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="text-center mb-10">
          <!-- Logo visible seulement sur mobile -->
          <div class="lg:hidden mb-6">
            <h2 class="text-3xl font-extrabold text-primary">Micro. Vance</h2>
            <p class="mt-1 text-sm text-gray-600">Solution complète de gestion de microfinance</p>
          </div>
          
          <h2 class="text-xl font-semibold text-gray-800">Connexion</h2>
          <p class="mt-2 text-sx text-gray-600">Accédez à votre compagnie</p>
        </div>
        
        <div class="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-100">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div v-if="authStore.error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div class="flex">
                <ExclamationCircleIcon class="h-5 w-5 text-red-500 mr-2" />
                <p class="text-sm text-red-700">{{ authStore.error }}</p>
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-xs font-medium text-gray-500 mb-1">Adresse email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email"
                  id="email"
                  v-model="email"
                  required
                  autofocus
                  class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                  placeholder="nom@example.com"
                />
              </div>
            </div>
            
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="password" class="block text-xs font-medium text-gray-500">Mot de passe</label>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Votre mot de passe"
                  class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                    <EyeSlashIcon v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <input 
                id="remember_me" 
                name="remember_me" 
                type="checkbox" 
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label for="remember_me" class="ml-2 block text-xs text-gray-700">
                Rester connecté
              </label>
            </div>
            
            <div>
              <button 
                type="submit" 
                class="w-full flex justify-center btn btn-primary h-[38px] py-2.5" 
                :disabled="authStore.loading"
              >
                <div class="flex text-md items-center">
                  <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <LockClosedIcon v-else class="h-4 w-4 mr-2" />
                  Se connecter
                </div>
              </button>
            </div>
          </form>
        </div>
        
        <div class="text-center mt-6">
          <p class="text-sm text-gray-600">
            Vous n'avez pas encore de compte ?
            <router-link to="/register" class="font-medium text-primary hover:text-primary-dark">
              Créer un compte
            </router-link>
          </p>
        </div>
        
        <!-- Note de bas de page -->
        <div class="mt-12 text-center text-xs text-gray-500">
          © 2025 Micro. Vance - Tous droits réservés
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { 
  ExclamationCircleIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  BanknotesIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  StarIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  await authStore.login({
    email: email.value,
    password: password.value
  });
};
</script>

<style scoped>
.input {
  @apply block w-full shadow-sm text-sm rounded-md border-gray-300 focus:ring-primary focus:border-primary h-10;
}
.btn {
  @apply inline-flex items-center border border-transparent rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary;
}
</style>