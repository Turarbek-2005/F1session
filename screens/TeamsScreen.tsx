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
import { fetchTeams, selectAllTeams, selectTeamsStatus } from "./teamsSlice";
import { fetchDrivers, selectAllDrivers } from "./driversSlice";
import { f1ApiService } from "./f1ApiService";
import { Surface } from "@react-native-material/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootState } from "./store";

const TeamCard = ({ team, drivers, driversApi, teamsApi, navigation }: any) => {
  const matchedTeam = teamsApi?.teams?.find(
    (teamApi: any) => teamApi.teamId === team.teamId
  );
  const teamDrivers = drivers.filter((d: any) => d.teamId === team.teamId);

  return (
    <Pressable
      onPress={() => navigation.navigate("TeamDetail", { teamId: team.id })}
      style={({ pressed }) => [
        styles.cardWrapper,
        pressed && { opacity: 0.92, transform: [{ scale: 0.997 }] },
      ]}
    >
      <Surface elevation={3} style={styles.card} pointerEvents="none">
        <View style={styles.cardHeader}>
          <Text style={styles.teamName}>
            {String(matchedTeam?.teamName ?? team.teamId)}
          </Text>

          {team.teamImgUrl ? (
            <View style={styles.teamLogoWrapper}>
              <Image
                source={{ uri: team.teamImgUrl }}
                style={styles.teamLogo}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.teamLogoWrapper}>
              <MaterialCommunityIcons name="shield" size={28} color="#333" />
            </View>
          )}
        </View>

        {team.bolidImgUrl && (
          <Image
            source={{ uri: team.bolidImgUrl }}
            style={styles.carImage}
            resizeMode="contain"
          />
        )}

        {teamDrivers.length > 0 && (
          <View style={styles.driversContainer}>
            <Text style={styles.driversLabel}>Drivers:</Text>
            {teamDrivers.map((driver: any) => {
              const matchedDriverApi = driversApi?.drivers?.find(
                (da: any) => da.driverId === driver.driverId
              );

              return (
                <Pressable
                  key={driver.id}
                  onPress={() =>
                    navigation.navigate("DriverDetail", { driverId: driver.id })
                  }
                  style={({ pressed }) => [
                    styles.driverRow,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  {driver.imgUrl ? (
                    <View style={styles.driverThumbWrapper}>
                      <Image
                        source={{ uri: driver.imgUrl }}
                        style={styles.driverThumbImage}
                      />
                    </View>
                  ) : (
                    <View style={styles.driverThumbWrapper}>
                      <MaterialCommunityIcons
                        name="account"
                        size={20}
                        color="#333"
                      />
                    </View>
                  )}
                  <Text style={styles.driverName}>
                    {matchedDriverApi
                      ? `${matchedDriverApi.name} ${matchedDriverApi.surname}`
                      : String(driver.driverId)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </Surface>
    </Pressable>
  );
};

const TeamsScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const teams = useAppSelector(selectAllTeams) || [];
  const drivers = useAppSelector(selectAllDrivers) || [];
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
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e10600" />
        <Text style={styles.loadingText}>Loading teams...</Text>
      </SafeAreaView>
    );
  }

  if (status === "failed") {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#e10600" />
        <Text style={styles.errorText}>Failed to load teams</Text>
        <Text style={styles.errorSubtext}>
          Make sure the API server is running
        </Text>
      </SafeAreaView>
    );
  }

  // support multiple favorite teams by favoriteTeamsIds or legacy favoriteTeamId
  const favoriteTeamsIds: string[] | undefined = (user as any)?.favoriteTeamsIds ||
    ((user as any)?.favoriteTeamId ? [(user as any).favoriteTeamId] : undefined);

  const favoriteTeams = Array.isArray(favoriteTeamsIds)
    ? teams.filter((t) => favoriteTeamsIds.includes(t.teamId))
    : [];

  const otherTeams = Array.isArray(favoriteTeamsIds)
    ? teams.filter((t) => !favoriteTeamsIds.includes(t.teamId))
    : teams;

  const sortedTeams = Array.isArray(otherTeams)
    ? [...otherTeams].sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0))
    : [];

  return (
    <ScrollView style={styles.screen}>
      {favoriteTeams.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Your Favorite Teams</Text>
          {favoriteTeams.map((ft) => (
            <TeamCard
              key={ft.id}
              team={ft}
              drivers={drivers}
              driversApi={driversApi}
              teamsApi={teamsApi}
              navigation={navigation}
            />
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>All Teams</Text>
      <FlatList
        data={sortedTeams}
        keyExtractor={(item) => String(item?.id ?? Math.random())}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TeamCard
            team={item}
            drivers={drivers}
            driversApi={driversApi}
            teamsApi={teamsApi}
            navigation={navigation}
          />
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    margin: 16,
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
    marginTop: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 40,
  },

  /* Card */
  cardWrapper: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#e10600",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
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
    color: "#fff",
    textTransform: "uppercase",
  },
  teamLogoWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  teamLogo: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  carImage: {
    width: "100%",
    height: 120,
    marginBottom: 12,
    borderRadius: 10,
  },

  driversContainer: {
    marginTop: 8,
  },
  driversLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ccc",
    marginBottom: 8,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  driverThumbWrapper: {
    width: 36,
    height: 44,
    borderRadius: 8,
    marginRight: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  driverThumbImage: {
    width: "100%",
    height: "250%",
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  driverName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },
});

export default TeamsScreen;
