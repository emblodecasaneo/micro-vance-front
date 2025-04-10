import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import store from './store';
import { useAuthStore } from './store/auth';
import Toast from './components/Toast.vue';
import { provideToast } from './composables/toast';

// Importer les styles Tailwind
import './assets/main.css';

// Création de l'application
const app = createApp(App);
const pinia = createPinia();

// Enregistrer le composant Toast globalement
app.component('Toast', Toast);

// Utiliser les plugins
app.use(pinia);
app.use(router);
app.use(store); // Vuex store

// Configuration explicite pour que le reste du code sache que nous utilisons les deux systèmes
window.$pinia = pinia; // Rendre pinia accessible si nécessaire pour le débogage

// Initialiser le store d'authentification
const authStore = useAuthStore(pinia);

// Configuration du toast global
const { showToast } = provideToast();
app.provide('showToast', showToast);

// Fonction principale pour initialiser l'application
const initApp = async () => {
  try {
    // Initialiser l'authentification (vérifier les tokens existants, etc.)
    await authStore.initialize();
    console.log('Store d\'authentification initialisé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
  } finally {
    // Monter l'application quoi qu'il arrive pour ne pas bloquer l'interface
    app.mount('#app');
    console.log('Application montée');
  }
};

// Démarrer l'application
initApp(); 