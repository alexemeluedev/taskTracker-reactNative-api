// import { Slot } from "expo-router";
// import SafeScreen from "@/components/SafeScreen";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
// import { StatusBar } from "expo-status-bar";

// export default function RootLayout() {
//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//       <SafeScreen>
//         <Slot />
//       </SafeScreen>
//       <StatusBar style="dark" />
//     </ClerkProvider>
//   );
// }

// npx create-expo-app@latest .
// npx expo
// npm run reset-project

import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { COLORS } from "@/constants/colors";

// Define the correct token cache using Expo SecureStore
const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch {
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

// Ensure your Publishable Key is available
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file.",
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <KeyboardProvider>
          <SafeScreen>
            <Slot />
          </SafeScreen>
          <StatusBar
            style="light"
            backgroundColor={COLORS.background}
            translucent={false}
          />
        </KeyboardProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
