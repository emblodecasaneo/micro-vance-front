/**
 * Configuration de l'API pour l'application MicroFinance SaaS
 * Ce fichier contient les paramètres de base pour les requêtes API
 */

// URL de base de l'API (ajustez selon votre environnement)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Timeout par défaut pour les requêtes (en millisecondes)
export const API_TIMEOUT = 10000;

// Headers par défaut pour toutes les requêtes
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Codes d'erreur personnalisés
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500
};

// Messages d'erreur par défaut
export const DEFAULT_ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: 'Vous n\'êtes pas authentifié. Veuillez vous connecter.',
  [ERROR_CODES.FORBIDDEN]: 'Vous n\'avez pas les permissions nécessaires pour cette action.',
  [ERROR_CODES.NOT_FOUND]: 'La ressource demandée n\'existe pas.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Veuillez vérifier les données saisies.',
  [ERROR_CODES.SERVER_ERROR]: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.'
}; 