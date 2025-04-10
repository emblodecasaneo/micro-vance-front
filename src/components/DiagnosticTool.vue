<template>
  <div class="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
    <h2 class="text-sm font-medium text-gray-800 mb-3">Outil de diagnostic API</h2>
    
    <!-- Boutons de test -->
    <div class="flex space-x-2 mb-3">
      <button 
        @click="testClientsAPI" 
        class="bg-primary hover:bg-primary-dark text-white py-1.5 px-3 rounded-md text-xs font-medium"
        :disabled="loading"
      >
        <span v-if="loading" class="inline-block animate-spin mr-1">⟳</span>
        Tester récupération clients
      </button>
      
      <button 
        @click="resetLogs" 
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 px-3 rounded-md text-xs font-medium"
      >
        Effacer les logs
      </button>
    </div>
    
    <!-- Test de création de client -->
    <div class="mt-3 p-3 bg-primary bg-opacity-5 rounded-md border border-primary border-opacity-20">
      <h3 class="text-xs font-medium text-gray-700 mb-2">Test de création de client</h3>
      <div class="flex gap-2 mb-2">
        <button 
          @click="createTestClient" 
          class="bg-secondary hover:bg-secondary-dark text-white py-1.5 px-3 rounded-md text-xs font-medium"
          :disabled="createLoading"
        >
          <span v-if="createLoading" class="inline-block animate-spin mr-1">⟳</span>
          Créer un client test
        </button>
      </div>

      <div v-if="newClientData" class="bg-white p-2 rounded-md border border-gray-200 mt-2">
        <h4 class="text-xs font-medium text-gray-700 mb-1">Client créé:</h4>
        <pre class="text-xs bg-gray-50 p-2 overflow-auto rounded-md max-h-32">{{ JSON.stringify(newClientData, null, 2) }}</pre>
      </div>
    </div>
    
    <!-- Panneau de logs -->
    <div class="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
      <h3 class="text-xs font-medium text-gray-700 flex items-center justify-between mb-2">
        <span>Logs de diagnostic:</span>
        <span class="text-xs text-gray-500">{{ logs.length }} entrées</span>
      </h3>
      <div v-if="logs.length === 0" class="text-gray-500 italic text-xs">
        Aucun log pour le moment
      </div>
      <div v-else class="h-64 overflow-auto">
        <div v-for="(log, index) in logs" :key="index" class="mb-1.5 p-1.5 rounded-md text-xs" :class="getLogClass(log.type)">
          <div class="font-medium">{{ log.title }}</div>
          <pre class="text-xs overflow-x-auto whitespace-pre-wrap">{{ log.content }}</pre>
        </div>
      </div>
    </div>

    <div class="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
      <h3 class="text-xs font-medium text-gray-700 mb-2">Informations utilisateur</h3>
      <button 
        @click="loadUserInfo" 
        class="bg-primary hover:bg-primary-dark text-white py-1.5 px-3 rounded-md text-xs font-medium mb-2"
        :disabled="loading"
      >
        <span v-if="userLoading" class="inline-block animate-spin mr-1">⟳</span>
        Charger les infos utilisateur
      </button>
      
      <div v-if="userInfo" class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="bg-white p-2 rounded-md border border-gray-200">
          <h4 class="text-xs font-medium text-gray-700 mb-1">Utilisateur connecté:</h4>
          <pre class="text-xs bg-gray-50 p-2 overflow-auto rounded-md max-h-32">{{ JSON.stringify(userInfo, null, 2) }}</pre>
        </div>
        
        <div class="bg-white p-2 rounded-md border border-gray-200">
          <h4 class="text-xs font-medium text-gray-700 mb-1">Agents disponibles:</h4>
          <div v-if="agents.length === 0" class="text-xs text-gray-500 italic">
            Aucun agent disponible
          </div>
          <div v-else class="overflow-auto max-h-32">
            <div v-for="agent in agents" :key="agent.id" class="mb-1 p-1.5 bg-gray-50 rounded-md text-xs">
              <div><span class="font-medium">ID:</span> {{ agent.id }}</div>
              <div><span class="font-medium">Nom:</span> {{ agent.name }}</div>
              <div><span class="font-medium">Email:</span> {{ agent.email }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api-config';

const logs = ref([]);
const loading = ref(false);
const createLoading = ref(false);
const newClientData = ref(null);
const userLoading = ref(false);
const userInfo = ref(null);
const agents = ref([]);

// Fonction pour ajouter un log
const addLog = (title, content, type = 'info') => {
  logs.value.push({
    title,
    content: typeof content === 'object' ? JSON.stringify(content, null, 2) : content,
    type,
    timestamp: new Date().toISOString()
  });
};

// Tester la récupération des clients
const testClientsAPI = async () => {
  loading.value = true;
  try {
    addLog('Test API', 'Démarrage du test de récupération des clients...');
    
    // 1. Vérifier le token
    const token = localStorage.getItem('token');
    if (!token) {
      addLog('Erreur', 'Aucun token trouvé! L\'utilisateur n\'est pas connecté.', 'error');
      return;
    }
    addLog('Token', `Token trouvé: ${token.substring(0, 10)}...`);
    
    // 2. Faire une requête sans aucun paramètre
    addLog('Requête 1', 'Requête GET /clients sans paramètres');
    const response1 = await axios.get(`${API_BASE_URL}/clients`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    addLog('Réponse 1', response1.data, response1.status === 200 ? 'success' : 'warning');
    
    // 3. Faire une requête avec cache-buster
    addLog('Requête 2', 'Requête GET /clients avec cache-buster');
    const response2 = await axios.get(`${API_BASE_URL}/clients`, {
      params: { _t: Date.now() },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    addLog('Réponse 2', response2.data, response2.status === 200 ? 'success' : 'warning');
    
    // 4. Analyser la structure de la réponse
    analyzeResponse(response2.data);
    
  } catch (error) {
    addLog('Erreur', `Erreur lors du test: ${error.message}`, 'error');
    if (error.response) {
      addLog('Détails erreur', error.response.data, 'error');
    }
  } finally {
    loading.value = false;
  }
};

// Analyser la structure de la réponse
const analyzeResponse = (data) => {
  if (!data) {
    addLog('Analyse', 'Réponse vide!', 'error');
    return;
  }
  
  addLog('Analyse', 'Analyse de la structure de la réponse:');
  
  // Vérifier si status est présent
  if ('status' in data) {
    addLog('Analyse', `Status: ${data.status}`, data.status === 'success' ? 'success' : 'error');
  } else {
    addLog('Analyse', 'Pas de champ "status" dans la réponse', 'warning');
  }
  
  // Vérifier la structure des données
  if ('data' in data) {
    if (Array.isArray(data.data)) {
      addLog('Analyse', `data est un tableau avec ${data.data.length} éléments`, 'info');
    } else if (typeof data.data === 'object') {
      addLog('Analyse', 'data est un objet', 'info');
      
      // Vérifier si c'est une structure de pagination
      if ('current_page' in data.data) {
        addLog('Analyse', 'Structure de pagination détectée', 'success');
        addLog('Pagination', {
          current_page: data.data.current_page,
          total: data.data.total,
          per_page: data.data.per_page,
          from: data.data.from,
          to: data.data.to
        });
        
        // Vérifier les données réelles
        if (Array.isArray(data.data.data)) {
          addLog('Analyse', `L'objet pagination contient ${data.data.data.length} clients`, 'success');
          if (data.data.data.length > 0) {
            addLog('Premier client', data.data.data[0]);
          } else {
            addLog('Analyse', 'Le tableau de clients est vide!', 'warning');
          }
        } else {
          addLog('Analyse', 'Pas de tableau data dans l\'objet pagination', 'error');
        }
      } else {
        addLog('Analyse', 'Structure inconnue pour data', 'warning');
        Object.keys(data.data).forEach(key => {
          addLog('Propriété', `${key}: ${typeof data.data[key]}`);
        });
      }
    } else {
      addLog('Analyse', `data est de type ${typeof data.data}`, 'warning');
    }
  } else {
    addLog('Analyse', 'Pas de champ "data" dans la réponse', 'error');
  }
};

// Effacer les logs
const resetLogs = () => {
  logs.value = [];
  addLog('Système', 'Logs effacés');
};

// Classes CSS pour les différents types de logs
const getLogClass = (type) => {
  switch (type) {
    case 'success': return 'bg-green-50 border-l-2 border-green-500';
    case 'error': return 'bg-red-50 border-l-2 border-red-500';
    case 'warning': return 'bg-yellow-50 border-l-2 border-yellow-500';
    default: return 'bg-primary-50 border-l-2 border-primary-500';
  }
};

// Créer un client test
const createTestClient = async () => {
  createLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      addLog('Erreur', 'Aucun token trouvé! L\'utilisateur n\'est pas connecté.', 'error');
      return;
    }
    
    // Charger l'utilisateur courant si ce n'est pas déjà fait
    if (!userInfo.value) {
      addLog('Utilisateur', 'Chargement des informations utilisateur...', 'info');
      
      const userResponse = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (userResponse.data && userResponse.data.status === 'success') {
        userInfo.value = userResponse.data.data;
      }
    }
    
    // Déterminer l'ID d'agent à utiliser
    let agentId = 1; // Valeur par défaut
    
    if (userInfo.value) {
      if (userInfo.value.role === 'agent') {
        // Si l'utilisateur est un agent, utiliser son propre ID
        agentId = userInfo.value.id;
        addLog('Agent', `Utilisation de l'ID d'agent de l'utilisateur connecté: ${agentId}`, 'info');
      } else {
        // Sinon, essayer de charger la liste des agents
        if (agents.value.length === 0) {
          try {
            const agentsResponse = await axios.get(`${API_BASE_URL}/users?role=agent`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            });
            
            if (agentsResponse.data && agentsResponse.data.status === 'success') {
              if (Array.isArray(agentsResponse.data.data)) {
                agents.value = agentsResponse.data.data;
              } else if (agentsResponse.data.data && Array.isArray(agentsResponse.data.data.data)) {
                agents.value = agentsResponse.data.data.data;
              }
            }
          } catch (error) {
            addLog('Erreur agents', 'Impossible de charger la liste des agents', 'warning');
          }
        }
        
        // Utiliser le premier agent disponible, sinon garder la valeur par défaut
        if (agents.value.length > 0) {
          agentId = agents.value[0].id;
          addLog('Agent', `Utilisation du premier agent disponible: ${agentId}`, 'info');
        } else {
          addLog('Agent', `Aucun agent disponible, utilisation de l'ID par défaut: ${agentId}`, 'warning');
        }
      }
    }
    
    // Générer des données aléatoires pour le client test
    const randomId = Math.floor(Math.random() * 10000);
    const testClient = {
      first_name: `Test${randomId}`,
      last_name: `Client${randomId}`,
      id_card_number: `ID-TEST-${randomId}`,
      profession: "Testeur",
      address: "123 Rue de Test",
      phone_number: `+243 ${Math.floor(Math.random() * 900000000) + 100000000}`,
      email: `test${randomId}@example.com`,
      agent_id: agentId,
      status: "active"
    };
    
    addLog('Création client', `Tentative de création du client test avec données:`, 'info');
    addLog('Données client', testClient);
    
    const response = await axios.post(`${API_BASE_URL}/clients`, testClient, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    addLog('Réponse création', response.data, response.status === 201 ? 'success' : 'warning');
    newClientData.value = response.data.data;
    
    // Vérifier si le client a bien été créé en le récupérant
    setTimeout(async () => {
      try {
        const checkResponse = await axios.get(`${API_BASE_URL}/clients`, {
          params: { _t: Date.now(), search: testClient.first_name },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        addLog('Vérification', 'Recherche du client nouvellement créé:', 'info');
        addLog('Résultat recherche', checkResponse.data, 'success');
      } catch (error) {
        addLog('Erreur vérification', `Impossible de vérifier si le client a été créé: ${error.message}`, 'error');
      }
    }, 1000);
    
  } catch (error) {
    addLog('Erreur création', `Erreur lors de la création du client: ${error.message}`, 'error');
    if (error.response) {
      addLog('Détails erreur', error.response.data, 'error');
    }
  } finally {
    createLoading.value = false;
  }
};

// Charger les informations de l'utilisateur et les agents
const loadUserInfo = async () => {
  userLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      addLog('Erreur', 'Aucun token trouvé! L\'utilisateur n\'est pas connecté.', 'error');
      return;
    }
    
    // Charger les informations de l'utilisateur
    const userResponse = await axios.get(`${API_BASE_URL}/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (userResponse.data && userResponse.data.status === 'success') {
      userInfo.value = userResponse.data.data;
      addLog('Utilisateur', 'Informations utilisateur chargées', 'success');
    }
    
    // Charger la liste des agents (admins seulement)
    try {
      const agentsResponse = await axios.get(`${API_BASE_URL}/users?role=agent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (agentsResponse.data && agentsResponse.data.status === 'success') {
        if (Array.isArray(agentsResponse.data.data)) {
          agents.value = agentsResponse.data.data;
        } else if (agentsResponse.data.data && Array.isArray(agentsResponse.data.data.data)) {
          agents.value = agentsResponse.data.data.data;
        }
        
        addLog('Agents', `${agents.value.length} agents chargés`, 'success');
      }
    } catch (error) {
      addLog('Erreur agents', 'Impossible de charger la liste des agents', 'warning');
      // L'utilisateur n'est peut-être pas un admin
    }
    
  } catch (error) {
    addLog('Erreur utilisateur', `Erreur lors du chargement des informations utilisateur: ${error.message}`, 'error');
    if (error.response) {
      addLog('Détails erreur', error.response.data, 'error');
    }
  } finally {
    userLoading.value = false;
  }
};

// Initialiser
addLog('Système', 'Outil de diagnostic chargé');
</script> 