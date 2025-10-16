# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed

## Step-by-Step Setup

### 1. Copy Assets

The web app needs assets from the mobile app. Run these commands from the project root:

```bash
# Create public directory if it doesn't exist
mkdir -p constrogen_web/public

# Copy assets
cp constrogen_mobile/assets/logo.png constrogen_web/public/
cp constrogen_mobile/assets/hook128.png constrogen_web/public/
cp constrogen_mobile/assets/construction-bg.jpeg constrogen_web/public/
```

If assets don't exist in mobile app, you can use placeholders:
- Download a construction-themed background image
- Use any logo for the app icon

### 2. Install Dependencies

```bash
cd constrogen_web
npm install
```

This will install all required packages including:
- React and React DOM
- Vite (build tool)
- Redux and Redux Saga
- React Router
- Tailwind CSS
- PWA plugins

### 3. Start Development Server

```bash
npm run dev
```

The app will open at http://localhost:3000

### 4. Test the App

1. Navigate to http://localhost:3000
2. You should see the login screen
3. Enter a valid email
4. The app will send OTP request to backend
5. Enter the OTP received
6. You'll be redirected to the dashboard

## Build for Production

```bash
npm run build
```

Built files will be in `dist/` directory.

## Testing PWA Features

To test PWA features in development:

1. Build the app: `npm run build`
2. Preview the build: `npm run preview`
3. Open in Chrome
4. Check for install prompt in address bar
5. Install the app
6. Try offline mode (disconnect internet)

## Troubleshooting

### "Module not found" errors

Make sure you installed dependencies:
```bash
npm install
```

### Assets not loading

Ensure you copied assets from mobile app to `public/` directory.

### CORS errors

The backend API must allow requests from localhost during development. Contact backend team if you see CORS errors.

### TypeScript errors

If you see errors about missing types:
```bash
npm install --save-dev @types/node
```

### Service Worker not updating

During development, service workers can cause issues. In Chrome DevTools:
1. Go to Application tab
2. Click "Service Workers"
3. Click "Unregister"

Or do a hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

## Next Steps

- Read the main README.md for detailed documentation
- Review PROJECT_ARCHITECTURE.md to understand the codebase
- Start building new features!

## Common Tasks

### Adding a new page

1. Create file in `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`
3. Import and use shared Redux if needed

### Styling components

Use Tailwind CSS classes:
```tsx
<div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-800">Hello</h1>
</div>
```

### Using Redux

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { someAction } from '@shared/redux/slices/someSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.someSlice.data);
  
  const handleClick = () => {
    dispatch(someAction(payload));
  };
  
  return <div onClick={handleClick}>{data}</div>;
}
```

### Making API calls

```tsx
import { apiService } from '../services/api';

async function fetchData() {
  try {
    const result = await apiService.get('/endpoint');
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

## Support

If you encounter issues:
1. Check this guide
2. Read README.md
3. Check browser console for errors
4. Contact development team

