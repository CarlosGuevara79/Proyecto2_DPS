# 🎉 Proyecto Final React Native DPS: Eventos Comunitarios

Aplicación móvil y web para gestionar **Eventos Comunitarios**, desarrollada con **React Native** (SDK 53) + **Expo CLI** y **Firebase**.

---

## 📂 Estructura de Carpetas

```text
src
├─ navigation
│  ├ RootNavigator.js       # Decide entre Auth o App según user
│  ├ AuthNavigator.js       # Bienvenida, Login, Registro
│  ├ AppNavigator.js        # Tabs principales según rol
│  ├ EventNavigator.js      # Próximos, Pasados, Detalle eventos
│  ├ OrganizerNavigator.js  # Crear y gestionar eventos (ORGANIZADOR)
│  └ AdminNavigator.js      # Historial y estadísticas (ADMIN)
│
├─ screens
│  ├ Auth
│  │  ├ WelcomeScreen.js    # Pantalla de bienvenida
│  │  ├ LoginScreen.js      # Inicio de sesión
│  │  └ RegisterScreen.js   # Registro de usuarios
│  │
│  ├ Events
│  │  ├ UpcomingEventsScreen.js  # Lista de eventos futuros
│  │  ├ PastEventsScreen.js      # Lista de eventos pasados
│  │  ├ EventDetailScreen.js     # Detalle de un evento
│  │  ├ EventCreateScreen.js     # Formulario creación (ORGANIZADOR)
│  │  └ EventManageScreen.js     # Edición/eliminación (ORGANIZADOR)
│  │
│  └ Admin
│     ├ HistoryScreen.js     # Historial general (ADMIN)
│     └ StatsScreen.js       # Estadísticas (ADMIN)
│
├─ components
│  ├ ButtonCustom.js        # Botón estilizado reutilizable
│  ├ InputField.js          # Campo de texto estilizado
│  ├ RoleBadge.js           # Indicador visual de rol
│  └ SocialIntegration.js   # Integración de redes sociales
│
├─ services
│  ├ firebaseConfig.js      # Inicializa Firebase (Auth, Firestore)
│  ├ apiHandlers.js         # Funciones registerUser, loginUser, etc.
│  └ roles.js               # Constantes de roles (ADMIN, ORGANIZADOR, MIEMBRO)
│
├─ hooks
│  ├ useAuthContext.js      # Contexto global de usuario y rol
│  └ useAuthStatus.js       # Listener de estado de Auth
│
├─ utils
│  ├ validators.js          # Validaciones de formularios
│  └ index.js               # Exportaciones agrupadas
│
└─ assets                  # Imágenes y fuentes
```

---

## 🛠️ Requisitos Previos

* **Node.js** v16.x o v18.x (no v17+).
* **npm** v8+.
* **Git**.
* **nvm** *(opcional)* para gestionar versiones de Node.
* **Expo CLI** local (SDK 53).

```bash
# Instalar Expo local (si no está)
npm install expo@^53 --save-dev
```

---

## 🚀 Instalación y Configuración

