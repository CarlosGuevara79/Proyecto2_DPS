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
