import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [],
    nextId: 0
  }),
  
  actions: {
    // Ajouter une notification toast
    addToast(message, type = 'success', duration = 3000) {
      const id = this.nextId++;
      
      // Ajouter le toast à la liste
      this.toasts.push({
        id,
        message,
        type, // 'success', 'error', 'info', 'warning'
        duration
      });
      
      // Supprimer automatiquement après la durée spécifiée
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
      
      return id;
    },
    
    // Supprimer une notification toast par son ID
    removeToast(id) {
      const index = this.toasts.findIndex(toast => toast.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },
    
    // Raccourcis pour différents types de toasts
    success(message, duration = 3000) {
      return this.addToast(message, 'success', duration);
    },
    
    error(message, duration = 4000) {
      return this.addToast(message, 'error', duration);
    },
    
    info(message, duration = 3000) {
      return this.addToast(message, 'info', duration);
    },
    
    warning(message, duration = 3000) {
      return this.addToast(message, 'warning', duration);
    }
  }
}); 