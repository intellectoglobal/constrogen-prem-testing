# Constrogen Project Architecture

This document describes the architecture of the Constrogen project, which consists of a React Native mobile app and a React web app (PWA) sharing common business logic.

## 📁 Project Structure

```
constrogen_mobile_app/
├── constrogen_mobile/          # React Native mobile app (Expo)
│   ├── app/                    # App screens (Expo Router)
│   ├── components/             # Mobile-specific components
│   ├── Redux/                  # Mobile Redux setup (deprecated, use shared/)
│   ├── services/              # Mobile services (deprecated, use shared/)
│   ├── assets/                # Images, fonts, etc.
│   └── package.json
│
├── constrogen_web/            # React web app (Vite + PWA)
│   ├── public/                # Static assets and PWA manifest
│   ├── src/
│   │   ├── pages/            # Web pages (routes)
│   │   ├── store/            # Web-specific Redux store setup
│   │   ├── services/         # Web-specific API client
│   │   ├── hooks/            # Web-specific hooks
│   │   ├── utils/            # Web-specific utilities
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
│
└── shared/                    # Shared business logic (NEW)
    ├── redux/
    │   ├── slices/           # Redux slices (auth, user)
    │   └── sagas/            # Redux sagas
    ├── services/
    │   ├── storageService.ts # Platform-agnostic storage interface
    │   ├── apiService.ts     # API client factory
    │   └── authApi.ts        # Auth API endpoints
    ├── constants/
    │   └── theme.ts          # Shared theme colors
    └── utils/
        └── errorHandler.ts   # Error handling utilities
```

## 🎯 Key Design Decisions

### 1. Shared Business Logic

**Problem**: Maintaining separate codebases for mobile and web leads to duplication and inconsistency.

**Solution**: Extract all platform-agnostic logic into a `shared/` directory that both apps import from.

**What's shared**:
- Redux slices and sagas
- API client logic
- Business logic and utilities
- TypeScript types and interfaces
- Constants (theme, endpoints)

**What's NOT shared**:
- UI components (React Native vs React DOM)
- Platform-specific APIs (Camera, Location, etc.)
- Navigation (Expo Router vs React Router)
- Storage implementation (SecureStore vs localStorage)

### 2. Dependency Injection for Platform-Specific Code

**Problem**: Some functionality (like storage) needs different implementations on mobile vs web.

**Solution**: Use dependency injection pattern.

**Example - Storage**:

```typescript
// shared/services/storageService.ts
export interface IStorageService {
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
  remove(key: string): Promise<void>;
}

// Web implementation
export class WebStorageService implements IStorageService {
  async set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  // ...
}

// Mobile implementation (in mobile app)
export class MobileStorageService implements IStorageService {
  async set(key: string, value: any) {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }
  // ...
}
```

**Example - Redux Saga**:

```typescript
// shared/redux/sagas/authSaga.ts
export const createAuthSaga = (storageService: IStorageService) => {
  function* verifyOtpSaga(action: any) {
    // Uses injected storage service
    const authInfo = yield call([storageService, 'get'], 'authInfo');
    // ...
  }
  return function* authSaga() {
    yield takeLatest(checkRefetchToken.type, verifyOtpSaga);
  }
}

// Web app usage
const storageService = new WebStorageService();
const rootSaga = createRootSaga(storageService);

// Mobile app usage
const storageService = new MobileStorageService();
const rootSaga = createRootSaga(storageService);
```

### 3. Component Conversion (React Native → React Web)

| React Native | Web Equivalent | Notes |
|--------------|---------------|-------|
| `View` | `div` | Use Tailwind classes |
| `Text` | `span`, `p`, `h1`, etc. | Semantic HTML |
| `TouchableOpacity` | `button` | Add cursor styles |
| `Image` | `img` | Use public/ folder |
| `TextInput` | `input` | Add focus styles |
| `ScrollView` | `div` with overflow | CSS scrolling |
| `FlatList` | `map()` + `div` | Manual iteration |
| `StyleSheet` | Tailwind CSS | Utility classes |
| `Modal` | Custom component | Portal or library |
| `ActivityIndicator` | CSS spinner | Or library |

### 4. State Management

Both apps use **Redux Toolkit** + **Redux Saga** for consistent state management:

```
┌─────────────┐
│   UI Layer  │ (Mobile: RN Components, Web: React Components)
└──────┬──────┘
       │ dispatch(action)
┌──────▼──────┐
│ Redux Store │ (Shared slices: auth, user)
└──────┬──────┘
       │ saga middleware
┌──────▼──────┐
│ Redux Saga  │ (Shared sagas with injected dependencies)
└──────┬──────┘
       │ API calls
┌──────▼──────┐
│ API Service │ (Shared API client + endpoints)
└──────┬──────┘
       │ HTTP requests
┌──────▼──────┐
│   Backend   │ (https://api.bc.constrogen.com)
└─────────────┘
```

### 5. Navigation

**Mobile**: Expo Router (file-based routing)
**Web**: React Router (programmatic routing)

Both provide:
- Route protection (auth required)
- Navigation state management
- Deep linking support

### 6. API Integration

**Shared API Client** (`shared/services/apiService.ts`):
- Axios-based HTTP client
- Request/response interceptors
- Automatic token injection
- Error handling
- Token refresh logic

**Platform-specific initialization**:

