<template>
  <div class="flex flex-col min-h-screen">
    <Toast />
    <template v-if="authStore && authStore.isAuthenticated && authStore.user">
      <!-- Sidebar verticale à gauche (desktop) - MAINTENANT AU-DESSUS DE LA TOPBAR -->
      <aside
        class="bg-white text-gray-700 shadow-md fixed inset-y-0 left-0 z-50 hidden md:block"
      >
        <!-- Logo et titre de la microfinance en haut de la sidebar -->
        <div class="h-16 p-4 flex flex-col border-gray-100">
          <router-link to="/" class="text-primary text-xl font-bold"
            >Micro. Vance</router-link
          >
          <!-- Afficher toujours le nom de l'organisation ou un message d'erreur -->
          <span class="text-xs font-bold text-accent mt-1">
            {{ authStore.currentOrganizationName || "Aucune organisation" }}
          </span>
        </div>

        <!-- Menu principal avec navigation -->
        <nav class="flex-grow py-6 pr-2 overflow-y-auto scrollbar-thin">
          <div class="space-y-3 px-2">
            <!-- Groupe Général -->
            <div class="nav-group">
              <div class="nav-group-title text-xs">Général</div>
              <router-link
                to="/"
                class="sidebar-link text-sm text-gray-800"
                :class="{ active: $route.path === '/' }"
              >
                <HomeIcon class="sidebar-icon" />
                Tableau de bord
              </router-link>
            </div>

            <!-- Groupe Clients -->
            <div class="nav-group">
              <div class="nav-group-title text-xs">Clients</div>
              <router-link
                to="/clients"
                class="sidebar-link text-sm text-gray-800"
                :class="{ active: $route.path.startsWith('/clients') }"
              >
                <UserGroupIcon class="sidebar-icon" />
                Clients
              </router-link>
            </div>

            <!-- Groupe Finance -->
            <div class="nav-group">
              <div class="nav-group-title text-xs">Finance</div>
              <router-link
                to="/savings"
                class="sidebar-link text-sm text-gray-800"
                :class="{ active: $route.path.startsWith('/savings') }"
              >
                <CurrencyDollarIcon class="sidebar-icon" />
                Épargne
              </router-link>
              <router-link
                to="/loans"
                class="sidebar-link text-sm text-gray-800"
                :class="{ active: $route.path.startsWith('/loans') }"
              >
                <BanknotesIcon class="sidebar-icon" />
                Prêts
              </router-link>
              <router-link
                to="/repayments"
                class="sidebar-link text-sm text-gray-800"
                :class="{ active: $route.path.startsWith('/repayments') }"
              >
                <ArrowPathIcon class="sidebar-icon" />
                Remboursements
              </router-link>
            </div>

            <!-- Groupe Administration -->
            <div class="nav-group">
              <div class="nav-group-title text-xs">Administration</div>
              <router-link
                v-if="authStore.isAdmin || authStore.isSuperAdmin"
                to="/users"
                class="sidebar-link text-sm text-gray-800"
                :class="{ active: $route.path === '/users' }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="sidebar-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Mon équipe
              </router-link>
              <router-link
                to="/reports"
                class="sidebar-link text-sm text-gray-800"
                :class="{ active: $route.path === '/reports' }"
              >
                <ChartBarIcon class="sidebar-icon" />
                Rapports
              </router-link>
              <router-link
                to="/diagnostic"
                class="sidebar-link text-sm text-gray-800"
                :class="{ active: $route.path === '/diagnostic' }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="sidebar-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                Diagnostic
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Section du bas avec informations et version -->
        <div
          class="p-4 border-t border-gray-100 mt-auto absolute bottom-0 left-0 right-0 bg-white"
        >
          <div class="text-xs text-gray-500">
            <p class="font-semibold">Version 1.0</p>
            <p>© {{ new Date().getFullYear() }}</p>
          </div>
        </div>
      </aside>

      <!-- Barre supérieure (top bar) - MAINTENANT AVEC MARGE SEULEMENT À DROITE -->
      <header
        class="bg-white text-gray-800 fixed top-0 right-0 left-0 z-40 h-16 shadow-sm md:pl-64"
      >
        <div class="flex justify-between items-center h-full px-6">
          <!-- Barre de recherche (centre) avec taille réduite -->
          <div class="flex flex-1 max-w-xs">
            <div class="relative w-full">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                class="block w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Rechercher..."
              />
            </div>
          </div>

          <!-- Date et heure actuelles -->
          <div
            class="hidden md:flex items-center text-gray-700 mx-4 bg-gray-50 px-3 py-1 rounded-md"
          >
            <CalendarIcon class="h-4 w-4 text-primary mr-2" />
            <span class="text-xs font-medium">{{ currentDate }}</span>
          </div>

          <!-- Icônes et profil (droite) avec meilleur espacement -->
          <div class="flex items-center space-x-12">
            <!-- Notifications avec espacement ajusté -->
            <div class="hidden md:flex items-center space-x-4">
              <div class="relative">
                <button
                  class="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <span
                  class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/3 bg-accent rounded-full"
                  >3</span
                >
              </div>

              <!-- Messages avec espacement ajusté -->
              <div class="relative">
                <button
                  class="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </button>
                <span
                  class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/3 bg-accent rounded-full"
                  >5</span
                >
              </div>
            </div>

            <!-- Avatar et profil avec espacement ajusté -->
            <div class="relative ml-1" ref="userMenuRef">
              <button
                @click="toggleUserMenu"
                class="flex items-center focus:outline-none"
              >
                <div
                  class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  {{ authStore.user.name.charAt(0).toUpperCase() }}
                </div>
              </button>

              <!-- Menu déroulant du profil -->
              <div
                v-show="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <div class="px-4 py-3 text-sm border-b border-gray-100">
                  <span class="font-medium text-gray-900 block">{{
                    authStore.user.name
                  }}</span>
                  <span class="text-gray-500 text-xs block mt-0.5">{{
                    authStore.user.email
                  }}</span>
                  <span
                    class="bg-primary bg-opacity-10 text-primary px-2 py-0.5 rounded-full text-xs mt-2 inline-block"
                  >
                    {{
                      authStore.user.role === "super_admin"
                        ? "Super Admin"
                        : authStore.user.role === "admin"
                        ? "Administrateur"
                        : "Agent"
                    }}
                  </span>
                </div>

                <!-- Section des organisations (nouvelle) -->
                <div
                  v-if="authStore.hasOrganization"
                  class="px-4 py-2 border-b border-gray-100"
                >
                  <span class="text-xs text-gray-500 block mb-1"
                    >Organisation actuelle:</span
                  >
                  <span class="text-sm font-medium text-gray-800 block">{{
                    authStore.currentOrganizationName
                  }}</span>

                  <!-- Option pour changer d'organisation si l'utilisateur en a plusieurs -->
                  <div v-if="authStore.hasMultipleOrganizations" class="mt-2">
                    <button
                      @click="showOrganizationSelector = true"
                      class="text-xs text-primary hover:text-primary-dark flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      Changer d'organisation
                    </button>
                  </div>
                </div>

                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeUserMenu"
                >
                  <span class="flex items-center">
                    <UserCircleIcon class="w-4 h-4 mr-2" />
                    Mon profil
                  </span>
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeUserMenu"
                >
                  <span class="flex items-center">
                    <CogIcon class="w-4 h-4 mr-2" />
                    Paramètres
                  </span>
                </router-link>
                <div class="border-t border-gray-100 my-1"></div>
                <a
                  href="#"
                  @click.prevent="
                    logout();
                    closeUserMenu();
                  "
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span class="flex items-center">
                    <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" />
                    Déconnexion
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Bouton pour afficher/masquer le menu sur mobile -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden fixed z-50 bottom-4 left-4 bg-primary text-white p-3 rounded-full shadow-lg"
      >
        <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
        <XMarkIcon v-else class="w-6 h-6" />
      </button>

      <!-- Menu mobile -->
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        @click="toggleMobileMenu"
      ></div>
      <aside
        v-if="mobileMenuOpen"
        class="fixed inset-y-0 left-0 bg-primary text-white z-50 transform transition-transform md:hidden"
      >
        <!-- Contenu du menu mobile (même que pour desktop) -->
        <div class="flex flex-col h-full">
          <div
            class="h-16 flex flex-col items-center justify-center px-4 border-b border-primary"
          >
            <router-link to="/" class="text-white text-xl font-bold"
              >Micro. Vance</router-link
            >
            <!-- Afficher toujours le nom de l'organisation ou un message d'erreur -->
            <span class="text-xs font-semibold text-red-400 mt-1">
              {{ authStore.currentOrganizationName || "Aucune organisation" }}
            </span>
            <button @click="toggleMobileMenu" class="absolute right-4 text-white">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <nav class="flex-grow px-4 py-6 overflow-y-auto">
            <div class="space-y-4">
              <router-link
                to="/"
                class="block py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-800 hover:text-white flex items-center"
                :class="{
                  'bg-white text-black font-medium shadow-sm': $route.path === '/',
                }"
              >
                <HomeIcon class="w-5 h-5 mr-3" />
                Tableau de bord
              </router-link>
              <router-link
                to="/clients"
                class="block py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-800 hover:text-white flex items-center"
                :class="{
                  'bg-white text-black font-medium shadow-sm': $route.path.startsWith(
                    '/clients'
                  ),
                }"
              >
                <UserGroupIcon class="w-5 h-5 mr-3" />
                Clients
              </router-link>
              <router-link
                to="/loans"
                class="block py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-800 hover:text-white flex items-center"
                :class="{
                  'bg-white text-black font-medium shadow-sm': $route.path.startsWith(
                    '/loans'
                  ),
                }"
              >
                <BanknotesIcon class="w-5 h-5 mr-3" />
                Prêts
              </router-link>
              <router-link
                to="/repayments"
                class="block py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-800 hover:text-white flex items-center"
                :class="{
                  'bg-white text-black font-medium shadow-sm': $route.path.startsWith(
                    '/repayments'
                  ),
                }"
              >
                <ArrowPathIcon class="w-5 h-5 mr-3" />
                Remboursements
              </router-link>
              <router-link
                to="/savings"
                class="block py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-800 hover:text-white flex items-center"
                :class="{
                  'bg-white text-black font-medium shadow-sm': $route.path.startsWith(
                    '/savings'
                  ),
                }"
              >
                <CurrencyDollarIcon class="w-5 h-5 mr-3" />
                Épargne
              </router-link>
              <router-link
                v-if="authStore.isAdmin || authStore.isSuperAdmin"
                to="/users"
                class="block py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-800 hover:text-white flex items-center"
                :class="{
                  'bg-white text-black font-medium shadow-sm': $route.path.startsWith(
                    '/users'
                  ),
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Mon équipe
              </router-link>
              <router-link
                to="/reports"
                class="block py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-800 hover:text-white flex items-center"
                :class="{
                  'bg-white text-black font-medium shadow-sm': $route.path.startsWith(
                    '/reports'
                  ),
                }"
              >
                <ChartBarIcon class="w-5 h-5 mr-3" />
                Rapports
              </router-link>
              <router-link
                to="/diagnostic"
                class="block py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-800 hover:text-white flex items-center"
                :class="{
                  'bg-white text-black font-medium shadow-sm': $route.path.startsWith(
                    '/diagnostic'
                  ),
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                Diagnostic
              </router-link>
            </div>
          </nav>

          <!-- Section du bas pour mobile aussi -->
          <div class="p-4 border-t border-primary mt-auto">
            <div class="text-sm text-gray-300">
              <p class="font-semibold">Version 1.0</p>
              <p>© {{ new Date().getFullYear() }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Contenu principal -->
      <main class="flex-grow pt-16 md:pl-60 bg-surface">
        <div class="container mx-auto px-4 py-6">
          <router-view />
        </div>
      </main>

      <footer class="bg-surface-dark py-4 text-center bottom-0 w-full md:pl-64">
        <div class="container mx-auto px-4">
          <p class="text-gray-500 text-xs">
            &copy; {{ new Date().getFullYear() }} Micro. Vance. Tous droits réservés.
          </p>
        </div>
      </footer>

      <!-- Modal de sélection d'organisation -->
      <div
        v-if="showOrganizationSelector"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <!-- Overlay de fond -->
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="showOrganizationSelector = false"
          ></div>

          <!-- Contenu du modal -->
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Changer d'organisation
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Sélectionnez l'organisation à laquelle vous souhaitez accéder. Cette
                      action rechargera la page.
                    </p>
                  </div>

                  <!-- Liste des organisations -->
                  <div class="mt-4 max-h-60 overflow-y-auto">
                    <div
                      v-for="org in authStore.organizations"
                      :key="org.id"
                      class="py-2"
                    >
                      <button
                        @click="switchOrganization(org.id)"
                        class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                        :class="{
                          'bg-primary bg-opacity-10':
                            org.id === authStore.currentOrganizationId,
                        }"
                      >
                        <div
                          class="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-3"
                        >
                          {{ org.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <span class="font-medium block text-gray-900">{{
                            org.name
                          }}</span>
                          <span class="text-xs text-gray-500">{{
                            org.type || "Microfinance"
                          }}</span>
                        </div>
                        <div
                          v-if="org.id === authStore.currentOrganizationId"
                          class="ml-auto"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="showOrganizationSelector = false"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Layout simple pour les pages d'authentification (login/register) -->
    <template v-else>
      <main class="flex-grow bg-surface">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide, watch, onUnmounted } from "vue";
import {
  UserCircleIcon,
  CogIcon,
  HomeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import Toast from "@/components/Toast.vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { onClickOutside } from "@vueuse/core";

const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const authStore = useAuthStore();
const currentDate = ref("");
const showOrganizationSelector = ref(false);
const userMenuRef = ref(null);

// Mettre à jour la date et l'heure
const updateDateTime = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Initialiser la date et l'heure
updateDateTime();

// Mettre à jour l'heure chaque minute
const dateTimeInterval = setInterval(updateDateTime, 60000);

// Nettoyer l'intervalle lors de la destruction du composant
onUnmounted(() => {
  clearInterval(dateTimeInterval);
});

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const closeUserMenu = () => {
  userMenuOpen.value = false;
};

const logout = async () => {
  await authStore.logout();
};

const switchOrganization = (organizationId) => {
  authStore.switchOrganization(organizationId);
};

// Logs de débogage pour vérifier l'état de l'organisation
onMounted(async () => {
  console.log("App mounted");

  // Si l'utilisateur est authentifié mais qu'aucune organisation n'est chargée
  if (authStore.isAuthenticated && !authStore.currentOrganization) {
    console.log("Utilisateur authentifié mais aucune organisation définie");

    // Essayer de récupérer les informations utilisateur à nouveau
    try {
      console.log("Tentative de récupération des informations utilisateur...");
      await authStore.fetchCurrentUser();

      console.log("Après fetchCurrentUser:");
      console.log("Current organization:", authStore.currentOrganization);
      console.log("Has organization:", authStore.hasOrganization);
      console.log("Current organization name:", authStore.currentOrganizationName);
      console.log("All organizations:", authStore.organizations);
      console.log("User role:", authStore.user?.role);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur:",
        error
      );
    }
  } else {
    // Vérifier si l'organisation est chargée
    console.log("Current organization:", authStore.currentOrganization);
    console.log("Has organization:", authStore.hasOrganization);
    console.log("Current organization name:", authStore.currentOrganizationName);
    console.log("All organizations:", authStore.organizations);
    console.log("User role:", authStore.user?.role);
  }
});

// Surveiller les changements de l'organisation actuelle
watch(
  () => authStore.currentOrganization,
  (newOrg) => {
    console.log("Organization changed:", newOrg);
  },
  { deep: true }
);

// Appliquer onClickOutside pour fermer le menu utilisateur quand on clique en dehors
onClickOutside(userMenuRef, closeUserMenu);
</script>

<style>
/* Styles globaux avec palette de couleurs financières personnalisées */
/* Ces classes sont compatibles avec les couleurs définies dans votre thème Tailwind */

.bg-primary {
  background-color: #375d81; /* Bleu finance */
}
.bg-primary-light {
  background-color: #3b82f6;
}
.bg-primary-dark {
  background-color: #1e3a8a;
}
.bg-primary-nav {
  background-color: #f0f4f8; /* Couleur claire pour les éléments de navigation actifs */
}
.bg-secondary {
  background-color: #10b981; /* Vert pour croissance/profit */
}
.bg-secondary-light {
  background-color: #34d399;
}
.bg-secondary-dark {
  background-color: #059669;
}
.bg-accent {
  background-color: #f59e0b; /* Orange/Gold pour finance */
}
.bg-accent-light {
  background-color: #fbbf24;
}
.bg-accent-dark {
  background-color: #d97706;
}
.bg-surface {
  background-color: #f8fafc;
}
.bg-surface-dark {
  background-color: #f1f5f9;
}

.text-primary {
  color: #375d81;
}
.text-primary-light {
  color: #3b82f6;
}
.text-primary-dark {
  color: #1e3a8a;
}
.text-secondary {
  color: #10b981;
}
.text-secondary-light {
  color: #34d399;
}
.text-secondary-dark {
  color: #059669;
}
.text-accent {
  color: #f59e0b;
}
.text-accent-light {
  color: #fbbf24;
}
.text-accent-dark {
  color: #d97706;
}

.border-primary {
  border-color: #375d81;
}
.border-primary-light {
  border-color: #3b82f6;
}
.border-primary-dark {
  border-color: #1e3a8a;
}
.border-secondary {
  border-color: #10b981;
}
.border-accent {
  border-color: #f59e0b;
}

/* Styles de focus */
.focus\:ring-primary:focus {
  --tw-ring-color: #375d81;
}
.focus\:border-primary:focus {
  border-color: #375d81;
}

/* Styles spécifiques pour la navbar */
.sidebar-link {
  @apply flex items-center py-2.5 px-4 rounded-lg transition duration-200 text-gray-700;
}

.sidebar-link.active {
  @apply bg-primary-nav text-primary font-medium shadow-sm border-l-2 border-primary;
}

.sidebar-link:hover:not(.active) {
  @apply bg-gray-50 text-primary;
}

.sidebar-icon {
  @apply w-5 h-5 mr-3 text-gray-500;
}

.sidebar-link.active .sidebar-icon {
  @apply text-primary;
}

.nav-group {
  @apply space-y-1 mb-6;
}

.nav-group-title {
  @apply text-xs uppercase tracking-wider text-gray-400 font-medium px-4 mb-2;
}

/* Style pour la barre de défilement personnalisée */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
