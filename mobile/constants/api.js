// import { Platform } from "react-native";

// // const PROD = "https://wallet-api-cxqp.onrender.com/api";
// const PROD = "https://tasktracker-reactnative-api.onrender.com/api";
// const DEV_LOCALHOST = "http://localhost:5001/api";
// const DEV_ANDROID_EMULATOR = "http://10.0.2.2:5001/api";

// const DEV = Platform.OS === "android" ? DEV_ANDROID_EMULATOR : DEV_LOCALHOST;

// // Use PROD (Render) URL since backend is deployed there
// export const API_URL = PROD;

// npx expo install expo-device

// using rogburst architecture
import { Platform } from "react-native";
import * as Device from "expo-device";

const PROD = "https://tasktracker-reactnative-api.onrender.com/api";

// ⚠️ Replace 192.168.X.X with your actual computer local IP address for your iPhone
const DEV_IP = "http://192.168.1.61:5001/api";
const DEV_ANDROID_EMULATOR = "http://10.0.2.2:5001/api";

// 1. Check if it is a physical device (iPhone or Android)
const API_URL_SELECTOR = () => {
  const isRealDevice =
    Device.isDevice &&
    Device.brand !== null &&
    !Device.product?.includes("sdk");
  //   if (Device.isDevice) {
  if (isRealDevice) {
    return PROD; // Physical devices always use the live Render URL
  }

  // 2. If it is an emulator, separate by platform
  return Platform.OS === "android" ? DEV_ANDROID_EMULATOR : DEV_IP;
};

export const API_URL = API_URL_SELECTOR();
console.log("Current API Target URL:", API_URL);
