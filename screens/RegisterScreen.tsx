import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "./store";
import { registerUser } from "./authSlice";
import { f1ApiService } from "./f1ApiService";
import { Driver, Team } from "./types";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const { status } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [favoriteDriversIds, setFavoriteDriversIds] = useState<string[]>([]);
  const [favoriteTeamsIds, setFavoriteTeamsIds] = useState<string[]>([]);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const driversData = await f1ApiService.getDrivers();
        setDrivers(driversData.drivers);
        const teamsData = await f1ApiService.getTeams();
        setTeams(teamsData.teams);
      } catch (e) {
        console.error("Failed to fetch drivers or teams", e);
      }
    };
    fetchInitialData();
  }, []);

  const validate = () => {
    if (!username.trim() || !email.trim() || !password) {
      return "Please fill in all fields.";
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return "Invalid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    if (favoriteDriversIds.length === 0) return "Please select at least one favorite driver.";
    if (favoriteTeamsIds.length === 0) return "Please select at least one favorite team.";
    return null;
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert("Registration Error", validationError);
      return;
    }

    const result = await dispatch(
      registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        favoriteDriversIds: favoriteDriversIds.length ? favoriteDriversIds : undefined,
        favoriteTeamsIds: favoriteTeamsIds.length ? favoriteTeamsIds : undefined,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      Alert.alert("Registration Successful", "You can now log in.", [
        { text: "OK", onPress: () => navigation.navigate("Login" as never) },
      ]);
    } else {
      const errorMessage = (result.payload as string) || "Registration failed";
      Alert.alert("Registration Failed", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Your username"
          placeholderTextColor="#555"
          autoCapitalize="none"
          keyboardAppearance="dark"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#555"
          keyboardType="email-address"
          autoCapitalize="none"
          keyboardAppearance="dark"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor="#555"
          secureTextEntry
          keyboardAppearance="dark"
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Repeat your password"
          placeholderTextColor="#555"
          secureTextEntry
          keyboardAppearance="dark"
        />

        <Text style={styles.label}>Select your favorite drivers</Text>
        <View style={[styles.pickerContainer, { padding: 4 }]}>
          {drivers.map((driver) => {
            const selected = favoriteDriversIds.includes(driver.driverId);
            return (
              <TouchableOpacity
                key={driver.driverId}
                onPress={() => {
                  setFavoriteDriversIds((prev) =>
                    prev.includes(driver.driverId) ? prev.filter((x) => x !== driver.driverId) : [...prev, driver.driverId]
                  );
                }}
                style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#232323' }}
              >
                <Text style={{ color: '#fff' }}>{`${driver.name} ${driver.surname}`}</Text>
                <Text style={{ color: selected ? '#e10600' : '#888' }}>{selected ? 'Selected' : ''}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Select your favorite teams</Text>
        <View style={[styles.pickerContainer, { padding: 4 }]}>
          {teams.map((team) => {
            const selected = favoriteTeamsIds.includes(team.teamId);
            return (
              <TouchableOpacity
                key={team.teamId}
                onPress={() => {
                  setFavoriteTeamsIds((prev) =>
                    prev.includes(team.teamId) ? prev.filter((x) => x !== team.teamId) : [...prev, team.teamId]
                  );
                }}
                style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#232323' }}
              >
                <Text style={{ color: '#fff' }}>{team.teamName}</Text>
                <Text style={{ color: selected ? '#e10600' : '#888' }}>{selected ? 'Selected' : ''}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login" as never)}
          >
            Sign in
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  pickerContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    overflow: 'hidden',
  },
  picker: {
    color: "#fff",
    ...Platform.select({
      android: {
        backgroundColor: '#1a1a1a',
      },
    }),
  },
  pickerItem: {
    color: '#fff',
    backgroundColor: '#1a1a1a',
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
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    paddingBottom: 20,
  },
  linkText: {
    color: "#888",
  },
  loginLink: {
    color: "#e10600",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
