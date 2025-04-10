import { ref, provide, inject } from 'vue';

// Créer une référence pour stocker l'état global des toasts
const toasts = ref([]);

// Générer un ID unique pour chaque toast
const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function provideToast() {
  // Fonction pour afficher un toast
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = generateId();
    
    // Ajouter le toast à la liste
    toasts.value.push({
      id,
      message,
      type,
      duration
    });
    
    // Supprimer le toast après la durée spécifiée
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };
  
  // Fonction pour supprimer un toast
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  // Fournir le composable via l'API Provide/Inject
  provide('toast', {
    toasts,
    showToast,
    removeToast
  });
  
  return {
    toasts,
    showToast,
    removeToast
  };
}

export function useToast() {
  // Récupérer le composable via l'API Provide/Inject
  const toast = inject('toast');
  
  // Si le composable n'est pas fourni, créer une implémentation par défaut
  if (!toast) {
    console.warn('useToast() called without a provider. Make sure to call provideToast() in your App.vue or main.js.');
    return {
      toasts: ref([]),
      showToast: (message, type = 'info', duration = 3000) => {
        console.warn(`Toast not provided: ${type} - ${message}`);
      },
      removeToast: () => {}
    };
  }
  
  return toast;
} 