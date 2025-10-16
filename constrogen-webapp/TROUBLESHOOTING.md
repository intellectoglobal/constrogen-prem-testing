# Troubleshooting Guide

## Error: Cannot resolve dependencies from shared directory

### Problem
```
Error: The following dependencies are imported but could not be resolved:
  redux-saga/effects
  axios
```

### Root Cause
Vite is trying to resolve these dependencies from the `shared` directory context, but they're installed in `constrogen_web/node_modules`.

### Solution Steps

#### Step 1: Clean Install

```bash
# Navigate to web app directory
cd constrogen_web

# Remove existing node_modules and lock file
# On Windows:
rmdir /s /q node_modules
del package-lock.json

# On Mac/Linux:
rm -rf node_modules package-lock.json

# Clean npm cache (optional but recommended)
npm cache clean --force

# Fresh install
npm install
```

#### Step 2: Clear Vite Cache

```bash
# Still in constrogen_web directory
# On Windows:
rmdir /s /q node_modules\.vite

# On Mac/Linux:
rm -rf node_modules/.vite
```

#### Step 3: Verify Dependencies

Check that these packages are installed:

```bash
npm list redux-saga axios @reduxjs/toolkit
```

You should see:
```
constrogen-web@1.0.0
├── @reduxjs/toolkit@2.8.2
├── axios@1.10.0
└── redux-saga@1.3.0
```

#### Step 4: Try Running Again

```bash
npm run dev
```

### Alternative Solution: If Clean Install Doesn't Work

If the above doesn't work, the issue might be with how Vite resolves modules from the parent `shared` directory.

#### Option A: Install Dependencies in Project Root

```bash
# Go to project root
cd ..

# Install shared dependencies at root level
npm install --save-dev redux-saga axios @reduxjs/toolkit
```

#### Option B: Use Yarn Instead

Yarn handles workspaces better:

```bash
# In constrogen_web
npm install -g yarn
yarn install
yarn dev
```

#### Option C: Symlink node_modules (Advanced)

```bash
# Create a symbolic link from shared to web node_modules
# On Windows (run as Administrator):
cd ..\shared
mklink /D node_modules ..\constrogen_web\node_modules

# On Mac/Linux:
cd ../shared
ln -s ../constrogen_web/node_modules node_modules
```

### Verification Checklist

After trying the solutions above, verify:

- [ ] `constrogen_web/node_modules` exists and has packages
- [ ] `constrogen_web/node_modules/redux-saga` exists
- [ ] `constrogen_web/node_modules/axios` exists
- [ ] `constrogen_web/node_modules/@reduxjs` exists
- [ ] No TypeScript errors in IDE
- [ ] `npm run dev` starts without errors

### Still Not Working?

#### Check Node Version

```bash
node --version
```

Should be `v18.0.0` or higher. If not:
```bash
nvm install 18
nvm use 18
```

#### Check npm Version

```bash
npm --version
```

Should be `9.0.0` or higher. Update if needed:
```bash
npm install -g npm@latest
```

#### Verify File Structure

Ensure your directory structure looks like this:

```
constrogen_mobile_app/
├── constrogen_mobile/
├── constrogen_web/
│   ├── node_modules/      ← Must exist with packages
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── shared/
    ├── redux/
    ├── services/
    └── package.json        ← Should exist (we created this)
```

#### Check vite.config.ts

Your `vite.config.ts` should have:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@shared': path.resolve(__dirname, '../shared')
  },
  dedupe: ['redux', 'redux-saga', 'axios', '@reduxjs/toolkit'],
  preserveSymlinks: false
},
optimizeDeps: {
  include: ['redux-saga', 'redux-saga/effects', 'axios', '@reduxjs/toolkit']
}
```

### Common Issues

#### Issue: `__dirname is not defined`

**Solution**: The vite.config.ts should have:

```typescript
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

#### Issue: `Cannot find module 'vite-plugin-pwa'`

**Solution**:
```bash
npm install --save-dev vite-plugin-pwa
```

#### Issue: TypeScript errors in shared directory

**Solution**: Ensure `tsconfig.json` includes shared:

```json
"include": ["src", "../shared"]
```

### Last Resort: Temporary Workaround

If nothing works, you can temporarily copy the shared files into the web app:

```bash
# From constrogen_web directory
# On Windows:
xcopy /E /I ..\shared src\shared

# On Mac/Linux:
cp -r ../shared src/shared
```

Then update imports from `@shared/...` to `./shared/...`

**Note**: This is NOT recommended for production as it defeats the purpose of code sharing.

### Getting Help

If you're still stuck:

1. Check the error message carefully
2. Look for file paths in the error
3. Verify those files exist
4. Check the imports in those files
5. Create an issue with:
   - Full error message
   - Output of `npm list`
   - Your Node/npm versions
   - Your directory structure

### Success Indicators

You know it's working when:

✅ `npm run dev` starts without errors
✅ Browser opens to http://localhost:3000
✅ You see the login screen
✅ No red errors in terminal
✅ No red errors in browser console
✅ Vite shows "ready in Xms"

### Additional Resources

- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
- [Vite Dependency Pre-Bundling](https://vitejs.dev/guide/dep-pre-bundling.html)
- [Node Modules Resolution](https://nodejs.org/api/modules.html#modules_all_together)

