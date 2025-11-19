import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAppSelector } from "./hooks";
import { selectAllTeams } from "./teamsSlice";
import { selectAllDrivers } from "./driversSlice";
import { f1ApiService } from "./f1ApiService";
import { TeamDetailsResponse } from "./types";

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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e10600" />
      </View>
    );
  }

  const teamDrivers = drivers.filter((d) => d.teamId === team.teamId);
  const apiTeam = teamDetails?.team?.[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {team.teamImgUrl && (
          <Image
            source={{ uri: team.teamImgUrl }}
            style={styles.teamLogo}
            resizeMode="contain"
          />
        )}
        <Text style={styles.teamName}>
          {apiTeam?.teamName || team.teamId}
        </Text>
        {apiTeam?.teamNationality && (
          <Text style={styles.nationality}>{apiTeam.teamNationality}</Text>
        )}
      </View>

      {apiTeam && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Team Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{apiTeam.constructorsChampionships}</Text>
              <Text style={styles.statLabel}>Constructor Titles</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{apiTeam.driversChampionships}</Text>
              <Text style={styles.statLabel}>Driver Titles</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{apiTeam.firstAppeareance}</Text>
              <Text style={styles.statLabel}>First Season</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {new Date().getFullYear() - apiTeam.firstAppeareance}
              </Text>
              <Text style={styles.statLabel}>Years in F1</Text>
            </View>
          </View>
        </View>
      )}

      {team.bolidImgUrl && (
        <View style={styles.carSection}>
          <Text style={styles.sectionTitle}>2025 Car</Text>
          <Image
            source={{ uri: team.bolidImgUrl }}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Drivers ({teamDrivers.length})</Text>
        {teamDrivers.map((driver) => {
          return (
            <TouchableOpacity
              key={driver.id}
              style={styles.driverCard}
              onPress={() => navigation.navigate("DriverDetail", { driverId: driver.id })}
            >
              {driver.imgUrl && (
                <View style={styles.driverImageWrapper}>
                  <Image
                    source={{ uri: driver.imgUrl }}
                    style={styles.driverImage}
                  />
                </View>
              )}
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.driverId}</Text>
                {driver.nationalityImgUrl && (
                  <View style={styles.nationalityContainer}>
                    <Image
                      source={{ uri: driver.nationalityImgUrl }}
                      style={styles.flagImage}
                    />
                    <Text style={styles.driverNationality}>
                      {driver.nationality}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
  },
  header: {
    backgroundColor: "#1a1a1a",
    padding: 30,
    alignItems: "center",
  },
  teamLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  teamName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 8,
  },
  nationality: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  statsSection: {
    padding: 20,
    backgroundColor: "#1a1a1a",
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#0d0d0d",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e10600",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#e10600",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#ccc",
    textTransform: "uppercase",
    fontWeight: "600",
    textAlign: "center",
  },
  carSection: {
    padding: 20,
    backgroundColor: "#1a1a1a",
    marginTop: 2,
  },
  carImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 12,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e10600",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  driverCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  driverNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e10600",
    marginBottom: 8,
  },
  nationalityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flagImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e10600",
  },
  driverNationality: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "600",
  },
});

export default TeamDetailScreen;
