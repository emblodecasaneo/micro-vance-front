<template>
  <div class="min-h-screen flex bg-surface">
    <!-- Bloc de gauche avec description -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary-dark flex-col justify-center px-12 relative overflow-hidden">
      <div class="relative z-10">
        <div class="mb-10">
          <h2 class="text-3xl font-bold text-white mb-2">Micro. Vance</h2>
          <div class="h-1 w-20 bg-white"></div>
        </div>
        
        <h3 class="text-xl font-semibold text-white mb-6">Simplifiez votre gestion de microfinance</h3>
        
        <div class="space-y-6 text-white/90 max-w-md">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <CreditCardIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="text-white font-medium text-lg mb-1">Prêts et épargne simplifiés</h4>
              <p class="text-sm text-white/80">Gérez tous vos clients, suivez les prêts et l'épargne avec une interface intuitive et moderne.</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <ChartBarIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="text-white font-medium text-lg mb-1">Analyses et rapports</h4>
              <p class="text-sm text-white/80">Visualisez vos performances et générez des rapports détaillés pour mieux comprendre votre activité.</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <ShieldCheckIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="text-white font-medium text-lg mb-1">Sécurité et conformité</h4>
              <p class="text-sm text-white/80">Vos données sont sécurisées et notre système est conforme aux réglementations financières locales.</p>
            </div>
          </div>
        </div>
        
        <div class="mt-10 flex items-center text-white/90">
          <span class="text-sm">Des milliers d'institutions de microfinance font confiance à notre plateforme</span>
        </div>
      </div>
      
      <!-- Éléments décoratifs en arrière-plan -->
      <div class="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 rounded-full bg-white/5"></div>
      <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 rounded-full bg-white/5"></div>
      <div class="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white/5"></div>
    </div>
    
    <!-- Formulaire d'inscription -->
    <div class="w-full lg:w-1/2 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="text-center mb-6">
          <!-- Logo visible seulement sur mobile -->
          <div class="lg:hidden mb-6">
            <h2 class="text-2xl font-extrabold text-primary">Micro. Vance</h2>
            <p class="mt-1 text-sm text-gray-600">Simplifiez votre gestion de microfinance</p>
          </div>
          
          <h2 class="text-xl font-semibold text-gray-800">Créez votre compte</h2>
          <p class="mt-2 text-sm text-gray-600">Commencez à gérer votre microfinance en quelques minutes</p>
        </div>

        <div class="bg-white py-5 px-6 shadow rounded-lg">
          <!-- Tabs en haut -->
          <div class="flex justify-center mb-8">
            <div class="grid grid-cols-2 w-full gap-3">
              <button 
                @click="activeTab = 'personal'" 
                class="flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-medium focus:outline-none transition-all duration-200"
                :class="activeTab === 'personal' ? 'bg-primary/5 border-primary border-b-2 text-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
              >
                <span>Informations personnelles</span>
              </button>
              
              <button 
                @click="activeTab = 'organization'" 
                class="flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-medium focus:outline-none transition-all duration-200"
                :class="activeTab === 'organization' ? 'bg-primary/5 border-primary border-b-2 text-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
              >
                <span>Votre organisation</span>
              </button>
            </div>
          </div>
          
          <div v-if="authStore.error" class="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mb-4 text-xs">
            <div class="flex">
              <ExclamationCircleIcon class="h-4 w-4 text-red-500 mr-1" />
              <p class="text-red-700">{{ authStore.error }}</p>
            </div>
          </div>
          
          <form @submit.prevent="handleRegister">
            <div v-if="activeTab === 'personal'" class="space-y-4">
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text"
                    id="name"
                    v-model="name"
                    required
                    class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>
              
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="email"
                    id="email"
                    v-model="email"
                    required
                    class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="password"
                    required
                    class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    placeholder="Mot de passe (8 caractères minimum)"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      type="button" 
                      @click="showPassword = !showPassword"
                      class="text-gray-400 hover:text-gray-500"
                    >
                      <EyeIcon v-if="!showPassword" class="h-4 w-4" />
                      <EyeSlashIcon v-else class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    :type="showPassword ? 'text' : 'password'"
                    id="password_confirmation"
                    v-model="passwordConfirmation"
                    required
                    class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              </div>
              
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <select 
                    id="role"
                    v-model="role"
                    required
                    class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    >
                    <option value="">Sélectionnez un rôle</option>
                    <option value="admin">Administrateur</option>
                    <option value="agent">Gestionnaire</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'organization'" class="space-y-4">
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingOfficeIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text"
                    id="organization_name"
                    v-model="organizationName"
                    required
                    class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    placeholder="Nom de votre microfinance"
                  />
                </div>
              </div>
              
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <select 
                    id="organization_type"
                    v-model="organizationType"
                    required
                    class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    >
                    <option value="">Sélectionnez un type</option>
                    <option value="microfinance">Microfinance</option>
                    <option value="cooperative">Coopérative d'épargne</option>
                    <option value="bank">Banque communautaire</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GlobeAltIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <select 
                    id="country"
                    v-model="country"
                    required
                    class="block w-full pl-10 text-xs focus:ring-primary focus:border-primary focus:outline-none rounded-md h-[34px] px-3 border border-gray-300"
                    >
                    <option value="">Sélectionnez un pays</option>
                    <option value="CD">République Démocratique du Congo</option>
                    <option value="CG">Congo-Brazzaville</option>
                    <option value="RW">Rwanda</option>
                    <option value="BI">Burundi</option>
                    <option value="UG">Ouganda</option>
                    <option value="TZ">Tanzanie</option>
                    <option value="KE">Kenya</option>
                    <option value="SN">Sénégal</option>
                    <option value="CI">Côte d'Ivoire</option>
                    <option value="CM">Cameroun</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="ML">Mali</option>
                    <option value="NE">Niger</option>
                    <option value="BJ">Bénin</option>
                    <option value="TG">Togo</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Barre de progression avec boutons suivant/précédent -->
            <div class="my-4 flex items-center justify-between">
              <button 
                v-if="activeTab === 'organization'"
                type="button" 
                @click="activeTab = 'personal'"
                class="inline-flex items-center text-xs font-medium text-primary"
              >
                <ArrowLeftIcon class="h-3 w-3 mr-1" />
                Précédent
              </button>
              <div v-else class="opacity-0">Espace</div>
              
              <div class="flex items-center space-x-1">
                <div class="h-1.5 w-5 rounded-full" :class="activeTab === 'personal' ? 'bg-primary' : 'bg-gray-200'"></div>
                <div class="h-1.5 w-5 rounded-full" :class="activeTab === 'organization' ? 'bg-primary' : 'bg-gray-200'"></div>
              </div>
              
              <button 
                v-if="activeTab === 'personal' && isStep1Valid"
                type="button" 
                @click="activeTab = 'organization'"
                class="inline-flex items-center text-xs font-medium text-primary"
              >
                Suivant
                <ArrowRightIcon class="h-3 w-3 ml-1" />
              </button>
              <div v-else class="opacity-0">Espace</div>
            </div>
            
            <!-- Séparateur -->
            <div class="my-4 border-t border-gray-200"></div>
            
            <!-- Bouton de création de compte et lien de connexion -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div class="text-xs text-gray-600">
                Vous avez déjà un compte?
                <router-link to="/login" class="font-medium text-primary hover:text-primary-dark">
                  Se connecter
                </router-link>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary px-2 py-1.5 text-sm w-auto" 
                :disabled="authStore.loading || !isFormValid || (activeTab === 'personal' && !isStep1Valid)"
              >
                <div class="flex items-center justify-center">
                  <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <UserPlusIcon v-else class="h-4 w-4 mr-1.5" />
                  <span>Valider</span>
                </div>
              </button>
            </div>
          </form>
        </div>
        
        <!-- Note de bas de page -->
        <div class="mt-5 text-center text-xs text-gray-500">
          © 2025 Micro. Vance - Tous droits réservés
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { 
  ExclamationCircleIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  TagIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();

// État actif du formulaire (quel côté est actif)
const activeTab = ref('personal');

// Données du formulaire - Informations personnelles
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const role = ref('');
const showPassword = ref(false);

// Données du formulaire - Informations de l'organisation
const organizationName = ref('');
const organizationType = ref('');
const country = ref('');

// Calculer si l'étape 1 est valide
const isStep1Valid = computed(() => {
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value || !role.value) {
    return false;
  }
  
  if (password.value !== passwordConfirmation.value) {
    return false;
  }
  
  if (password.value.length < 8) {
    return false;
  }
  
  // Valider l'e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    return false;
  }
  
  return true;
});

// Calculer si le formulaire entier est valide
const isFormValid = computed(() => {
  if (!isStep1Valid.value) {
    return false;
  }
  
  if (!organizationName.value || !organizationType.value || !country.value) {
    return false;
  }
  
  return true;
});

// Soumettre le formulaire d'inscription
const handleRegister = async () => {
  if (!isFormValid.value) {
    // S'il y a des erreurs de validation côté personnel, afficher ce côté
    if (!isStep1Valid.value) {
      activeTab.value = 'personal';
      alert('Veuillez compléter correctement les informations personnelles');
    } else {
      activeTab.value = 'organization';
      alert('Veuillez compléter les informations de l\'organisation');
    }
    return;
  }
  
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      role: role.value,
      organization_name: organizationName.value,
      organization_type: organizationType.value,
      organization_country: country.value
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
  }
};
</script>

<style scoped>
.form-label {
  @apply block text-xs font-medium text-gray-700 mb-0.5;
}
.input {
  @apply block w-full shadow-sm text-sm rounded-md border-gray-300 focus:ring-primary focus:border-primary h-9;
}
.btn {
  @apply inline-flex items-center border border-transparent rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500;
}
</style>