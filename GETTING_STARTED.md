# Getting Started with Constrogen Web App

This guide will walk you through setting up and running the Constrogen web application for the first time.

## ⚡ Quick Start (5 minutes)

### Step 1: Copy Assets

From the project root, run the asset copying script:

**On Windows:**
```bash
copy-assets.bat
```

**On Mac/Linux:**
```bash
bash copy-assets.sh
```

This copies images from the mobile app to the web app's public folder.

### Step 2: Install Dependencies

```bash
cd constrogen_web
npm install
```

This will take 1-2 minutes depending on your internet speed.

### Step 3: Start Development Server

```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

### Step 4: Test the App

1. You'll see the **Login** screen
2. Enter your email: `test@example.com`
3. The app will attempt to send OTP to backend
4. Enter the OTP received
5. You'll be redirected to the **Dashboard**

## 🎯 What You Should See

### Login Screen
- Clean, responsive design
- Email input field
- "Send OTP" button
- Constrogen logo
- Construction background image

### OTP Screen
- 6-digit OTP input
- Email confirmation box
- "Change email" link
- "Resend OTP" button

### Dashboard
- Welcome message with user name
- Feature cards (Approvals, Purchase Orders, Daily Status)
- User profile section
- Logout button

## 📱 Testing as PWA

### Desktop (Chrome/Edge)

1. After starting dev server, open in Chrome
2. Look for install icon (⊕) in address bar
3. Click to install
4. App opens in standalone window

### Mobile Browser

1. Open `http://your-local-ip:3000` on mobile
2. **iOS (Safari)**: Share button → "Add to Home Screen"
3. **Android (Chrome)**: Menu (⋮) → "Install app"

## 🔍 Exploring the Code

### Key Files to Check

1. **src/pages/Login.tsx** - Login screen implementation
2. **src/pages/OTPVerification.tsx** - OTP verification
3. **src/pages/Dashboard.tsx** - Main dashboard
4. **src/App.tsx** - Routing and app structure
5. **src/store/index.ts** - Redux store setup
6. **shared/** - Business logic shared with mobile

### File Structure

```
constrogen_web/
├── public/              # Static assets
│   ├── logo.png        # App logo
│   ├── hook128.png     # Small logo
│   └── construction-bg.jpeg  # Background image
├── src/
│   ├── pages/          # Your screens
│   │   ├── Login.tsx
│   │   ├── OTPVerification.tsx
│   │   └── Dashboard.tsx
│   ├── store/          # Redux configuration
│   ├── services/       # API services
│   ├── hooks/          # React hooks
│   ├── utils/          # Utilities
│   └── App.tsx         # Main app component
└── shared/             # Shared with mobile app
    ├── redux/          # Redux slices & sagas
    ├── services/       # API client
    └── constants/      # Theme, config
```

## 🛠️ Development Tips

### Hot Module Replacement

Vite provides instant HMR. Make changes and see them immediately:

```tsx
// Edit src/pages/Dashboard.tsx
<h1>Welcome to Dashboard!</h1>
// Save - changes appear instantly!
```

### Using Redux DevTools

1. Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
2. Open DevTools (F12)
3. Click "Redux" tab
4. See all actions and state changes

### Styling with Tailwind

```tsx
// Use Tailwind utility classes
<div className="flex items-center justify-center p-4">
  <h1 className="text-2xl font-bold text-gray-800">
    Hello World
  </h1>
</div>
```

### Making API Calls

```tsx
import { apiService } from '../services/api';

async function fetchData() {
  try {
    const data = await apiService.get('/your-endpoint');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## 🧪 Building for Production

### Create Production Build

```bash
npm run build
```

This creates optimized files in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Opens at `http://localhost:4173` - test before deploying!

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js    # Your app code
│   └── index-[hash].css   # Styles
├── index.html
├── manifest.json
└── sw.js                   # Service worker
```

## 🚀 Deploying to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd constrogen_web
vercel
```

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Root directory: `constrogen_web`
5. Click "Deploy"

Done! Your app is live at `https://your-project.vercel.app`

## 🔧 Common Customizations

### Change Theme Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#a36460',  // Your brand color
      // Add more colors
    }
  }
}
```

### Add a New Page

1. Create file: `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`:

```tsx
<Route path="/my-page" element={<MyPage />} />
```

### Add Redux State

1. Create slice in `shared/redux/slices/mySlice.ts`
2. Add to `shared/redux/rootReducer.ts`
3. Use in components:

```tsx
import { useSelector } from 'react-redux';
const data = useSelector((state) => state.mySlice.data);
```

## 📊 Monitoring Performance

### Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Click "Generate report"
4. Target: All scores > 90

### Check Bundle Size

```bash
npm run build
```

Look at the output:
- `dist/assets/index-[hash].js` should be < 200KB (gzipped)

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Kill the process
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Assets not loading

```bash
# Re-run asset copy script
cd ..  # Go to project root
bash copy-assets.sh  # or copy-assets.bat on Windows
```

### TypeScript errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Service Worker caching issues

1. Open DevTools (F12)
2. Application tab
3. Service Workers
4. Click "Unregister"
5. Hard refresh (Ctrl+Shift+R)

## 📚 Next Steps

### Learn the Architecture

Read these docs in order:
1. `constrogen_web/README.md` - Web app details
2. `PROJECT_ARCHITECTURE.md` - Overall architecture
3. `CONVERSION_GUIDE.md` - How components are converted

### Build More Features

Try building:
- A new page with form
- A data table with API data
- A modal dialog
- Charts with data visualization

### Optimize Performance

- Implement code splitting
- Add lazy loading for images
- Optimize bundle size
- Add caching strategies

## 💡 Pro Tips

### VS Code Extensions

Install these for better DX:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux snippets

### Keyboard Shortcuts (VS Code)

- `Ctrl+P` - Quick file open
- `Ctrl+Shift+F` - Search in files
- `F12` - Go to definition
- `Ctrl+.` - Quick fix
- `Alt+Up/Down` - Move line

### Chrome DevTools Tips

- `Ctrl+Shift+C` - Inspect element
- `Ctrl+Shift+M` - Toggle device toolbar (mobile view)
- `F12` - Open DevTools
- `Ctrl+Shift+P` - Command palette

## 🎓 Learning Resources

### Official Docs

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)

### PWA Resources

- [PWA Guide](https://web.dev/progressive-web-apps)
- [Service Worker Guide](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Web App Manifest](https://web.dev/add-manifest)

## 🎉 Success!

You now have a fully functional React web app that:
- ✅ Runs in any browser
- ✅ Can be installed as PWA
- ✅ Works offline
- ✅ Shares logic with mobile app
- ✅ Has modern development experience

**Happy coding! 🚀**

---

Need help? Check:
1. README.md in this directory
2. SETUP.md in constrogen_web/
3. PROJECT_ARCHITECTURE.md for details

