import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchDrivers, selectAllDrivers } from "./driversSlice";
import { f1ApiService } from "./f1ApiService";

export default function RacesScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const drivers = useAppSelector(selectAllDrivers) || [];

  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [races, setRaces] = useState<any>({ races: [] });
  const [racesLast, setRacesLast] = useState<any>(null);
  const [racesNext, setRacesNext] = useState<any>(null);
  const years = ["2025", "2024", "2023", "2022", "2021", "2020"];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        let r: any = {};
        try {
          r = f1ApiService.getRacesYear
            ? await f1ApiService.getRacesYear(year)
            : {};
        } catch (err: any) {
          // if specific year not found fall back to current
          if (err?.response?.status === 404 && f1ApiService.getRaces) {
            r = await f1ApiService.getRaces();
          } else {
            throw err;
          }
        }

        const [last, next] = await Promise.all([
          f1ApiService.getRacesLast ? f1ApiService.getRacesLast() : {},
          f1ApiService.getRacesNext ? f1ApiService.getRacesNext() : {},
        ]);

        setRaces(r ?? { races: [] });
        setRacesLast(last ?? null);
        setRacesNext(next ?? null);
      } catch (err) {
        console.error("Failed to load races:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [year]);

  function formatRaceDates(start: string, end: string) {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const startDay = startDate.getDate();
      const endDay = endDate.getDate();
      const month = months[endDate.getMonth()];
      if (startDate.getMonth() !== endDate.getMonth()) {
        const startMonth = months[startDate.getMonth()];
        return `${startDay} ${startMonth} – ${endDay} ${month}`;
      }
      return `${startDay} – ${endDay} ${month}`;
    } catch (e) {
      return "";
    }
  }

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#e10600" />
        <Text style={styles.loadingText}>Loading races...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          {year} FIA FORMULA ONE RACE CALENDAR
        </Text>
      </View>

      <View style={styles.yearSelector}>
        {years.map((y) => (
          <Pressable
            key={y}
            onPress={() => setYear(y)}
            style={[
              styles.yearButton,
              year === y ? styles.yearButtonActive : null,
            ]}
          >
            <Text
              style={[
                styles.yearButtonText,
                year === y ? styles.yearButtonTextActive : null,
              ]}
            >
              {y}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.cardsContainer}>
        {racesLast && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last Race</Text>
            <Text style={styles.cardSub}>Round {racesLast?.round}</Text>
            <Text
              style={styles.cardMain}
            >{`${racesLast?.race[0].circuit.country} ${racesLast?.race[0].circuit.city}`}</Text>
            <Text style={styles.cardDate}>
              {formatRaceDates(
                racesLast?.race[0].schedule.fp1.date,
                racesLast?.race[0].schedule.race.date
              )}
            </Text>
          </View>
        )}

        {racesNext && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Next Race</Text>
            <Text style={styles.cardSub}>Round {racesNext?.round}</Text>
            <Text
              style={styles.cardMain}
            >{`${racesNext?.race[0].circuit.country} ${racesNext?.race[0].circuit.city}`}</Text>
            <Text style={styles.cardDate}>
              {formatRaceDates(
                racesNext?.race[0].schedule.fp1.date,
                racesNext?.race[0].schedule.race.date
              )}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.listContainer}>
        {races?.races?.map((race: any) => (
          <View key={race?.raceId} style={styles.raceRow}>
            <Pressable style={styles.raceLeft} onPress={() => navigation.navigate('Results', { year: year, round: race?.round?.toString(), session: 'race', date: race?.schedule?.race?.date })}>
              <Text style={styles.raceRound}>Round {race?.round}</Text>
              <Text style={styles.raceName}>
                {race?.circuit.country}{" "}
                {race?.circuit.city == race?.circuit.country
                  ? ""
                  : race?.circuit.city}
              </Text>
              <Text style={styles.raceSmall}>{race?.raceName}</Text>
            </Pressable>
            <View style={styles.raceRight}>
              {race?.winner ? (
                (() => {
                  const winner = drivers?.find(
                    (d: any) => d.driverId === race?.winner?.driverId
                  );
                  return winner ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("DriverDetail", {
                          driverId: winner?.id,
                        })
                      }
                    >
                      <View style={styles.winnerRow}>
                        {winner?.imgUrl ? (
                          <View style={styles.winnerImageWrapper}>
                            <Image
                              source={{ uri: winner.imgUrl }}
                              style={styles.winnerImageInner}
                              resizeMode="cover"
                            />
                          </View>
                        ) : null}
                        <Text style={styles.winner}>
                          Winner: {race?.winner?.name} {race?.winner?.surname}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.winner}>Winner</Text>
                  );
                })()
              ) : (
                <Text style={styles.raceDate}>
                  {formatRaceDates(
                    race?.schedule.fp1.date,
                    race?.schedule.race.date
                  )}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0d0d0d" },
  container: { padding: 16, paddingBottom: 40 },
  center: { justifyContent: "center", alignItems: "center", height: "100%" },
  loadingText: { color: "#ccc", marginTop: 8 },
  headerRow: { marginBottom: 12 },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cardsContainer: { flexDirection: "row", gap: 8, marginVertical: 12 },
  card: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
  },
  yearSelector: { flexDirection: "row", marginVertical: 8, flexWrap: "wrap" },
  yearButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#111",
    marginRight: 8,
    marginBottom: 8,
  },
  yearButtonActive: { backgroundColor: "#e10600" },
  yearButtonText: { color: "#fff" },
  yearButtonTextActive: { color: "#fff", fontWeight: "700" },
  cardTitle: { color: "#fff", fontWeight: "700" },
  cardSub: { color: "#aaa", marginTop: 6 },
  cardMain: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 6 },
  cardDate: { color: "#ccc", marginTop: 8 },
  listContainer: { marginTop: 6 },
  raceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  raceLeft: { flex: 1 },
  raceRight: { width: 140, alignItems: "flex-end" },
  raceRound: { color: "#fff", fontWeight: "700" },
  raceName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  raceSmall: { color: "#ccc", marginTop: 6 },
  raceDate: { color: "#ccc" },
  winnerRow: { flexDirection: "row", alignItems: "center" },
  winnerImageWrapper: { width: 36, height: 36, borderRadius: 12, marginRight: 8, overflow: 'hidden' },
  winnerImageInner: { width: 50, height: 150, resizeMode: "cover",   position: "absolute",
  top: 0,    left: -13},
  winner: { color: "#86efac", fontWeight: "700" },
});
