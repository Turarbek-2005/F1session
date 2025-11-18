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
import { selectAllDrivers } from "./driversSlice";
import { selectAllTeams } from "./teamsSlice";
import { f1ApiService } from "./f1ApiService";
import { DriverDetailsResponse } from "./types";

const DriverDetailScreen = ({ route, navigation }: any) => {
  const { driverId } = route.params;
  const drivers = useAppSelector(selectAllDrivers);
  const teams = useAppSelector(selectAllTeams);
  const [driverDetails, setDriverDetails] = useState<DriverDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const driver = drivers.find((d) => d.id === driverId);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        if (driver?.driverId) {
          const details = await f1ApiService.getDriverDetails(driver.driverId);
          setDriverDetails(details);
        }
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (driver) {
      fetchApiData();
    }
  }, [driver]);

  if (loading || !driver) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e10600" />
      </View>
    );
  }

  const team = teams.find((t) => t.teamId === driver.teamId);
  const apiDriver = driverDetails?.driver;
  const apiTeam = driverDetails?.team;
  const totalPoints = driverDetails?.results?.reduce(
    (sum, item) => sum + item.result.pointsObtained + (item.sprintResult?.pointsObtained || 0),
    0
  ) || 0;
  const wins = driverDetails?.results?.filter((item) => item.result.finishingPosition === 1).length || 0;
  const podiums = driverDetails?.results?.filter(
    (item) => typeof item.result.finishingPosition === 'number' && item.result.finishingPosition <= 3
  ).length || 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {driver.imgUrl && (
          <View style={styles.driverImageWrapper}>
            <Image source={{ uri: driver.imgUrl }} style={styles.driverImage} />
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.driverName}>
            {apiDriver
              ? `${apiDriver.name} ${apiDriver.surname}`
              : driver.driverId}
          </Text>
          {apiDriver?.number && (
            <Text style={styles.driverNumber}>#{apiDriver.number}</Text>
          )}
          {driver.nationalityImgUrl && (
            <View style={styles.nationalityContainer}>
              <Image
                source={{ uri: driver.nationalityImgUrl }}
                style={styles.flagImage}
              />
              <Text style={styles.nationality}>
                {apiDriver?.nationality || driver.nationality}
              </Text>
            </View>
          )}
          {apiDriver?.birthday && (
            <Text style={styles.birthday}>
              Born: {new Date(apiDriver.birthday).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>

      {driverDetails && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Season {driverDetails.season} Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{wins}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{podiums}</Text>
              <Text style={styles.statLabel}>Podiums</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{driverDetails.results.length}</Text>
              <Text style={styles.statLabel}>Races</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team</Text>
        <TouchableOpacity
          style={styles.teamCard}
          onPress={() => team && navigation.navigate("TeamDetail", { teamId: team.id })}
        >
          {team?.teamImgUrl && (
            <Image
              source={{ uri: team.teamImgUrl }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          )}
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>
              {apiTeam?.teamName || driver.teamId}
            </Text>
            {apiTeam && (
              <>
                <Text style={styles.teamDetail}>🏆 Constructors: {apiTeam.constructorsChampionships}</Text>
                <Text style={styles.teamDetail}>🏁 Drivers: {apiTeam.driversChampionships}</Text>
                <Text style={styles.teamDetail}>📅 Since: {apiTeam.firstAppeareance}</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
        {team?.bolidImgUrl && (
          <Image
            source={{ uri: team.bolidImgUrl }}
            style={styles.carImage}
            resizeMode="contain"
          />
        )}
      </View>

      {driverDetails?.results && driverDetails.results.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Results</Text>
          {driverDetails.results.slice(-5).reverse().map((item, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.raceName}>{item.race.name}</Text>
                <Text style={styles.raceDate}>
                  {new Date(item.race.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.resultDetails}>
                <View style={styles.positionBadge}>
                  <Text style={styles.positionText}>P{item.result.finishingPosition}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultText}>Grid: P{item.result.gridPosition}</Text>
                  <Text style={styles.resultText}>Points: {item.result.pointsObtained}</Text>
                  {item.sprintResult && (
                    <Text style={styles.sprintText}>
                      Sprint: P{item.sprintResult.finishingPosition} ({item.sprintResult.pointsObtained} pts)
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
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
    padding: 20,
    alignItems: "center",
  },
  driverImageWrapper: {
    width: 200,
    height: 260,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: 16,
  },
  driverImage: {
    width: "100%",
    height: "250%",
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  headerInfo: {
    alignItems: "center",
  },
  driverName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 8,
  },
  driverNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: "#e10600",
    marginBottom: 12,
  },
  nationalityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flagImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e10600",
  },
  nationality: {
    fontSize: 16,
    color: "#ccc",
    fontWeight: "600",
  },
  birthday: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  statsSection: {
    padding: 20,
    backgroundColor: "#1a1a1a",
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
    fontSize: 14,
    color: "#ccc",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e10600",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  teamCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  teamDetail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  carImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  resultCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#e10600",
  },
  resultHeader: {
    marginBottom: 12,
  },
  raceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  raceDate: {
    fontSize: 12,
    color: "#999",
  },
  resultDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  positionBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e10600",
    justifyContent: "center",
    alignItems: "center",
  },
  positionText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
  },
  resultInfo: {
    flex: 1,
  },
  resultText: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 2,
  },
  sprintText: {
    fontSize: 12,
    color: "#e10600",
    marginTop: 4,
    fontWeight: "600",
  },
});

export default DriverDetailScreen;
