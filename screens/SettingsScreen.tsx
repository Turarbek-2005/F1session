import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Switch } from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks";
import { updateUser } from "./authSlice";
import { f1ApiService } from "./f1ApiService";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s: any) => s.auth.user);

  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [favoriteDriversIds, setFavoriteDriversIds] = useState<string[]>(
    Array.isArray((user as any)?.favoriteDriversIds) ? (user as any).favoriteDriversIds : ((user as any)?.favoriteDriverIds ? (user as any).favoriteDriverIds : [])
  );
  const [favoriteTeamsIds, setFavoriteTeamsIds] = useState<string[]>(
    Array.isArray((user as any)?.favoriteTeamsIds) ? (user as any).favoriteTeamsIds : ((user as any)?.favoriteTeamIds ? (user as any).favoriteTeamIds : [])
  );

  const [status, setStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const [error, setError] = useState<string | null>(null);

  const [driversApi, setDriversApi] = useState<any>({ drivers: [] });
  const [teamsApi, setTeamsApi] = useState<any>({ teams: [] });

  useEffect(() => {
    setUsername(user?.username ?? "");
    setEmail(user?.email ?? "");
    const drv = Array.isArray((user as any)?.favoriteDriversIds) ? (user as any).favoriteDriversIds : ((user as any)?.favoriteDriverIds ? (user as any).favoriteDriverIds : []);
    const tm = Array.isArray((user as any)?.favoriteTeamsIds) ? (user as any).favoriteTeamsIds : ((user as any)?.favoriteTeamIds ? (user as any).favoriteTeamIds : []);
    setFavoriteDriversIds(drv);
    setFavoriteTeamsIds(tm);

    // fetch API data
    (async () => {
      try {
        const [d, t] = await Promise.all([f1ApiService.getDrivers(), f1ApiService.getTeams()]);
        setDriversApi(d ?? { drivers: [] });
        setTeamsApi(t ?? { teams: [] });
      } catch (err) {
        console.error("Failed to fetch F1 API data in SettingsScreen:", err);
      }
    })();
  }, [user]);

  async function handleSave() {
    setError(null);
    setStatus("saving");
    try {
      const payload: any = { username: username.trim(), email: email.trim() };
      if (password) payload.password = password;
      payload.favoriteDriversIds = favoriteDriversIds || [];
      payload.favoriteTeamsIds = favoriteTeamsIds || [];

      await dispatch(updateUser(payload)).unwrap();
      setStatus("saved");
      setPassword("");
    } catch (err: any) {
      setError(err?.message || String(err));
      setStatus("error");
    }
  }

  function toggleDriver(id: string, value: boolean) {
    setFavoriteDriversIds((prev) => (value ? [...prev, id] : prev.filter((x) => x !== id)));
  }
  function toggleTeam(id: string, value: boolean) {
    setFavoriteTeamsIds((prev) => (value ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>New password (leave blank to keep)</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.sectionTitle}>Favorite drivers</Text>
      <View style={styles.box}>
        {driversApi?.drivers.map((driver: any) => {
          const checked = favoriteDriversIds.includes(driver.driverId);
          return (
            <View key={driver.driverId} style={styles.row}>
              <Switch value={checked} onValueChange={(v) => toggleDriver(driver.driverId, v)} />
              <Text style={styles.itemText}>{driver.name} {driver.surname}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Favorite teams</Text>
      <View style={styles.box}>
        {teamsApi?.teams.map((team: any) => {
          const checked = favoriteTeamsIds.includes(team.teamId);
          return (
            <View key={team.teamId} style={styles.row}>
              <Switch value={checked} onValueChange={(v) => toggleTeam(team.teamId, v)} />
              <Text style={styles.itemText}>{team.teamName}</Text>
            </View>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {status === "saved" ? <Text style={styles.success}>Settings saved.</Text> : null}

      <Button title={status === "saving" ? "Saving..." : "Save settings"} onPress={handleSave} disabled={status === "saving"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0d0d0d" },
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12, color: "#fff" },
  label: { fontSize: 14, marginTop: 8, marginBottom: 4, color: "#bbb" },
  input: { borderWidth: 1, borderColor: "#222", padding: 8, borderRadius: 6, color: "#fff", backgroundColor: "#111" },
  sectionTitle: { fontSize: 16, marginTop: 12, marginBottom: 6, fontWeight: "500", color: "#fff" },
  box: { borderWidth: 1, borderColor: "#222", padding: 8, borderRadius: 6, maxHeight: 220 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  itemText: { marginLeft: 8, color: "#fff" },
  error: { color: "#f87171", marginVertical: 8 },
  success: { color: "#86efac", marginVertical: 8 },
});
