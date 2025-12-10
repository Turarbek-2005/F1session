import axios from "axios";
import { Platform } from "react-native";

// LAN IP твоего ПК
const LAN_IP = "172.20.10.2";
const PORT = "4200";

function getBaseUrl() {
  if (!__DEV__) return "https://api.prod.com"; // для продакшена

  if (Platform.OS === "android" && !__DEV__) {
    // Android эмулятор
    return `http://10.0.2.2:${PORT}/api`;
  }

  // iOS симулятор или реальное устройство Expo Go
  return `http://${LAN_IP}:${PORT}/api`;
}

export const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});