Ejecutar estos comandos **en orden** desde la raíz del proyecto:

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/CescPerdomo/eventos-comunitarios.git
   cd eventos-comunitarios
   ```

2. **Verificar .gitignore**

   * Debe incluir: `/node_modules`, `.expo`, `android`, `ios`, `.env*`, `.vscode/`, etc.

3. **Instalar dependencias principales**

   ```bash
   npm install
   ```

4. **Instalar dependencias de Expo y Web**

   ```bash
   npx expo install react-dom react-native-web @expo/metro-runtime@~5.0.4
   ```

5. **Instalar dependencias de React Native**

   ```bash
   npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context react-native-safe-area-context
   ```

   * Agrega el plugin en `babel.config.js`:

     ```js
     module.exports = function(api) {
       api.cache(true);
       return {
         presets: ['babel-preset-expo'],
         plugins: ['react-native-reanimated/plugin'],
       };
     };
     ```

6. **Instalar React Navigation**

   ```bash
   npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
   ```

7. **Instalar Firebase**

   ```bash
   npm install firebase@^9.0.0
   ```

8. **Verificar app.json**

   ```json
   "expo": {
     "platforms": ["ios","android","web"],
     ...
   }
   ```

9. **Configurar Firebase**

   * Copiar `src/services/firebaseConfig.js` → `src/services/firebaseConfig.js`.
   * Pegar esta configuración (ejemplo de proyecto):

     ```javascript
     // src/services/firebaseConfig.js
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";

     const firebaseConfig = {
       apiKey: "AIzaSyD0kchgYGlno_6f-gnD8hxMtT_DzfBsK4w",
       authDomain: "react-fb-auth-89e8a.firebaseapp.com",
       projectId: "react-fb-auth-89e8a",
       storageBucket: "react-fb-auth-89e8a.firebasestorage.app",
       messagingSenderId: "1068897416810",
       appId: "1:1068897416810:web:d046108b924bc32b003c13",
       measurementId: "G-CY7D9271TH"
     };

     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     export const db = getFirestore(app);
     ```
   * **Credenciales de prueba** (solo para desarrollo):
        de Fabricio

     * **Usuario:** `pruebareact2025@gmail.com`
     * **Contraseña:** `Prueba2025$`

10. **Variables de entorno** **Variables de entorno**

    * Crear `.env` con credenciales sensibles. Inclúirlo en `.gitignore`.

---

## 🏃‍♂️ Correr el Proyecto

**Usa la CLI local** para evitar conflictos (porque los hay):

```bash
# Desarrollo multiplataforma
npx expo start
# Teclas:
# w → Web (http://localhost:19007)
# a → Android (emulador/dispositivo)
# i → iOS (macOS)
```

**Solo Web con caché limpio**:

```bash
npx expo start --web --port 19007 -c (el puerto puede ser el que este libre)
```

---

## 📋 Contratos y Buenas Prácticas

### Servicios (apiHandlers.js)

```ts
/**
 * registerUser(email: string, password: string): Promise<User>
 * loginUser(email: string, password: string): Promise<{ user: User; role: string }>
 * getUpcomingEvents(): Promise<Event[]>
 * createEvent(data: Event): Promise<void>
 */
```

### Pantallas y Props

* **WelcomeScreen**: sin props.(sin propiedades de components)
* **LoginScreen**: sin props.(sin propiedades de components)
* **RegisterScreen**: sin props.(sin propiedades de components)
* **UpcomingEventsScreen**: props `navigation`.(components)
* **EventDetailScreen**: prop `route.params.eventId`. (components)

### Roles (roles.js)

```js
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_ORGANIZADOR = 'ORGANIZADOR';
export const ROLE_MIEMBRO = 'MIEMBRO';
```

Usar siempre constantes en lugar de strings.

---

## 🌐 Flujo de Git y Branches

1. **main**: base Welcome + Login.
2. **feature/**\*: cada módulo (p.ej. `feature/event-list`).
3. **PR**: revisión de contratos y estilo.
4. **Merge**: a `develop` o `main`, (dependera de ustedes)

---

## 🏗️ Próximos Pasos para el Equipo

1. **EventNavigator**: Upcoming, Past, Detail.
2. **OrganizerNavigator**: Create & Manage.
3. **AdminNavigator**: History & Stats.
4. **SocialIntegration**: integración de redes sociales.
5. **Tests**: unitarios e integración.

---

## ⚙️ Alternativas y Troubleshooting (y los hay)

* **Limpiar caché**: `npm cache clean --force` + `npx expo start -c`.
* **Reinstalar módulos**: `rm -rf node_modules package-lock.json` + `npm install`.
* **Fijar versiones**:

  * `react-native-web@~0.19.14`, `react-dom@18.2.0`.
  * `@expo/metro-runtime@~5.0.4`.
* **Puertos**: `npx expo start --web --port 19008 -c`.
* **Node**: usar 16.x o 18.x (ej. `nvm use 16`).
* **Import/Export**: default vs named imports.

---

*¡Roles del Equipo Metodologia Scrum!*
1. Cesar Ernesto Perdomo Guerrero pg241690 (Product Owner)
2. Fabricio Antonio Castro Martinez cm240137 (Scrum Master)
3. Jose Alonso Aguirre Marquez am241838 (Equipo de Desarrollo)
4. Victor Fabricio Mendez mm242458 (Equipo de Desarrollo)
5. Carlos David Guevara Martinez gm172474 (Equipo de Desarrollo)

