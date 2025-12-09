import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchDrivers, selectAllDrivers } from "./driversSlice";
import { fetchTeams, selectAllTeams } from "./teamsSlice";
import { f1ApiService } from "./f1ApiService";

export default function StandingsScreen() {
  const dispatch = useAppDispatch();
  const drivers = useAppSelector(selectAllDrivers) || [];
  const teams = useAppSelector(selectAllTeams) || [];

  const [driversApi, setDriversApi] = useState<any>({ drivers_championship: [] });
  const [teamsApi, setTeamsApi] = useState<any>({ constructors_championship: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchDrivers());
    dispatch(fetchTeams());

    (async () => {
      try {
        const [d, t] = await Promise.all([
          f1ApiService.getStandingsDrivers ? f1ApiService.getStandingsDrivers() : {},
          f1ApiService.getStandingsTeams ? f1ApiService.getStandingsTeams() : {},
        ]);
        setDriversApi(d ?? { drivers_championship: [] });
        setTeamsApi(t ?? { constructors_championship: [] });
      } catch (err) {
        console.error("Failed to load standings:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#e10600" />
        <Text style={styles.loadingText}>Loading standings...</Text>
      </View>
    );
  }

  const sortedDrivers = drivers
    .map((driver: any) => {
      const stat = driversApi.drivers_championship.find((d: any) => d.driverId === driver.driverId);
      if (!stat) {
        return { driver, stat: { position: Infinity, points: 0, teamId: "unknown", driver: { name: "", surname: "", shortName: "" } }, matchedTeam: { teamImgUrl: "", teamId: "unknown" }, position: Infinity };
      }
      const matchedTeam = teams.find((t: any) => t.teamId === stat.teamId) || { teamImgUrl: "", teamId: stat.teamId };
      return { driver, stat, matchedTeam, position: stat.position !== undefined ? stat.position : Infinity };
    })
    .sort((a: any, b: any) => a.position - b.position);

  const sortedTeams = teams
    .map((team: any) => {
      const stat = teamsApi.constructors_championship.find((t: any) => t.teamId === team.teamId);
      if (!stat) return { team, stat: { position: Infinity, points: 0, team: { teamName: team.teamName } }, position: Infinity };
      return { team, stat, position: stat.position !== undefined ? stat.position : Infinity };
    })
    .sort((a: any, b: any) => a.position - b.position);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.header}>Drivers Standings</Text>
      {sortedDrivers.map(({ driver, stat, matchedTeam }: any) => (
        <View key={driver.driverId} style={styles.row}>
          <Text style={styles.pos}>{stat.position ?? "-"}</Text>
          <Text style={styles.driver}>{(stat.driver?.shortName) || `${stat.driver?.name} ${stat.driver?.surname}`}</Text>
          <Text style={styles.team}>{stat.team?.teamName ?? matchedTeam?.teamName ?? stat.teamId}</Text>
          <Text style={styles.points}>{stat.points ?? 0}</Text>
        </View>
      ))}

      <Text style={[styles.header, { marginTop: 20 }]}>Teams Standings</Text>
      {sortedTeams.map(({ team, stat }: any) => (
        <View key={team.teamId} style={styles.row}>
          <Text style={styles.pos}>{stat.position ?? "-"}</Text>
          <Text style={styles.driver}>{stat.team?.teamName ?? team.teamName}</Text>
          <Text style={styles.team}></Text>
          <Text style={styles.points}>{stat.points ?? 0}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0d0d0d" },
  container: { padding: 16, paddingBottom: 40 },
  header: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#222" },
  pos: { width: 30, color: "#fff", fontWeight: "700" },
  driver: { flex: 1, color: "#fff" },
  team: { flex: 1, color: "#ccc" },
  points: { width: 50, color: "#e10600", fontWeight: "700", textAlign: "right" },
  center: { justifyContent: "center", alignItems: "center", height: "100%" },
  loadingText: { color: "#ccc", marginTop: 8 },
});
