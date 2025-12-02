import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { loginUser } from "./authSlice";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const { status } = useSelector((state: RootState) => state.auth);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!usernameOrEmail.trim() || !password) {
      Alert.alert("Login Error", "Please fill in all fields.");
      return;
    }

    const result = await dispatch(
      loginUser({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      navigation.navigate("Home" as never);
    } else {
      const errorMessage = (result.payload as string) || "Login failed";
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>

        <Text style={styles.label}>Username or Email</Text>
        <TextInput
          style={styles.input}
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
          placeholder="Your username or email"
          placeholderTextColor="#555"
          autoCapitalize="none"
          keyboardAppearance="dark"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry
          keyboardAppearance="dark"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerLinkContainer}>
          <Text style={styles.linkText}>Don't have an account? </Text>
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register" as never)}
          >
            Sign up
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0d0d0d",
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 15,
    color: "#ccc",
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#e10600",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#888",
  },
  registerLink: {
    color: "#e10600",
    fontWeight: "bold",
  },
});

export default LoginScreen;
