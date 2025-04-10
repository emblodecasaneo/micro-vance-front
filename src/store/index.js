import { createStore } from 'vuex';
import savingsModule from './savings';

// Créer le store Vuex
const store = createStore({
  modules: {
    savings: savingsModule,
    // Autres modules Vuex peuvent être ajoutés ici
  }
});

export default store; 