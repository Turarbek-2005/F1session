import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "./hooks";
import { selectAllTeams } from "./teamsSlice";
import { selectAllDrivers } from "./driversSlice";
import { f1ApiService } from "./f1ApiService";
import { TeamDetailsResponse } from "./types";
import { AppBar, IconButton, Surface, Button } from "@react-native-material/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TeamDetailScreen = ({ route, navigation }: any) => {
  const { teamId } = route.params;
  const teams = useAppSelector(selectAllTeams);
  const drivers = useAppSelector(selectAllDrivers);
  const [teamDetails, setTeamDetails] = useState<TeamDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const team = teams.find((t) => t.id === teamId);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        if (team?.teamId) {
          const details = await f1ApiService.getTeamDetails(team.teamId);
          setTeamDetails(details);
        }
      } catch (error) {
        console.error("Failed to fetch team details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (team) {
      fetchApiData();
    }
  }, [team]);

  if (loading || !team) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e10600" />
      </SafeAreaView>
    );
  }

  const teamDrivers = drivers.filter((d) => d.teamId === team.teamId);
  const apiTeam = teamDetails?.team?.[0];

  return (
    <View style={styles.screen}>
      

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Surface elevation={2} style={styles.headerSurface}>
          <View style={styles.header}>
            {team.teamImgUrl ? (
              <Image
                source={{ uri: team.teamImgUrl }}
                style={styles.teamLogo}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.teamLogoPlaceholder}>
                <MaterialCommunityIcons name="account-group" size={48} color="#333" />
              </View>
            )}

            <View style={styles.headerText}>
              <Text style={styles.teamName}>{apiTeam?.teamName || team.teamId}</Text>
              {apiTeam?.teamNationality && (
                <Text style={styles.nationality}>{apiTeam.teamNationality}</Text>
              )}
            </View>
          </View>
        </Surface>

        {apiTeam && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Team Statistics</Text>
            <View style={styles.statsGrid}>
              <Surface elevation={3} style={styles.statCard}>
                <MaterialCommunityIcons name="trophy" size={24} color="#e10600" />
                <Text style={styles.statValue}>{apiTeam.constructorsChampionships}</Text>
                <Text style={styles.statLabel}>Constructor Titles</Text>
              </Surface>

              <Surface elevation={3} style={styles.statCard}>
                <MaterialCommunityIcons name="account-tie" size={24} color="#e10600" />
                <Text style={styles.statValue}>{apiTeam.driversChampionships}</Text>
                <Text style={styles.statLabel}>Driver Titles</Text>
              </Surface>

              <Surface elevation={3} style={styles.statCard}>
                <MaterialCommunityIcons name="calendar" size={24} color="#e10600" />
                <Text style={styles.statValue}>{apiTeam.firstAppeareance}</Text>
                <Text style={styles.statLabel}>First Season</Text>
              </Surface>

              <Surface elevation={3} style={styles.statCard}>
                <MaterialCommunityIcons name="history" size={24} color="#e10600" />
                <Text style={styles.statValue}>
                  {new Date().getFullYear() - apiTeam.firstAppeareance}
                </Text>
                <Text style={styles.statLabel}>Years in F1</Text>
              </Surface>
            </View>
          </View>
        )}

        {team.bolidImgUrl && (
          <View style={styles.carSection}>
            <Text style={styles.sectionTitle}>2025 Car</Text>
            <Surface elevation={2} style={styles.carSurface}>
              <Image source={{ uri: team.bolidImgUrl }} style={styles.carImage} resizeMode="contain" />
            </Surface>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Drivers ({teamDrivers.length})</Text>

          {teamDrivers.map((driver) => (
            <Pressable
              key={driver.id}
              onPress={() => navigation.navigate("DriverDetail", { driverId: driver.id })}
              style={({ pressed }) => [
                styles.driverCard,
                pressed && { opacity: 0.92, transform: [{ scale: 0.995 }] },
              ]}
            >
              <Surface elevation={2} style={styles.driverSurface}>
                {driver.imgUrl ? (
                  <View style={styles.driverImageWrapper}>
                    <Image source={{ uri: driver.imgUrl }} style={styles.driverImage} />
                  </View>
                ) : (
                  <View style={styles.driverImagePlaceholder}>
                    <MaterialCommunityIcons name="account" size={36} color="#333" />
                  </View>
                )}

                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{driver.driverId}</Text>
                  {driver.nationalityImgUrl && (
                    <View style={styles.nationalityContainer}>
                      <Image source={{ uri: driver.nationalityImgUrl }} style={styles.flagImage} />
                      <Text style={styles.driverNationality}>{driver.nationality}</Text>
                    </View>
                  )}
                </View>

                <Button
                  title="Open"
                  color="#e10600"
                  onPress={() => navigation.navigate("DriverDetail", { driverId: driver.id })}
                  style={styles.openButton}
                />
              </Surface>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0d0d0d" },
  container: { flex: 1, paddingHorizontal: 16 },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
  },

  appbarTitle: { color: "#fff", fontWeight: "700" },

  headerSurface: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    width: 72,
    height: 72,
    borderRadius: 48,
    marginRight: 14,
  },
  teamLogoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginRight: 14,
    backgroundColor: "#0b0b0b",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { flex: 1 },
  teamName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  nationality: {
    fontSize: 14,
    color: "#999",
  },

  statsSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: "48%",
    minHeight: 96,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#e10600",
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: "#ccc",
    textTransform: "uppercase",
    marginTop: 6,
    fontWeight: "700",
    textAlign: "center",
  },

  carSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  carSurface: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#111",
    alignItems: "center",
  },
  carImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },

  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#e10600",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  driverCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  driverSurface: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
  },
  driverImageWrapper: {
    width: 80,
    height: 100,
    overflow: "hidden",
    borderRadius: 8,
  },
  driverImage: {
    width: "100%",
    height: "250%",
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  driverImagePlaceholder: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#0b0b0b",
    justifyContent: "center",
    alignItems: "center",
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  nationalityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#e10600",
    marginRight: 8,
  },
  driverNationality: {
    fontSize: 12,
    color: "#ccc",
  },

  openButton: {
    minWidth: 80,
  },
});

export default TeamDetailScreen;
