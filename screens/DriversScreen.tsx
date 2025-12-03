import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  fetchDrivers,
  selectAllDrivers,
  selectDriversStatus,
} from "./driversSlice";
import { f1ApiService } from "./f1ApiService";
import { Surface } from "@react-native-material/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootState } from "./store";

const DriverCard = ({ driver, driversApi, teamsApi, navigation }: any) => {
  const matchedDriver = driversApi?.drivers?.find(
    (driverApi: any) => driverApi?.driverId === driver?.driverId
  );
  const matchedTeam = teamsApi?.teams?.find(
    (teamApi: any) => teamApi?.teamId === driver?.teamId
  );

  const displayDriverId = matchedDriver
    ? `${String(matchedDriver.name ?? "")} ${String(
        matchedDriver.surname ?? ""
      )}`.trim()
    : String(driver?.driverId ?? "");

  const displayDriverNumber =
    matchedDriver?.number !== undefined && matchedDriver?.number !== null
      ? String(matchedDriver.number)
      : null;

  const nationalityUri = driver?.nationalityImgUrl;
  const driverImgUri = driver?.imgUrl;
  const teamDisplay = matchedTeam?.teamName
    ? String(matchedTeam.teamName)
    : String(driver?.teamId ?? "");

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("DriverDetail", { driverId: driver.id })
      }
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.92, transform: [{ scale: 0.995 }] },
      ]}
    >
      <Surface elevation={3} style={styles.cardSurface}>
        <View style={styles.cardHeader}>
          <View style={styles.driverNameWrapper}>
            <Text
              style={styles.driverId}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayDriverId}
            </Text>

            {displayDriverNumber && (
              <Text
                style={styles.driverNumber}
              >{`#${displayDriverNumber}`}</Text>
            )}
          </View>

          {nationalityUri ? (
            <Image source={{ uri: nationalityUri }} style={styles.flagIcon} />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}
        </View>

        {driverImgUri ? (
          <View style={styles.driverImageWrapper}>
            <Image
              source={{ uri: driverImgUri }}
              style={styles.driverImage}
            />
          </View>
        ) : (
          <View style={styles.driverImagePlaceholder}>
            <MaterialCommunityIcons name="account" size={52} color="#333" />
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.teamId} numberOfLines={1}>
            {teamDisplay}
          </Text>
        </View>
      </Surface>
    </Pressable>
  );
};

const DriversScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const drivers = useAppSelector(selectAllDrivers) || [];
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
        setDriversApi(driversData ?? { drivers: [] });
        setTeamsApi(teamsData ?? { teams: [] });
      } catch (error) {
        console.error("Failed to fetch F1 API data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, [dispatch, user]);

  if (status === "loading" || loading) {
    return (
      <SafeAreaView style={styles.screenCenter}>
        <ActivityIndicator size="large" color="#e10600" />
        <Text style={styles.loadingText}>Loading drivers...</Text>
      </SafeAreaView>
    );
  }

  if (status === "failed") {
    return (
      <SafeAreaView style={styles.screenCenter}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#e10600" />
        <Text style={styles.errorText}>Failed to load drivers</Text>
        <Text style={styles.errorSubtext}>
          Make sure the API server is running
        </Text>
      </SafeAreaView>
    );
  }

  const favoriteDriver = user?.favoriteDriverId
    ? drivers.find((d) => d.driverId === user.favoriteDriverId)
    : undefined;

  const otherDrivers = user?.favoriteDriverId
    ? drivers.filter((d) => d.driverId !== user.favoriteDriverId)
    : drivers;

  const sortedDrivers = Array.isArray(otherDrivers)
    ? [...otherDrivers].sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0))
    : [];

  return (
    <ScrollView style={styles.container}>
      {favoriteDriver && (
        <View>
          <Text style={styles.sectionTitle}>Your Favorite Driver</Text>
          <View style={styles.favoriteDriverContainer}>
            <DriverCard
              driver={favoriteDriver}
              driversApi={driversApi}
              teamsApi={teamsApi}
              navigation={navigation}
            />
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>All Drivers</Text>
      <FlatList
        data={sortedDrivers}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <DriverCard
            driver={item}
            driversApi={driversApi}
            teamsApi={teamsApi}
            navigation={navigation}
          />
        )}
        scrollEnabled={false} // To prevent nested scroll views
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    margin: 16,
  },
  favoriteDriverContainer: {
    paddingHorizontal: 10,
  },
  screenCenter: {
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
    marginTop: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 6,
    maxWidth: "100%",
  },
  cardSurface: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 12,
    minHeight: 220,
    alignItems: "center",
  },
  cardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  driverNameWrapper: {
    flexShrink: 1,
    paddingRight: 8,
  },
  driverId: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
  },
  driverNumber: {
    fontSize: 18,
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
  flagPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
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
  driverImagePlaceholder: {
    width: 140,
    height: 160,
    borderRadius: 8,
    backgroundColor: "#0b0b0b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardFooter: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#262626",
    paddingTop: 8,
    alignItems: "center",
  },
  teamId: {
    fontSize: 13,
    color: "#ccc",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});

export default DriversScreen;
