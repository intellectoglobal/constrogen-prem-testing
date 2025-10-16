# React Native to React Web Conversion Guide

This guide demonstrates how components were converted from React Native to React Web for the Constrogen project.

## Example 1: Login Screen

### React Native Version (Original)

```tsx
// constrogen_mobile/app/(auth)/login.tsx
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  
  return (
    <ImageBackground
      source={require("../../assets/construction-bg.jpeg")}
      style={styles.background}
      resizeMode="stretch"
    >
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require("../../assets/hook128.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Constrogen</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
  },
  // ... more styles
});
```

### React Web Version (Converted)

```tsx
// constrogen_web/src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-5"
      style={{
        backgroundImage: 'url(/construction-bg.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <img
          src="/hook128.png"
          alt="Logo"
          className="w-16 h-16 mb-5"
        />
        <h1 className="text-3xl font-bold mb-2">Constrogen</h1>
        
        <input
          type="email"
          className="w-full border rounded-md px-4 py-3 mb-4"
          placeholder="Enter your email"
        />
        
        <button className="w-full py-4 rounded-md bg-primary text-white">
          Send OTP
        </button>
      </div>
    </div>
  );
}
```

### Key Changes

| Aspect | React Native | React Web |
|--------|--------------|-----------|
| **Container** | `View` | `div` |
| **Text** | `Text` | `h1`, `p`, `span` |
| **Image** | `Image` with `require()` | `img` with `/public` path |
| **Background** | `ImageBackground` | `div` with `backgroundImage` |
| **Input** | `TextInput` | `input` |
| **Button** | `TouchableOpacity` | `button` |
| **Styling** | `StyleSheet.create()` | Tailwind CSS classes |
| **Layout** | Flexbox via styles | Tailwind flex utilities |
| **Toast** | `react-native-toast-message` | Custom toast utility |
| **Navigation** | `router.replace()` (Expo) | `navigate()` (React Router) |

## Component Mapping Reference

### Layout Components

```tsx
// React Native
<View style={{ flex: 1, padding: 20 }}>
  <Text>Hello</Text>
</View>

// React Web
<div className="flex-1 p-5">
  <p>Hello</p>
</div>
```

### Scrolling

```tsx
// React Native
<ScrollView>
  <View>{/* content */}</View>
</ScrollView>

// React Web
<div className="overflow-auto">
  <div>{/* content */}</div>
</div>
```

### Images

```tsx
// React Native
<Image 
  source={require('./image.png')}
  style={{ width: 100, height: 100 }}
  resizeMode="contain"
/>

// React Web
<img 
  src="/image.png"
  className="w-24 h-24 object-contain"
  alt="Description"
/>
```

### Buttons

```tsx
// React Native
<TouchableOpacity 
  onPress={handlePress}
  disabled={loading}
>
  <Text>Click me</Text>
</TouchableOpacity>

// React Web
<button 
  onClick={handlePress}
  disabled={loading}
  className="cursor-pointer disabled:cursor-not-allowed"
>
  Click me
</button>
```

### Text Input

```tsx
// React Native
<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Enter text"
  keyboardType="email-address"
  secureTextEntry
/>

// React Web
<input
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Enter text"
  type="email"  // or "password"
  className="w-full px-4 py-2 border rounded"
/>
```

### Lists

```tsx
// React Native
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemCard item={item} />}
/>

// React Web
<div>
  {items.map((item) => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>
```

### Modals

```tsx
// React Native
<Modal visible={isVisible} animationType="slide">
  <View>
    <Text>Modal content</Text>
  </View>
</Modal>

// React Web (using portal pattern)
{isVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg">
      <p>Modal content</p>
    </div>
  </div>
)}
```

## Styling Conversion

### Flexbox

```tsx
// React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  }
});

// React Web (Tailwind)
<div className="flex-1 flex flex-row justify-between items-center p-5">
```

### Colors and Theme

```tsx
// React Native
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#a36460',
    borderRadius: 6,
    padding: 14,
  }
});

// React Web (Tailwind + custom colors)
<button className="bg-primary rounded-md p-3.5">
// where 'primary' is defined in tailwind.config.js
```

### Responsive Design

```tsx
// React Native
<View style={{ 
  width: Dimensions.get('window').width > 768 ? '50%' : '100%' 
}}>

// React Web (Tailwind)
<div className="w-full md:w-1/2">
```

## Platform-Specific Code

### Storage

```tsx
// React Native
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('key', value);
const value = await SecureStore.getItemAsync('key');

// React Web
localStorage.setItem('key', JSON.stringify(value));
const value = JSON.parse(localStorage.getItem('key'));
```

### Navigation

```tsx
// React Native (Expo Router)
import { router } from 'expo-router';

router.push('/screen-name');
router.replace('/screen-name');

// React Web (React Router)
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/screen-name');
navigate('/screen-name', { replace: true });
```

