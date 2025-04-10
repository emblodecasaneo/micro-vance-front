import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    initialized: false,
    currentOrganization: null, // L'organisation (microfinance) active
    organizations: [] // Liste des organisations auxquelles l'utilisateur a accès
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    
    // Rôles au niveau SaaS
    isSuperAdmin: (state) => state.user?.role === 'super_admin',
    
    // Rôles au niveau organisation
    isAdmin: (state) => state.user?.role === 'admin',
    isAgent: (state) => state.user?.role === 'agent',
    
    // Vérifier si l'utilisateur a une organisation active
    hasOrganization: (state) => !!state.currentOrganization,
    
    // Obtenir l'ID de l'organisation active
    currentOrganizationId: (state) => state.currentOrganization?.id || null,
    
    // Obtenir le nom de l'organisation active
    currentOrganizationName: (state) => state.currentOrganization?.name || null,
    
    // Vérifie si l'utilisateur a accès à plusieurs organisations
    hasMultipleOrganizations: (state) => state.organizations.length > 1
  },
  
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.login(credentials);
        
        if (response.data.status === 'success') {
          const { token, user, organizations } = response.data;
          
          this.token = token;
          this.user = user;
          
          // Stocker les organisations si disponibles
          if (organizations) {
            this.organizations = organizations;
            
            // Définir l'organisation active par défaut (la première)
            if (organizations.length > 0) {
              this.currentOrganization = organizations[0];
            }
          }
          
          localStorage.setItem('token', token);
          
          // Redirection
          const redirectPath = router.currentRoute.value.query.redirect || '/';
          router.push(redirectPath);
          
          return true;
        } else {
          throw new Error(response.data.message || 'Échec de la connexion');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Échec de la connexion';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.register(userData);
        
        if (response.data.status === 'success') {
          const { token, user, organization } = response.data;
          
          this.token = token;
          this.user = user;
          
          // Si une organisation a été créée lors de l'inscription
          if (organization) {
            this.organizations = [organization];
            this.currentOrganization = organization;
          }
          
          localStorage.setItem('token', token);
          
          // Redirection
          router.push('/');
          
          return true;
        } else {
          throw new Error(response.data.message || 'Échec de l\'inscription');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Échec de l\'inscription';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Changer l'organisation active
    setCurrentOrganization(organizationId) {
      const organization = this.organizations.find(org => org.id == organizationId);
      if (organization) {
        this.currentOrganization = organization;
        
        // On pourrait aussi faire une requête API pour confirmer le changement côté serveur
        // api.switchOrganization(organizationId)
        
        // Recharger la page pour actualiser les données avec la nouvelle organisation
        router.go(0);
        return true;
      }
      return false;
    },
    
    async logout() {
      this.loading = true;
      
      try {
        if (this.token) {
          try {
            // On continue même si la déconnexion échoue côté serveur
            await api.logout();
          } catch (e) {
            console.warn('Erreur lors de la déconnexion côté serveur:', e);
          }
        }
        
        // Nettoyage
        this.token = null;
        this.user = null;
        this.currentOrganization = null;
        this.organizations = [];
        localStorage.removeItem('token');
        
        // Redirection
        router.push('/login');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return null;
      
      this.loading = true;
      
      try {
        console.log('Récupération des informations utilisateur...');
        const response = await api.getUser();
        
        if (response.data && response.data.status === 'success') {
          if (response.data.user) {
            console.log('Utilisateur récupéré avec succès:', response.data.user.name);
            this.user = response.data.user;
            
            // Mise à jour des informations d'organisation
            if (response.data.organizations) {
              console.log('Organisations récupérées:', response.data.organizations);
              this.organizations = response.data.organizations;
              
              // Si l'API renvoie une organisation actuelle
              if (response.data.current_organization) {
                console.log('Organisation actuelle définie par le serveur:', response.data.current_organization.name);
                this.currentOrganization = response.data.current_organization;
              }
              // Sinon, définir l'organisation active si ce n'est pas déjà fait
              else if (this.organizations.length > 0 && !this.currentOrganization) {
                console.log('Aucune organisation actuelle définie par le serveur, utilisation de la première:', this.organizations[0].name);
                this.currentOrganization = this.organizations[0];
              }
            } else {
              console.log('Aucune organisation récupérée');
            }
            
            this.initialized = true;
            return this.user;
          } else {
            throw new Error('Données utilisateur invalides dans la réponse');
          }
        } else {
          throw new Error(response.data?.message || 'Impossible de récupérer les informations utilisateur');
        }
      } catch (error) {
        console.error('Erreur dans fetchCurrentUser:', error);
        this.error = error.response?.data?.message || error.message || 'Impossible de récupérer les informations utilisateur';
        
        // Si le token est invalide ou expiré
        if (error.response?.status === 401) {
          console.log('Token invalide ou expiré, déconnexion...');
          localStorage.removeItem('token');
          this.token = null;
          this.user = null;
          this.currentOrganization = null;
          this.organizations = [];
        }
        
        throw error; // Propager l'erreur pour que le routeur puisse la gérer
      } finally {
        this.loading = false;
      }
    },
    
    // Méthode pour initialiser le store au démarrage de l'application
    async initialize() {
      if (this.initialized) return;
      
      if (this.token) {
        try {
          await this.fetchCurrentUser();
        } catch (error) {
          console.error('Erreur lors de l\'initialisation du store d\'authentification:', error);
        }
      }
      
      this.initialized = true;
    },
    
    async updateProfile(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.updateProfile(userData);
        
        if (response.data.status === 'success') {
          // Mettre à jour l'utilisateur dans le store
          this.user = response.data.user;
          return true;
        } else {
          throw new Error(response.data.message || 'Échec de la mise à jour du profil');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Échec de la mise à jour du profil';
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
}); 