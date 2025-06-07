// src/services/roles.js

/** Roles de usuario disponibles */
export const ROLE_ADMIN        = 'ADMIN';
export const ROLE_ORGANIZADOR  = 'ORGANIZADOR';
export const ROLE_MIEMBRO      = 'MIEMBRO';

/** Arreglo de roles válidos (si lo necesitas para validaciones) */
export const VALID_ROLES = [
  ROLE_ADMIN,
  ROLE_ORGANIZADOR,
  ROLE_MIEMBRO,
];
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/