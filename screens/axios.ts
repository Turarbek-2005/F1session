import axios from "axios";
import { Platform } from "react-native";

// IP твоего ПК в локальной сети
const LAN_IP = "192.168.32.143";
const PORT = "4200";

function getBaseUrl() {
  if (!__DEV__) return "https://api.prod.com"; // продакшен

  // Для iPhone (Expo Go подключается по Wi-Fi)
  if (Platform.OS === "ios" && __DEV__) {
    return `http://${LAN_IP}:${PORT}/api`;
  }

  // Для Android эмулятора
  if (Platform.OS === "android" && __DEV__) {
    return `http://10.0.2.2:${PORT}/api`;
  }

  return `http://${LAN_IP}:${PORT}/api`;
}

export const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});
