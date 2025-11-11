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
import { fetchTeams, selectAllTeams, selectTeamsStatus } from "./teamsSlice";
import { fetchDrivers, selectAllDrivers } from "./driversSlice";
import { f1ApiService } from "./f1ApiService";

const TeamsScreen = () => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectAllTeams);
  const drivers = useAppSelector(selectAllDrivers);
  const status = useAppSelector(selectTeamsStatus);

  const [driversApi, setDriversApi] = useState<any>({ drivers: [] });
  const [teamsApi, setTeamsApi] = useState<any>({ teams: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchTeams());
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
        <Text style={styles.loadingText}>Loading teams...</Text>
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load teams</Text>
        <Text style={styles.errorSubtext}>
          Make sure the API server is running
        </Text>
      </View>
    );
  }

  const sortedTeams = [...teams].sort((a, b) => a.id - b.id);

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTeams}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const matchedTeam = teamsApi?.teams?.find(
            (teamApi: any) => teamApi.teamId === item.teamId
          );
          const teamDrivers = drivers.filter((d) => d.teamId === item.teamId);

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.teamName}>
                  {matchedTeam?.teamName ?? item.teamId}
                </Text>

                {item.teamImgUrl && (
                  <View style={styles.teamLogoWrapper}>
                    <Image
                      source={{ uri: item.teamImgUrl }}
                      style={styles.teamLogo}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>

              {item.bolidImgUrl && (
                <Image
                  source={{ uri: item.bolidImgUrl }}
                  style={styles.carImage}
                  resizeMode="contain"
                />
              )}

              {teamDrivers.length > 0 && (
                <View style={styles.driversContainer}>
                  <Text style={styles.driversLabel}>Drivers:</Text>
                  {teamDrivers.map((driver) => {
                    const matchedDriverApi = driversApi?.drivers?.find(
                      (da: any) => da.driverId === driver.driverId
                    );

                    return (
                      <View key={driver.id} style={styles.driverRow}>
                        {driver.imgUrl && (
                          <View style={styles.driverThumbWrapper}>
                            <Image
                              source={{ uri: driver.imgUrl }}
                              style={styles.driverThumbImage}
                            />
                          </View>
                        )}
                        <Text style={styles.driverName}>
                          {matchedDriverApi
                            ? `${matchedDriverApi.name} ${matchedDriverApi.surname}`
                            : driver.driverId}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
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
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: "#e10600",
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textTransform: "uppercase",
  },
  teamLogoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 25, // делаем круг
    backgroundColor: "#666", // можно любой цвет или динамически под команду
    justifyContent: "center",
    alignItems: "center",
  },
  teamLogo: {
    width: 30,
    height: 30,
    borderRadius: 15, // чтобы иконка тоже была слегка округлой
  },
  carImage: {
    width: "100%",
    height: 120,
    marginBottom: 12,
  },
  driversContainer: {
    marginTop: 8,
  },
  driversLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  driverThumbWrapper: {
    width: 30,
    height: 40,
    borderRadius: 16,
    marginRight: 8,
    overflow: "hidden",
    position: "relative",
  },
  driverThumbImage: {
    width: "100%",
    height: "250%", // показываем только верхнюю часть (~40%)
    position: "absolute",
    top: 0, // верхняя часть видна
    resizeMode: "cover",
  },

  driverName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    textTransform: "uppercase",
  },
});

export default TeamsScreen;
