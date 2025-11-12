import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  fetchDrivers,
  selectAllDrivers,
  selectDriversStatus,
} from "./driversSlice";
import { f1ApiService } from "./f1ApiService";

const DriversScreen = () => {
  const dispatch = useAppDispatch();
  const drivers = useAppSelector(selectAllDrivers);
  const status = useAppSelector(selectDriversStatus);

  const [driversApi, setDriversApi] = useState<any>({ drivers: [] });
  const [teamsApi, setTeamsApi] = useState<any>({ teams: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchDrivers());

    const fetchApiData = async () => {
      try {
        const [driversData, teamsData] = await Promise.all([
          f1ApiService.getDrivers(),
          f1ApiService.getTeams(),
        ]);
        setDriversApi(driversData);
        setTeamsApi(teamsData);
      } catch (error) {
        console.error("Failed to fetch F1 API data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, [dispatch]);

  if (status === "loading" || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e10600" />
        <Text style={styles.loadingText}>Loading drivers...</Text>
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load drivers</Text>
        <Text style={styles.errorSubtext}>
          Make sure the API server is running
        </Text>
      </View>
    );
  }

  const sortedDrivers = [...drivers].sort((a, b) => a.id - b.id);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>F1 DRIVERS</Text>
      <FlatList
        data={sortedDrivers}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const matchedDriver = driversApi?.drivers?.find(
            (driverApi: any) => driverApi.driverId === item.driverId
          );
          const matchedTeam = teamsApi?.teams?.find(
            (teamApi: any) => teamApi.teamId === item.teamId
          );

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.driverNameWrapper}>
                  <Text style={styles.driverId}>
                    {matchedDriver
                      ? `${matchedDriver.name} ${matchedDriver.surname}`
                      : item.driverId}
                  </Text>
                  {matchedDriver?.number && (
                    <Text style={styles.driverNumber}>
                      {matchedDriver.number}
                    </Text>
                  )}
                </View>
                <Image
                  source={{ uri: item.nationalityImgUrl }}
                  style={styles.flagIcon}
                />
              </View>

              {item.imgUrl && (<View style={styles.driverImageWrapper}> <Image source={{ uri: item.imgUrl }} style={styles.driverImage} /> </View>)}

              <View style={styles.cardFooter}>
                <Text style={styles.teamId}>
                  {matchedTeam?.teamName ?? item.teamId}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d", // тёмный фон
    paddingTop: 50,
  },
  header: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 3,
    marginBottom: 10,
    textShadowColor: "#e10600",
    textShadowRadius: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#ccc",
  },
  errorText: {
    fontSize: 18,
    color: "#e10600",
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#888",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    margin: 6,
    padding: 14,
    maxWidth: "48%",
    minHeight: 220,
    shadowColor: "#e10600",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  driverNameWrapper: {
    flexShrink: 1,
  },
  driverId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  driverNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e10600",
    marginTop: 2,
  },
  flagIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e10600",
  },
  driverImageWrapper: { width: 140, height: 180, overflow: "hidden", borderRadius: 8, position: "relative", marginBottom: 8, }, driverImage: { width: "100%", height: "250%", position: "absolute", top: 0, resizeMode: "cover", },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    paddingTop: 8,
  },
  teamId: {
    fontSize: 13,
    color: "#ccc",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});

export default DriversScreen;