### Toast Notifications

```tsx
// React Native
import Toast from 'react-native-toast-message';

Toast.show({
  type: 'error',
  text1: 'Error!',
  text2: message
});

// React Web (custom implementation)
import { showToast } from '../utils/toast';

showToast({
  toastType: 'error',
  message: message
});
```

## Redux Integration (Same for Both!)

Since we use shared Redux logic, the integration is identical:

```tsx
// Both platforms
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store'; // platform-specific
import { checkRefetchToken } from '@shared/redux/slices/authSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const handleLogin = () => {
    dispatch(checkRefetchToken(data));
  };
  
  return (
    // JSX differs, but Redux logic is the same
  );
}
```

## Form Handling (Same for Both!)

We use `react-hook-form` on both platforms:

```tsx
// Both platforms
import { useForm, Controller } from 'react-hook-form';

function MyForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "" }
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <Controller
      control={control}
      name="email"
      rules={{ required: "Email is required" }}
      render={({ field: { onChange, value } }) => (
        // Platform-specific input component here
        <input value={value} onChange={onChange} />
        // or <TextInput value={value} onChangeText={onChange} />
      )}
    />
  );
}
```

## API Calls (Same for Both!)

Using shared API service:

```tsx
// Both platforms
import { authApi } from '../services/api'; // platform-specific import
// which imports from @shared/services/authApi

async function login(email: string) {
  const result = await authApi.verifyEmail({ email });
  return result;
}
```

## Icons

```tsx
// React Native
import { MaterialCommunityIcons } from '@expo/vector-icons';

<MaterialCommunityIcons name="send" size={20} color="#fff" />

// React Web (inline SVG or icon library)
<svg className="w-5 h-5" fill="currentColor">
  <path d="..." />
</svg>

// Or use react-icons
import { MdSend } from 'react-icons/md';
<MdSend className="w-5 h-5" />
```

## Best Practices for Conversion

### 1. Extract Business Logic First

Before converting UI, move all business logic to shared/:
- Redux slices
- API calls  
- Validation functions
- Data transformations

### 2. Convert UI Layer by Layer

1. Layout structure (View → div)
2. Text elements (Text → p/h1/span)
3. Interactive elements (TouchableOpacity → button)
4. Inputs (TextInput → input)
5. Images (Image → img)
6. Lists (FlatList → map)

### 3. Use Semantic HTML

Don't just convert View to div everywhere:

```tsx
// ❌ Bad
<div>
  <div>Title</div>
  <div>Description</div>
</div>

// ✅ Good
<article>
  <h2>Title</h2>
  <p>Description</p>
</article>
```

### 4. Maintain Accessibility

```tsx
// React Native
<TouchableOpacity accessible accessibilityLabel="Submit button">

// React Web
<button aria-label="Submit button">
```

### 5. Handle Platform Differences Gracefully

```tsx
// Shared business logic
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Platform-specific UI
// Mobile: uses native keyboard type
<TextInput keyboardType="email-address" />

// Web: uses HTML5 input type
<input type="email" />
```

## Testing Conversions

### 1. Visual Comparison

Open both apps side by side and compare:
- Layout
- Colors
- Spacing
- Typography
- Interactions

### 2. Functional Testing

Test the same user flows on both:
- Login/logout
- Form submissions
- Navigation
- API calls
- Error handling

### 3. Responsive Testing

For web, test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## Common Pitfalls

### ❌ Don't Do This

```tsx
// Mixing React Native components in web
import { View } from 'react-native'; // ❌ Won't work on web

// Inline styles everywhere
<div style={{ display: 'flex', padding: 20 }}> // ❌ Use Tailwind

// Hardcoded dimensions
<div style={{ width: 400 }}> // ❌ Not responsive
```

### ✅ Do This

```tsx
// Use web components
<div> // ✅

// Use Tailwind classes
<div className="flex p-5"> // ✅

// Use responsive utilities
<div className="w-full md:w-96"> // ✅
```

## Performance Considerations

### React Native
- Bundle size affects app download
- Use `React.memo` for list items
- Lazy load screens

### React Web
- Bundle size affects initial load
- Use code splitting: `React.lazy()`
- Optimize images (WebP, lazy loading)
- Use Lighthouse for audits

## Conclusion

The key to successful conversion is:

1. **Separate concerns**: Business logic in shared/, UI in platform-specific folders
2. **Use abstractions**: Interfaces for platform-specific code
3. **Stay consistent**: Same patterns on both platforms
4. **Test thoroughly**: Every feature on both platforms
5. **Document differences**: Note platform-specific limitations

By following these patterns, you can maintain ~80% code sharing between mobile and web, with only UI layer differences.

