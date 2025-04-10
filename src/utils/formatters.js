/**
 * Formate un montant en devise
 * @param {number} amount - Montant à formater
 * @param {string} currency - Code de la devise (par défaut: XOF)
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount, currency = 'XOF') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Formate une date au format local
 * @param {string|Date} dateString - Date à formater
 * @returns {string} Date formatée
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formate une date et heure au format local
 * @param {string|Date} dateString - Date à formater
 * @returns {string} Date et heure formatées
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Récupère les initiales d'une personne à partir de son prénom et nom
 * @param {Object} person - Objet contenant first_name et last_name
 * @returns {string} Initiales
 */
export const getInitials = (person) => {
  if (!person) return '';
  
  return `${person.first_name?.charAt(0) || ''}${person.last_name?.charAt(0) || ''}`.toUpperCase();
};

/**
 * Formate le statut d'un compte d'épargne
 * @param {string} status - Statut du compte
 * @returns {string} Texte formaté du statut
 */
export const getSavingsStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'inactive':
      return 'Inactif';
    case 'closed':
      return 'Clôturé';
    default:
      return status;
  }
};

/**
 * Formate le statut d'un client
 * @param {string} status - Statut du client
 * @returns {string} Texte formaté du statut
 */
export const getClientStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'inactive':
      return 'Inactif';
    case 'blacklisted':
      return 'Liste noire';
    default:
      return status;
  }
}; 