```typescript
// Web
const storageService = new WebStorageService();
const apiService = createApiService(storageService, logoutCallback);

// Mobile  
const storageService = new MobileStorageService();
const apiService = createApiService(storageService, logoutCallback);
```

### 7. Progressive Web App (PWA)

The web app is configured as a PWA for app-like experience:

- **Manifest** (`public/manifest.json`) - App metadata
- **Service Worker** (`public/sw.js`) - Offline caching
- **Install prompt** - Add to home screen
- **Offline support** - Cache-first strategy
- **App icons** - Various sizes for different devices

## 🔄 Data Flow Example: Login

```
1. User enters email in Login.tsx (mobile or web)
   ↓
2. authApi.verifyEmail() called
   ↓
3. API request via shared apiService
   ↓
4. Backend sends OTP to email
   ↓
5. Navigate to OTP screen with session_id
   ↓
6. User enters OTP
   ↓
7. authApi.verifyOTP() called
   ↓
8. dispatch(checkRefetchToken(response))
   ↓
9. authSaga intercepts action
   ↓
10. Saga saves to storage (platform-specific)
    ↓
11. dispatch(refetchTokenSuccess(...))
    ↓
12. Redux updates state: isAuthenticated = true
    ↓
13. Protected route detects auth change
    ↓
14. Navigate to Dashboard
```

## 🧩 Extending the System

### Adding a New Feature

1. **Shared Logic**:
   - Add Redux slice in `shared/redux/slices/`
   - Add saga if needed in `shared/redux/sagas/`
   - Add API endpoints in `shared/services/`
   - Add types in shared location

2. **Mobile UI**:
   - Create screen in `constrogen_mobile/app/`
   - Create components in `constrogen_mobile/components/`
   - Use shared Redux hooks

3. **Web UI**:
   - Create page in `constrogen_web/src/pages/`
   - Add route in `App.tsx`
   - Use shared Redux hooks

### Adding a Platform-Specific Feature

If a feature can't be shared (e.g., Camera):

1. Create interface in shared/ (if abstraction is possible)
2. Implement in mobile-specific directory
3. For web, provide alternative or graceful degradation

## 📊 Technology Stack Comparison

| Aspect | Mobile | Web |
|--------|--------|-----|
| Framework | React Native | React |
| Routing | Expo Router | React Router |
| Build Tool | Expo | Vite |
| Styling | StyleSheet + NativeWind | Tailwind CSS |
| Storage | SecureStore | localStorage |
| State | Redux + Saga | Redux + Saga |
| API | Axios | Axios |
| Forms | react-hook-form | react-hook-form |
| Platform | iOS, Android | Desktop, Mobile browsers |
| Distribution | App Store, Play Store | Web, PWA |

## 🔒 Security Considerations

### Mobile
- Tokens stored in SecureStore (encrypted)
- Native biometric authentication available
- No CORS issues (native HTTP)

### Web
- Tokens stored in localStorage (less secure)
- HTTPS required for PWA
- Subject to CORS policies
- Vulnerable to XSS (sanitize inputs)

**Recommendations**:
- Use short-lived tokens
- Implement token refresh
- Validate all inputs
- Use HTTPS in production
- Set secure headers

## 🚀 Deployment Strategy

### Mobile
1. Build with EAS (Expo Application Services)
2. Submit to App Store / Play Store
3. Users download from store

### Web
1. Build with `npm run build`
2. Deploy `dist/` to static host (Vercel, Netlify, etc.)
3. Users access via browser or install PWA

### Shared Updates
When updating shared logic:
1. Test both mobile and web apps
2. Deploy web immediately
3. Build mobile and submit to stores
4. Users update web instantly, mobile via store

## 📈 Performance Considerations

### Mobile
- Bundle size matters (use code splitting)
- Native animations preferred
- Image optimization critical

### Web
- Lighthouse score important
- PWA caching for speed
- Code splitting for faster load
- Tree shaking for smaller bundles

### Shared
- Keep shared code lean
- Avoid heavy dependencies in shared/
- Use dynamic imports for large features

## 🧪 Testing Strategy

### Unit Tests
- Test shared Redux slices/sagas independently
- Mock storage service in tests
- Test API functions with mock responses

### Integration Tests
- Test platform-specific storage implementations
- Test API integration end-to-end
- Test auth flow on both platforms

### E2E Tests
- Mobile: Detox or Maestro
- Web: Playwright or Cypress

## 📝 Migration Path for Existing Mobile Code

To migrate existing mobile code to use shared logic:

1. **Move Redux slices**: `constrogen_mobile/Redux/reducer/` → `shared/redux/slices/`
2. **Move sagas**: `constrogen_mobile/Redux/saga/` → `shared/redux/sagas/`
3. **Move API**: `constrogen_mobile/services/` → `shared/services/`
4. **Update imports**: Change `@/Redux/...` → `@shared/redux/...`
5. **Test thoroughly**: Ensure mobile still works
6. **Implement web**: Use migrated shared code

## 🎓 Learning Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Saga](https://redux-saga.js.org/)
- [Vite](https://vitejs.dev/)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

When contributing:
1. Keep shared logic platform-agnostic
2. Use dependency injection for platform-specific code
3. Test on both mobile and web
4. Follow TypeScript best practices
5. Document platform differences

## 📞 Support

For questions about this architecture:
- Check this documentation first
- Review existing code examples
- Contact the development team

