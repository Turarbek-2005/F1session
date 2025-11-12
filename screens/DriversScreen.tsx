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
                  {matchedDriver ? (
                    <Text
                      style={styles.driverId}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {matchedDriver.name} {matchedDriver.surname}
                    </Text>
                  ) : (
                    <Text
                      style={styles.driverId}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.driverId}
                    </Text>
                  )}
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

              {item.imgUrl && (
                <View style={styles.driverImageWrapper}>
                  <Image
                    source={{ uri: item.imgUrl }}
                    style={styles.driverImage}
                  />
                </View>
              )}

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
    padding: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    margin: 5,
    padding: 12,
    maxWidth: "48%",
    minHeight: 200,
    position: "relative", // для абсолютного позиционирования внутри
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  driverNameWrapper: {
    flexShrink: 1, // позволяет тексту сжиматься, не выталкивая флаг
    marginRight: 8, // отступ между текстом и флагом
  },
  driverId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    textTransform: "uppercase",
  },
  driverNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
  },
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  driverImageWrapper: {
    width: 120,
    height: 160, // высота блока, который будет видим
    overflow: "hidden",
    borderRadius: 8,
    position: "relative",
    marginBottom: 8,
  },
  driverImage: {
    width: "100%",
    height: "250%", // увеличиваем, чтобы отображалась только верхняя часть (~40%)
    position: "absolute",
    top: 0, // верхняя часть картинки
    resizeMode: "cover", // object-cover аналог
  },

  cardFooter: {
    marginTop: "auto",
  },
  teamId: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});

export default DriversScreen;
