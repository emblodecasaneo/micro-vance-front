import { defineStore } from 'pinia';
import api from '@/services/api';

export const useClientStore = defineStore('clients', {
  state: () => ({
    clients: [],
    client: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      perPage: 10,
      totalItems: 0
    },
    filters: {
      search: '',
      status: '',
      agentId: ''
    }
  }),
  
  getters: {
    getClientById: (state) => (id) => {
      return state.clients.find(client => client.id === id) || null;
    },
    
    totalActive: (state) => {
      return state.clients.filter(client => client.status === 'active').length;
    },
    
    totalInactive: (state) => {
      return state.clients.filter(client => client.status === 'inactive').length;
    },
    
    totalBlacklisted: (state) => {
      return state.clients.filter(client => client.status === 'blacklisted').length;
    }
  },
  
  actions: {
    async fetchClients(page = 1, params = {}) {
      this.loading = true;
      this.error = null;
      
      // Fusionner les paramètres avec les filtres
      const queryParams = {
        page,
        per_page: this.pagination.perPage,
        ...this.filters,
        ...params
      };
      
      if (!queryParams.search) delete queryParams.search;
      if (!queryParams.status) delete queryParams.status;
      if (!queryParams.agentId) delete queryParams.agentId;
      
      try {
        const response = await api.getClients(queryParams);
        
        if (response.data && response.data.status === 'success') {
          this.clients = response.data.data;
          
          // Mettre à jour la pagination
          if (response.data.meta) {
            this.pagination = {
              currentPage: response.data.meta.current_page,
              totalPages: response.data.meta.last_page,
              perPage: response.data.meta.per_page,
              totalItems: response.data.meta.total
            };
          }
          
          return this.clients;
        } else {
          throw new Error('Impossible de récupérer la liste des clients');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Erreur lors du chargement des clients';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async fetchClient(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.getClient(id);
        
        if (response.data && response.data.status === 'success') {
          this.client = response.data.data;
          return this.client;
        } else {
          throw new Error('Impossible de récupérer les informations du client');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Erreur lors du chargement du client';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createClient(clientData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.createClient(clientData);
        
        if (response.data && response.data.status === 'success') {
          // Ajouter le nouveau client à la liste si nécessaire
          this.clients = [response.data.data, ...this.clients];
          return response.data.data;
        } else {
          throw new Error('Impossible de créer le client');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la création du client';
        throw error; // Propager l'erreur pour la gestion dans le composant
      } finally {
        this.loading = false;
      }
    },
    
    async updateClient(id, clientData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.updateClient(id, clientData);
        
        if (response.data && response.data.status === 'success') {
          // Mettre à jour les données du client
          this.client = response.data.data;
          
          // Mettre à jour la liste des clients si nécessaire
          const index = this.clients.findIndex(c => c.id === id);
          if (index !== -1) {
            this.clients[index] = this.client;
          }
          
          return this.client;
        } else {
          throw new Error('Impossible de mettre à jour le client');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du client';
        throw error; // Propager l'erreur pour la gestion dans le composant
      } finally {
        this.loading = false;
      }
    },
    
    async deleteClient(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.deleteClient(id);
        
        if (response.data && response.data.status === 'success') {
          // Supprimer le client de la liste
          this.clients = this.clients.filter(c => c.id !== id);
          
          // Réinitialiser le client sélectionné si c'est le même
          if (this.client && this.client.id === id) {
            this.client = null;
          }
          
          return true;
        } else {
          throw new Error('Impossible de supprimer le client');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la suppression du client';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Mettre à jour les filtres
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
      // Réinitialiser la pagination lors du changement de filtres
      this.pagination.currentPage = 1;
    },
    
    // Réinitialiser les filtres
    resetFilters() {
      this.filters = {
        search: '',
        status: '',
        agentId: ''
      };
    },
    
    // Changer le nombre d'éléments par page
    setPerPage(perPage) {
      this.pagination.perPage = perPage;
      this.pagination.currentPage = 1;
    }
  }
}); 