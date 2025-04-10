import { defineStore } from 'pinia';
import api from '@/services/api';
import { useAuthStore } from './auth';

export const useOrganizationUsersStore = defineStore('organizationUsers', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    formError: null
  }),
  
  getters: {
    // Utilisateurs filtrés par rôle
    admins: (state) => state.users.filter(user => user.pivot?.role === 'admin'),
    agents: (state) => state.users.filter(user => user.pivot?.role === 'agent'),
    
    // Vérifie si on peut ajouter/modifier des utilisateurs
    canManageUsers: () => {
      const authStore = useAuthStore();
      return authStore.isAdmin || authStore.isSuperAdmin;
    }
  },
  
  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.getOrganizationUsers();
        
        if (response.data.status === 'success') {
          this.users = response.data.users || [];
          return this.users;
        } else {
          throw new Error(response.data.message || 'Impossible de récupérer les utilisateurs');
        }
      } catch (error) {
        console.error('Erreur dans fetchUsers:', error);
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la récupération des utilisateurs';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUser(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.getOrganizationUser(id);
        
        if (response.data.status === 'success') {
          this.currentUser = response.data.user;
          return this.currentUser;
        } else {
          throw new Error(response.data.message || 'Impossible de récupérer l\'utilisateur');
        }
      } catch (error) {
        console.error('Erreur dans fetchUser:', error);
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la récupération de l\'utilisateur';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async addUser(userData) {
      this.loading = true;
      this.formError = null;
      
      try {
        const response = await api.addOrganizationUser(userData);
        
        if (response.data.status === 'success') {
          // Ajouter l'utilisateur à la liste si la récupération a réussi
          await this.fetchUsers();
          return response.data.user;
        } else {
          throw new Error(response.data.message || 'Impossible d\'ajouter l\'utilisateur');
        }
      } catch (error) {
        console.error('Erreur dans addUser:', error);
        this.formError = error.response?.data?.message || error.message || 'Erreur lors de l\'ajout de l\'utilisateur';
        
        // Si on a des erreurs de validation, les rendre accessibles
        if (error.response?.data?.errors) {
          this.formError = Object.values(error.response.data.errors)
            .flat()
            .join(', ');
        }
        
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateUserRole(id, roleData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.updateOrganizationUserRole(id, roleData);
        
        if (response.data.status === 'success') {
          // Mettre à jour l'utilisateur dans la liste
          const index = this.users.findIndex(u => u.id == id);
          if (index !== -1) {
            this.users[index].pivot.role = roleData.role;
          }
          
          // Si c'est l'utilisateur courant, mettre à jour aussi
          if (this.currentUser && this.currentUser.id == id) {
            this.currentUser.pivot.role = roleData.role;
          }
          
          return true;
        } else {
          throw new Error(response.data.message || 'Impossible de mettre à jour le rôle');
        }
      } catch (error) {
        console.error('Erreur dans updateUserRole:', error);
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du rôle';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async removeUser(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.removeOrganizationUser(id);
        
        if (response.data.status === 'success') {
          // Retirer l'utilisateur de la liste
          this.users = this.users.filter(u => u.id != id);
          
          // Si c'est l'utilisateur courant, le réinitialiser
          if (this.currentUser && this.currentUser.id == id) {
            this.currentUser = null;
          }
          
          return true;
        } else {
          throw new Error(response.data.message || 'Impossible de retirer l\'utilisateur');
        }
      } catch (error) {
        console.error('Erreur dans removeUser:', error);
        this.error = error.response?.data?.message || error.message || 'Erreur lors du retrait de l\'utilisateur';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    clearError() {
      this.error = null;
      this.formError = null;
    }
  }
}); 