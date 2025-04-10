import axios from "axios";
import api from "@/services/api";

export default {
  namespaced: true,
  state: {
    accounts: [],
    account: null,
    transactions: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10
    },
    transactionPagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10
    }
  },
  getters: {
    getAccounts: (state) => state.accounts,
    getAccount: (state) => state.account,
    getTransactions: (state) => state.transactions,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getPagination: (state) => state.pagination,
    getTransactionPagination: (state) => state.transactionPagination,
  },
  mutations: {
    SET_ACCOUNTS(state, accounts) {
      state.accounts = accounts;
    },
    SET_ACCOUNT(state, account) {
      state.account = account;
    },
    SET_TRANSACTIONS(state, transactions) {
      state.transactions = transactions;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    SET_TRANSACTION_PAGINATION(state, pagination) {
      state.transactionPagination = pagination;
    },
    UPDATE_ACCOUNT_BALANCE(state, { accountId, newBalance }) {
      if (state.account && state.account.id === accountId) {
        state.account.balance = newBalance;
      }
      
      const accountIndex = state.accounts.findIndex(account => account.id === accountId);
      if (accountIndex !== -1) {
        state.accounts[accountIndex].balance = newBalance;
      }
    },
    ADD_TRANSACTION(state, transaction) {
      state.transactions.unshift(transaction);
      
      // Mettre à jour si nécessaire la pagination
      if (state.transactions.length > state.transactionPagination.perPage) {
        state.transactions.pop();
      }
      state.transactionPagination.totalItems += 1;
    },
    UPDATE_TRANSACTION_STATUS(state, { transactionId, status }) {
      const transactionIndex = state.transactions.findIndex(t => t.id === transactionId);
      if (transactionIndex !== -1) {
        state.transactions[transactionIndex].status = status;
      }
    }
  },
  actions: {
    // Récupérer la liste des comptes d'épargne
    async fetchAccounts({ commit }, { page = 1, perPage = 10, search = '', status = '' } = {}) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.getSavingsAccounts({ 
          page, 
          per_page: perPage, 
          search, 
          status 
        });
        
        if (response.data.status === 'success') {
          commit('SET_ACCOUNTS', response.data.data.data);
          commit('SET_PAGINATION', {
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
            totalItems: response.data.data.total,
            perPage: response.data.data.per_page
          });
        } else {
          commit('SET_ERROR', 'Erreur lors du chargement des comptes d\'épargne');
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion au serveur');
        console.error('Erreur lors du chargement des comptes d\'épargne', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Récupérer un compte d'épargne spécifique
    async fetchAccount({ commit }, accountId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.getSavingsAccount(accountId);
        
        if (response.data.status === 'success') {
          commit('SET_ACCOUNT', response.data.data);
        } else {
          commit('SET_ERROR', 'Erreur lors du chargement du compte d\'épargne');
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion au serveur');
        console.error('Erreur lors du chargement du compte d\'épargne', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Récupérer les transactions d'un compte d'épargne
    async fetchTransactions({ commit }, { accountId, page = 1, perPage = 10, type = '', startDate = '', endDate = '' } = {}) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.getSavingsTransactions(accountId, { 
          page, 
          per_page: perPage, 
          type, 
          start_date: startDate, 
          end_date: endDate 
        });
        
        if (response.data.status === 'success') {
          commit('SET_TRANSACTIONS', response.data.data.data);
          commit('SET_TRANSACTION_PAGINATION', {
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
            totalItems: response.data.data.total,
            perPage: response.data.data.per_page
          });
        } else {
          commit('SET_ERROR', 'Erreur lors du chargement des transactions');
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion au serveur');
        console.error('Erreur lors du chargement des transactions', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Créer un nouveau compte d'épargne
    async createAccount({ commit }, accountData) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.createSavingsAccount(accountData);
        
        if (response.data.status === 'success') {
          return {
            success: true,
            data: response.data.data
          };
        } else {
          commit('SET_ERROR', 'Erreur lors de la création du compte d\'épargne');
          return { success: false };
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion au serveur');
        console.error('Erreur lors de la création du compte d\'épargne', error);
        return {
          success: false,
          errors: error.response?.data?.errors || {}
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Mettre à jour un compte d'épargne
    async updateAccount({ commit, state }, { accountId, accountData }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.updateSavingsAccount(accountId, accountData);
        
        if (response.data.status === 'success') {
          if (accountData.status === 'closed') {
            // Si le compte est fermé, on peut le retirer de la liste
            commit('SET_ACCOUNTS', state.accounts.filter(account => account.id !== accountId));
          }
          
          return {
            success: true,
            data: response.data.data
          };
        } else {
          commit('SET_ERROR', 'Erreur lors de la mise à jour du compte d\'épargne');
          return { success: false };
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion au serveur');
        console.error('Erreur lors de la mise à jour du compte d\'épargne', error);
        return {
          success: false,
          errors: error.response?.data?.errors || {}
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Effectuer un dépôt sur un compte d'épargne
    async depositToAccount({ commit }, { accountId, depositData }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.deposit(accountId, depositData);
        
        if (response.data.status === 'success') {
          // Mettre à jour le solde du compte dans l'état
          commit('UPDATE_ACCOUNT_BALANCE', {
            accountId,
            newBalance: response.data.data.account.balance
          });
          
          // Ajouter la transaction à la liste des transactions
          commit('ADD_TRANSACTION', response.data.data.transaction);
          
          return {
            success: true,
            data: response.data.data
          };
        } else {
          commit('SET_ERROR', 'Erreur lors du dépôt');
          return { success: false };
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion au serveur');
        console.error('Erreur lors du dépôt', error);
        return {
          success: false,
          errors: error.response?.data?.errors || {}
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Effectuer un retrait sur un compte d'épargne
    async withdrawFromAccount({ commit }, { accountId, withdrawData }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.withdraw(accountId, withdrawData);
        
        if (response.data.status === 'success') {
          // Mettre à jour le solde du compte dans l'état
          commit('UPDATE_ACCOUNT_BALANCE', {
            accountId,
            newBalance: response.data.data.account.balance
          });
          
          // Ajouter la transaction à la liste des transactions
          commit('ADD_TRANSACTION', response.data.data.transaction);
          
          return {
            success: true,
            data: response.data.data
          };
        } else {
          commit('SET_ERROR', 'Erreur lors du retrait');
          return { success: false };
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion au serveur');
        console.error('Erreur lors du retrait', error);
        return {
          success: false,
          errors: error.response?.data?.errors || {}
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Annuler une transaction
    async cancelTransaction({ commit }, { accountId, transactionId, reason }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await api.cancelSavingsTransaction(accountId, transactionId, { reason });
        
        if (response.data.status === 'success') {
          // Mettre à jour le statut de la transaction dans l'état
          commit('UPDATE_TRANSACTION_STATUS', {
            transactionId,
            status: 'cancelled'
          });
          
          // Mettre à jour le solde du compte dans l'état
          commit('UPDATE_ACCOUNT_BALANCE', {
            accountId,
            newBalance: response.data.data.account.balance
          });
          
          return {
            success: true,
            data: response.data.data
          };
        } else {
          commit('SET_ERROR', 'Erreur lors de l\'annulation de la transaction');
          return { success: false };
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion au serveur');
        console.error('Erreur lors de l\'annulation de la transaction', error);
        return {
          success: false,
          errors: error.response?.data?.errors || {}
        };
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
}; 