import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Import des pages principales
const Dashboard = () => import('@/views/DashboardView.vue');
const Login = () => import('@/views/LoginView.vue');
const Register = () => import('@/views/RegisterView.vue');
const NotFound = () => import('@/views/NotFoundView.vue');
const Diagnostic = () => import('@/views/DiagnosticView.vue');
const Profile = () => import('@/views/ProfileView.vue');
const Settings = () => import('@/views/SettingsView.vue');
const AccessDenied = () => import('@/views/AccessDeniedView.vue');

// Import des pages de gestion des clients
const ClientList = () => import('@/views/clients/ClientListView.vue');
const ClientDetail = () => import('@/views/clients/ClientDetailView.vue');
const ClientForm = () => import('@/views/clients/ClientFormView.vue');

// Import des pages de gestion des prêts
const LoanList = () => import('@/views/loans/LoanListView.vue');
const LoanDetail = () => import('@/views/loans/LoanDetailView.vue');
const LoanForm = () => import('@/views/loans/LoanFormView.vue');
const RepaymentOverdue = () => import('@/views/loans/RepaymentOverdueView.vue');
const RepaymentList = () => import('@/views/loans/RepaymentListView.vue');

// Import des pages de gestion des utilisateurs
const UserList = () => import('@/views/users/UserListView.vue');

// Import des pages de gestion des comptes d'épargne
const SavingsList = () => import('@/views/savings/SavingsListView.vue');
const SavingsDetail = () => import('@/views/savings/SavingsDetailView.vue');
const SavingsCreate = () => import('@/views/savings/SavingsCreateView.vue');
const SavingsDeposit = () => import('@/views/savings/SavingsDepositView.vue');
const SavingsWithdraw = () => import('@/views/savings/SavingsWithdrawView.vue');

// Import des rapports
const Reports = () => import('@/views/reports/ReportsView.vue');

const routes = [
  // Route pour la page d'accueil / tableau de bord
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  
  // Authentification
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true }
  },
  
  // Profil utilisateur
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  
  // Paramètres utilisateur
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  
  // Gestion des clients
  {
    path: '/clients',
    name: 'ClientList',
    component: ClientList,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/new',
    name: 'ClientCreate',
    component: ClientForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'ClientDetail',
    component: ClientDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id/edit',
    name: 'ClientEdit',
    component: ClientForm,
    meta: { requiresAuth: true, isEdit: true }
  },
  
  // Gestion des comptes d'épargne
  {
    path: '/savings',
    name: 'SavingsList',
    component: SavingsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/savings/new',
    name: 'SavingsCreate',
    component: SavingsCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/savings/:id',
    name: 'SavingsDetail',
    component: SavingsDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/savings/:id/deposit',
    name: 'SavingsDeposit',
    component: SavingsDeposit,
    meta: { requiresAuth: true }
  },
  {
    path: '/savings/:id/withdraw',
    name: 'SavingsWithdraw',
    component: SavingsWithdraw,
    meta: { requiresAuth: true }
  },
  
  // Gestion des prêts
  {
    path: '/loans',
    name: 'LoanList',
    component: LoanList,
    meta: { requiresAuth: true }
  },
  {
    path: '/loans/new',
    name: 'LoanCreate',
    component: LoanForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/loans/:id',
    name: 'LoanDetail',
    component: LoanDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/loans/overdue',
    name: 'RepaymentOverdue',
    component: RepaymentOverdue,
    meta: { requiresAuth: true }
  },
  // Route pour les paiements/remboursements qui affiche directement le composant
  {
    path: '/payments',
    name: 'Payments',
    component: RepaymentList,
    meta: { requiresAuth: true }
  },
  // Route alternative pour accéder aux remboursements
  {
    path: '/repayments',
    name: 'Repayments',
    component: RepaymentList,
    meta: { requiresAuth: true }
  },
  
  // Gestion des utilisateurs
  {
    path: '/users',
    name: 'UserList',
    component: UserList,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true // Cette route est réservée aux admins
    }
  },
  
  // Route pour l'outil de diagnostic
  {
    path: '/diagnostic',
    name: 'Diagnostic',
    component: Diagnostic,
    meta: {
      requiresAuth: true
    }
  },
  
  // Rapports
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true // Cette route est réservée aux admins
    }
  },
  
  // Page d'accès refusé
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied,
    meta: {
      requiresAuth: true
    }
  },
  
  // Route 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active'
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Si l'utilisateur a un token mais les infos utilisateur ne sont pas chargées
  if (localStorage.getItem('token') && !authStore.user) {
    try {
      // Définir le token depuis localStorage
      authStore.token = localStorage.getItem('token');
      
      // Récupérer les informations de l'utilisateur
      await authStore.fetchCurrentUser();
      
      // L'authentification a réussi, on peut continuer
      if (to.meta.guest) {
        // Si c'est une page pour invités, rediriger vers le tableau de bord
        return next({ name: 'Dashboard' });
      } else {
        // Sinon, continuer vers la page demandée
        return next();
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil utilisateur :', error);
      // Si échec de récupération de l'utilisateur, on déconnecte
      await authStore.logout();
      return next({ name: 'Login', query: { redirect: to.fullPath } });
    }
  }
  
  // Vérifier l'état d'authentification après avoir essayé de charger l'utilisateur
  const isAuthenticated = authStore.isAuthenticated;
  
  // Si la route nécessite l'authentification et l'utilisateur n'est pas authentifié
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirection vers Login: authentification requise');
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  } 
  // Si la route est réservée aux admins et l'utilisateur n'est pas admin
  else if (to.meta.requiresAdmin && !authStore.isAdmin && !authStore.isSuperAdmin) {
    console.log('Accès refusé: droits administrateur requis');
    // Rediriger vers la page d'accès refusé
    return next({ name: 'AccessDenied' });
  }
  // Si l'utilisateur est déjà authentifié et essaie d'accéder à une page réservée aux invités
  else if (to.meta.guest && isAuthenticated) {
    console.log('Redirection vers Dashboard: utilisateur déjà authentifié');
    return next({ name: 'Dashboard' });
  } 
  // Dans tous les autres cas, autoriser la navigation
  else {
    return next();
  }
});

export default router; 