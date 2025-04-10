import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS, ERROR_CODES } from './api-config';
import router from '@/router';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: API_TIMEOUT
});

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  response => {
    // Log des réponses pour le débogage
    console.log(`Réponse API ${response.config.method.toUpperCase()} ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  error => {
    // Log des erreurs
    console.error(`Erreur API ${error.config?.method?.toUpperCase() || 'N/A'} ${error.config?.url || 'N/A'}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Gérer l'expiration du token (status 401)
    if (error.response && error.response.status === ERROR_CODES.UNAUTHORIZED) {
      localStorage.removeItem('token');
      // Redirection vers login
      router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } });
    }
    
    return Promise.reject(error);
  }
);

export default {
  // Authentification
  register(userData) {
    return apiClient.post('/auth/register', userData);
  },
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  logout() {
    return apiClient.post('/auth/logout');
  },
  getUser() {
    return apiClient.get('/auth/user');
  },
  
  updateProfile(userData) {
    return apiClient.put('/auth/profile', userData);
  },
  
  getLastLogins() {
    return apiClient.get('/auth/last-logins');
  },
  
  // Clients
  getClients(params) {
    // Ajouter un paramètre timestamp pour éviter le cache
    const paramsWithCacheBuster = { 
      ...params,
      _t: Date.now() 
    };
    
    console.log('Requête getClients avec paramètres:', paramsWithCacheBuster);
    
    // Ajouter des logs plus détaillés
    return apiClient.get('/clients', { 
      params: paramsWithCacheBuster,
      // Augmenter le timeout pour éviter les erreurs de timeout
      timeout: 20000,
      // Ajouter des en-têtes explicites
      headers: {
        ...DEFAULT_HEADERS,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).catch(error => {
      console.error('Erreur dans getClients:', error);
      // Propager l'erreur pour traitement par le composant
      throw error;
    });
  },
  
  // Force le rechargement complet des clients en ignorant le cache
  reloadClients(params = {}) {
    const paramsWithCacheBuster = { 
      ...params,
      _t: Date.now(),
      _reload: true
    };
    
    // Utiliser un header spécial pour forcer l'invalidation du cache
    return apiClient.get('/clients', { 
      params: paramsWithCacheBuster,
      headers: {
        ...DEFAULT_HEADERS,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  },
  
  getClient(id) {
    // Ajouter un paramètre timestamp pour éviter le cache
    return apiClient.get(`/clients/${id}`, { params: { _t: Date.now() } });
  },
  createClient(data) {
    return apiClient.post('/clients', data);
  },
  updateClient(id, data) {
    return apiClient.put(`/clients/${id}`, data);
  },
  deleteClient(id) {
    return apiClient.delete(`/clients/${id}`);
  },
  
  // Prêts
  getLoans(params) {
    return apiClient.get('/loans', { params });
  },
  getLoan(id) {
    return apiClient.get(`/loans/${id}`);
  },
  createLoan(data) {
    return apiClient.post('/loans', data);
  },
  updateLoan(id, data) {
    return apiClient.put(`/loans/${id}`, data);
  },
  approveLoan(id) {
    return apiClient.patch(`/loans/${id}/approve`);
  },
  
  // Remboursements
  getRepayments(loanId, params) {
    return apiClient.get(`/loans/${loanId}/repayments`, { params });
  },
  recordRepayment(loanId, repaymentId, data) {
    return apiClient.post(`/loans/${loanId}/repayments/${repaymentId}/pay`, data);
  },
  missingRepayment(loanId, repaymentId) {
    return apiClient.post(`/loans/${loanId}/repayments/${repaymentId}/miss`);
  },
  getOverdueRepayments(params) {
    return apiClient.get('/repayments/overdue', { params });
  },
  getAllRepayments(params) {
    return apiClient.get('/repayments', { params });
  },
  
  // Épargne
  getSavingsAccounts(params) {
    return apiClient.get('/savings', { params });
  },
  getSavingsAccount(id) {
    return apiClient.get(`/savings/${id}`);
  },
  createSavingsAccount(data) {
    return apiClient.post('/savings', data);
  },
  updateSavingsAccount(id, data) {
    return apiClient.put(`/savings/${id}`, data);
  },
  getSavingsTransactions(accountId, params) {
    return apiClient.get(`/savings/${accountId}/transactions`, { params });
  },
  deposit(accountId, data) {
    return apiClient.post(`/savings/${accountId}/deposit`, data);
  },
  withdraw(accountId, data) {
    return apiClient.post(`/savings/${accountId}/withdraw`, data);
  },
  cancelSavingsTransaction(accountId, transactionId, data) {
    return apiClient.post(`/savings/${accountId}/transactions/${transactionId}/cancel`, data);
  },
  
  // Gestion des utilisateurs d'organisation
  getOrganizationUsers() {
    return apiClient.get('/organization-users');
  },
  getOrganizationUser(id) {
    return apiClient.get(`/organization-users/${id}`);
  },
  addOrganizationUser(userData) {
    return apiClient.post('/organization-users', userData);
  },
  updateOrganizationUserRole(id, roleData) {
    return apiClient.put(`/organization-users/${id}`, roleData);
  },
  removeOrganizationUser(id) {
    return apiClient.delete(`/organization-users/${id}`);
  },
  
  // Rapports
  getReports(type, params) {
    return apiClient.get(`/reports/${type}`, { params });
  },
  
  // Dashboard
  getDashboardStats() {
    return apiClient.get('/dashboard/stats');
  },

  // Rapports
  getLoanReport(params) {
    return apiClient.get('/reports/loans', { params });
  },
  
  getRepaymentReport(params) {
    return apiClient.get('/reports/repayments', { params });
  },
  
  getSavingsReport(params) {
    return apiClient.get('/reports/savings', { params });
  },
  
  getClientReport(params) {
    return apiClient.get('/reports/clients', { params });
  },

  getOrganizationAgents() {
    return apiClient.get('/organization-agents', { params: { _t: Date.now() } });
  }
}; 