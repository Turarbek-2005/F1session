import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useAppSelector, useAppDispatch } from "./hooks";
import { selectAllDrivers } from "./driversSlice";
import { selectAllTeams } from "./teamsSlice";
import { f1ApiService } from "./f1ApiService";
import { DriverDetailsResponse } from "./types";
import {
  AppBar,
  IconButton,
  Button,
  Surface,
} from "@react-native-material/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { updateUser } from "./authSlice";

const DriverDetailScreen = ({ route, navigation }: any) => {
  const { driverId } = route.params;
  const drivers = useAppSelector(selectAllDrivers);
  const teams = useAppSelector(selectAllTeams);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [driverDetails, setDriverDetails] =
    useState<DriverDetailsResponse | null>(null);
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
  const totalPoints =
    driverDetails?.results?.reduce(
      (sum, item) =>
        sum +
        item.result.pointsObtained +
        (item.sprintResult?.pointsObtained || 0),
      0
    ) || 0;
  const wins =
    driverDetails?.results?.filter(
      (item) => item.result.finishingPosition === 1
    ).length || 0;
  const podiums =
    driverDetails?.results?.filter(
      (item) =>
        typeof item.result.finishingPosition === "number" &&
        item.result.finishingPosition <= 3
    ).length || 0;

  return (
    <View style={styles.screen}>
      {/* Top AppBar */}
      

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header with image + basic info */}
        <Surface elevation={2} style={styles.headerSurface}>
          <View style={styles.header}>
            {driver.imgUrl && (
              <View style={styles.driverImageWrapper}>
                <Image
                  source={{ uri: driver.imgUrl }}
                  style={styles.driverImage}
                />
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
        </Surface>

        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Button
            title={(user?.favoriteDriversIds?.includes(String(driver.id)) || user?.favoriteDriversIds?.includes(driver.driverId)) ? "Remove favorite" : "Add favorite"}
            color={(user?.favoriteDriversIds?.includes(String(driver.id)) || user?.favoriteDriversIds?.includes(driver.driverId)) ? "#999" : "#e10600"}
            onPress={() => {
              const current = user?.favoriteDriversIds || [];
              const isFav = current.includes(driver.driverId) || current.includes(String(driver.id));
              const updated = isFav ? current.filter((id) => id !== driver.driverId && id !== String(driver.id)) : [...current, driver.driverId];
              dispatch(updateUser({ favoriteDriversIds: updated }));
            }}
            style={{ alignSelf: "flex-start", marginBottom: 8 }}
          />
        </View>

        {/* Stats section */}
        {driverDetails && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>
              Season {driverDetails.season} Statistics
            </Text>

            <View style={styles.statsGrid}>
              <Surface elevation={3} style={styles.statCard}>
                <MaterialCommunityIcons name="star" size={28} color="#e10600" />
                <Text style={styles.statValue}>{totalPoints}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </Surface>

              <Surface elevation={3} style={styles.statCard}>
                <MaterialCommunityIcons
                  name="trophy"
                  size={28}
                  color="#e10600"
                />
                <Text style={styles.statValue}>{wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </Surface>

              <Surface elevation={3} style={styles.statCard}>
                <MaterialCommunityIcons
                  name="podium"
                  size={28}
                  color="#e10600"
                />
                <Text style={styles.statValue}>{podiums}</Text>
                <Text style={styles.statLabel}>Podiums</Text>
              </Surface>

              <Surface elevation={3} style={styles.statCard}>
                <MaterialCommunityIcons
                  name="speedometer"
                  size={28}
                  color="#e10600"
                />
                <Text style={styles.statValue}>
                  {driverDetails.results.length}
                </Text>
                <Text style={styles.statLabel}>Races</Text>
              </Surface>
            </View>
          </View>
        )}

        {/* Team card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team</Text>
          <Pressable
            onPress={() => team && navigation.navigate("TeamDetail", { teamId: team.id })}
            style={({ pressed }) => [
              styles.teamWrapper,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Surface elevation={3} style={styles.teamCard}>
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
                    <Text style={styles.teamDetail}>
                      🏆 Constructors: {apiTeam.constructorsChampionships}
                    </Text>
                    <Text style={styles.teamDetail}>
                      🏁 Drivers: {apiTeam.driversChampionships}
                    </Text>
                    <Text style={styles.teamDetail}>
                      📅 Since: {apiTeam.firstAppeareance}
                    </Text>
                    <Button
                      title="Open Team"
                      color="#e10600"
                      onPress={() =>
                        team &&
                        navigation.navigate("TeamDetail", { teamId: team.id })
                      }
                      style={{ alignSelf: "flex-start", marginTop: 8 }}
                    />
                  </>
                )}
              </View>
            </Surface>
          </Pressable>

          {team?.bolidImgUrl && (
            <Surface elevation={2} style={styles.carSurface}>
              <Image
                source={{ uri: team.bolidImgUrl }}
                style={styles.carImage}
                resizeMode="contain"
              />
            </Surface>
          )}
        </View>

        {/* Recent Results */}
        {driverDetails?.results && driverDetails.results.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Results</Text>
            {driverDetails.results
              .slice(-5)
              .reverse()
              .map((item, index) => (
                <Surface key={index} elevation={2} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.raceName}>{item.race.name}</Text>
                    <Text style={styles.raceDate}>
                      {new Date(item.race.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.resultDetails}>
                    <View style={styles.positionBadge}>
                      <Text style={styles.positionText}>
                        P{item.result.finishingPosition}
                      </Text>
                    </View>
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultText}>
                        Grid: P{item.result.gridPosition}
                      </Text>
                      <Text style={styles.resultText}>
                        Points: {item.result.pointsObtained}
                      </Text>
                      {item.sprintResult && (
                        <Text style={styles.sprintText}>
                          Sprint: P{item.sprintResult.finishingPosition} (
                          {item.sprintResult.pointsObtained} pts)
                        </Text>
                      )}
                    </View>
                  </View>
                </Surface>
              ))}
          </View>
        )}
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

  /* Header */
  headerSurface: {
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    padding: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverImageWrapper: {
    width: 120,
    height: 200,
    overflow: "hidden",
    marginBottom: 16,
    marginRight: 12,
  },
  driverImage: {
    width: "100%",
    height: "250%",
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  headerInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  driverName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  driverNumber: {
    fontSize: 30,
    fontWeight: "700",
    color: "#e10600",
    marginBottom: 8,
  },
  nationalityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  flagImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#e10600",
  },
  nationality: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "600",
    marginLeft: 8,
  },
  birthday: {
    fontSize: 13,
    color: "#999",
    marginTop: 8,
  },

  /* Stats */
  statsSection: {
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
    minHeight: 100,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  statValue: {
    fontSize: 28,
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
  },

  /* Sections */
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

  /* Team */
  teamWrapper: {
    borderRadius: 12,
  },
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  teamLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  teamDetail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  carSurface: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#111",
    padding: 10,
    alignItems: "center",
  },
  carImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
  },

  /* Results */
  resultCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#1a1a1a",
  },
  resultHeader: {
    marginBottom: 8,
  },
  raceName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  raceDate: {
    fontSize: 12,
    color: "#999",
  },
  resultDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },
  resultInfo: {
    flex: 1,
  },
  resultText: {
    fontSize: 13,
    color: "#ccc",
    marginBottom: 4,
  },
  sprintText: {
    fontSize: 12,
    color: "#e10600",
    marginTop: 4,
    fontWeight: "600",
  },
});

export default DriverDetailScreen;
