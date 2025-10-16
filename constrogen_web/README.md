# Constrogen Web App (PWA)

A Progressive Web Application (PWA) version of the Constrogen mobile app, built with React, TypeScript, and Vite. This web app shares business logic with the React Native mobile app through a shared directory structure.

## 🚀 Features

- ✅ **Progressive Web App (PWA)** - Install and use offline
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile browsers
- ✅ **Shared Business Logic** - Redux state management, API services, and utilities shared with mobile app
- ✅ **Authentication Flow** - Email/OTP verification matching mobile app
- ✅ **Purchase Module** - Purchase management with sub-menus (Requisition, History, GRN)
- ✅ **Approvals Module** - Pending and Approved tabs with approve/reject functionality
- ✅ **TypeScript** - Full type safety
- ✅ **Modern Stack** - React 18, Vite, Tailwind CSS
- ✅ **Same Backend API** - Uses identical endpoints as mobile app

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Assets from mobile app (logo.png, construction-bg.jpeg, hook128.png)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd constrogen_web
npm install
```

### 2. Copy Assets

Copy the following assets from `constrogen_mobile/assets/` to `constrogen_web/public/`:

- `logo.png`
- `hook128.png`
- `construction-bg.jpeg`

```bash
# From the project root
cp constrogen_mobile/assets/logo.png constrogen_web/public/
cp constrogen_mobile/assets/hook128.png constrogen_web/public/
cp constrogen_mobile/assets/construction-bg.jpeg constrogen_web/public/
```

### 3. Development Server

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### 5. Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📱 Installing as PWA

### Desktop (Chrome/Edge)

1. Open the app in Chrome or Edge
2. Look for the install icon in the address bar
3. Click "Install" to add to your desktop

### Mobile (iOS)

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Mobile (Android)

1. Open the app in Chrome
2. Tap the menu (⋮)
3. Select "Install app" or "Add to Home Screen"

## 🏗️ Project Structure

```
constrogen_web/
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   ├── logo.png        # App icons
│   └── ...
├── src/
│   ├── pages/          # Route pages
│   │   ├── Login.tsx
│   │   ├── OTPVerification.tsx
│   │   └── Dashboard.tsx
│   ├── store/          # Redux store (web-specific)
│   ├── services/       # API services (web-specific)
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
└── package.json        # Dependencies
```

## 🔄 Shared Logic

The web app shares the following with the mobile app through the `shared/` directory:

- **Redux Slices**: `authSlice`, `userSlice`
- **Redux Sagas**: Authentication saga with storage abstraction
- **API Services**: HTTP client and auth API
- **Types**: TypeScript interfaces and types
- **Constants**: Theme colors and configuration
- **Utilities**: Error handlers and helpers

### Storage Abstraction

The shared code uses dependency injection for storage:

- **Mobile**: Uses `expo-secure-store` for secure storage
- **Web**: Uses `localStorage` for browser storage

Both implement the same `IStorageService` interface.

## 🎨 Styling

The app uses:

- **Tailwind CSS** for utility-first styling
- **Shared theme constants** from `shared/constants/theme.ts`
- **Responsive design** with mobile-first approach
- **Custom toast notifications** for user feedback

## 🔐 Authentication

The authentication flow matches the mobile app:

1. User enters email
2. OTP is sent to email
3. User enters OTP
4. JWT tokens stored in localStorage
5. Auto-redirect to dashboard on success

## 🌐 API Integration

The web app uses the same backend API as the mobile app:

- **Base URL**: `https://api.bc.constrogen.com/`
- **Endpoints**: Shared from `shared/services/authApi.ts`
- **Authentication**: Bearer token + x-account header
- **Error handling**: Automatic token refresh and logout on expiry

## 🧪 Development Notes

### Hot Module Replacement (HMR)

Vite provides instant HMR for fast development. Changes are reflected immediately without full page reload.

### TypeScript Path Aliases

The app uses path aliases for cleaner imports:

- `@/*` → `src/*`
- `@shared/*` → `../shared/*`

### Redux DevTools

Redux DevTools Extension is automatically enabled in development mode.

## 📦 Dependencies

### Core

- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `@reduxjs/toolkit` - State management
- `redux-saga` - Side effects
- `axios` - HTTP client

### UI & Styling

- `tailwindcss` - Utility-first CSS
- `react-hook-form` - Form handling

### PWA

- `vite-plugin-pwa` - PWA plugin for Vite
- `workbox-*` - Service worker utilities

## 🔧 Configuration Files

- **vite.config.ts** - Vite bundler config with PWA plugin
- **tsconfig.json** - TypeScript compiler options
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS plugins
- **.eslintrc.cjs** - ESLint rules

## 🚢 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to any static host

Build the app and serve the `dist/` directory:

```bash
npm run build
# Serve dist/ folder
```

## 🐛 Troubleshooting

### Assets not loading

Ensure all assets are copied from mobile app to `public/` directory.

### CORS errors

The API should allow requests from your web domain. Contact backend team if needed.

### Service Worker not updating

Hard refresh the browser (Ctrl+Shift+R) or clear cache.

### TypeScript errors in shared directory

Make sure `tsconfig.json` includes the shared directory in the `include` array.

## 📝 License

Private - Constrogen internal use only.

## 👥 Contributing

This is an internal project. For questions or contributions, contact the development team.

