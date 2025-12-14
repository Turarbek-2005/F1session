import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  fetchRacesYear,
  fetchYearRoundSession,
  selectRacesYear,
  selectSessionData,
  selectResultsStatus,
  selectResultsSessionStatus,
} from "./resultsSlice";

export default function ResultsScreen({ route }: any) {
  const dispatch = useAppDispatch();
  const racesYear = useAppSelector(selectRacesYear);
  const sessionData = useAppSelector(selectSessionData);
  const status = useAppSelector(selectResultsStatus);
  const sessionStatus = useAppSelector(selectResultsSessionStatus);

  const routeParams = route?.params ?? {};
  const years = ["2025", "2024", "2023", "2022", "2021", "2020"];
  const [year, setYear] = useState<string>(routeParams.year ?? new Date().getFullYear().toString());
  const [round, setRound] = useState<string | null>(routeParams.round ?? null);
  const [session, setSession] = useState<string>(routeParams.session ?? "race");
  const selectedDate = routeParams.date ? new Date(routeParams.date) : null;

  useEffect(() => {
    dispatch(fetchRacesYear(year));
  }, [dispatch, year]);

  useEffect(() => {
    if (year && round && session) {
      dispatch(fetchYearRoundSession({ year, round, session }));
    }
  }, [dispatch, year, round, session]);

  const rounds = racesYear?.races ?? [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Results</Text>
      {selectedDate ? <Text style={styles.date}>{selectedDate.toLocaleDateString()}</Text> : null}

      <View style={styles.row}>
        {years.map((y) => (
          <Pressable
            key={y}
            onPress={() => setYear(y)}
            style={[styles.btn, year === y ? styles.btnActive : null]}
          >
            <Text style={[styles.btnText, year === y ? styles.btnTextActive : null]}>{y}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Round</Text>
      <View style={[styles.row, { flexWrap: "wrap" }]}>
        {status === "loading" ? (
          <ActivityIndicator color="#e10600" />
        ) : (
          rounds.map((r: any) => (
            <Pressable
              key={r?.round}
              onPress={() => setRound(r?.round?.toString())}
              style={[styles.btn, round?.toString() === r?.round?.toString() ? styles.btnActive : null]}
            >
              <Text style={[styles.btnText, round?.toString() === r?.round?.toString() ? styles.btnTextActive : null]}>{r?.circuit?.country}</Text>
            </Pressable>
          ))
        )}
      </View>

      <Text style={styles.sectionTitle}>Session</Text>
      <View style={[styles.row, { flexWrap: "wrap" }]}>
        {[
          { key: "fp1", label: "FP1" },
          { key: "fp2", label: "FP2" },
          { key: "fp3", label: "FP3" },
          { key: "qualyfying", label: "Qualy" },
          { key: "sprintQualyfying", label: "Sprint Qualy" },
          { key: "sprintRace", label: "Sprint" },
          { key: "race", label: "Race" },
        ].map((s) => (
          <Pressable
            key={s.key}
            onPress={() => setSession(s.key)}
            style={[styles.btn, session === s.key ? styles.btnActive : null]}
          >
            <Text style={[styles.btnText, session === s.key ? styles.btnTextActive : null]}>{s.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Results</Text>
      {sessionStatus === "loading" ? (
        <ActivityIndicator color="#e10600" />
      ) : (
        (() => {
          const results =
            sessionData?.races?.results ??
            sessionData?.races?.fp1Results ??
            sessionData?.races?.fp2Results ??
            sessionData?.races?.fp3Results ??
            sessionData?.races?.qualyResults ??
            sessionData?.races?.sprintRaceResults ??
            sessionData?.races?.sprintQualyResults ??
            null;

          if (!results || results.length === 0) {
            return <Text style={styles.note}>Select round and session to load results</Text>;
          }

          return results.map((res: any, idx: number) => (
            <View key={res.driver?.driverId ?? res.fp1Id ?? idx} style={styles.resultRow}>
              <Text style={styles.pos}>{res.position ?? res.gridPosition ?? idx + 1}</Text>
              <View style={styles.resultInfo}>
                <Text style={styles.driver}>
                  {res.driver?.name} {res.driver?.surname}
                </Text>
                <Text style={styles.team}>{res.team?.teamName}</Text>
              </View>
              <Text style={styles.time}>{res.time ?? res.retired ?? "-"}</Text>
              <Text style={styles.points}>{res.points ?? ""}</Text>
            </View>
          ));
        })()
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0d0d0d" },
  container: { padding: 16, paddingBottom: 40 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  btn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: "#111", marginRight: 8, marginBottom: 8 },
  btnActive: { backgroundColor: "#e10600" },
  btnText: { color: "#fff" },
  btnTextActive: { color: "#fff", fontWeight: "700" },
  sectionTitle: { color: "#fff", marginTop: 8, marginBottom: 6 },
  resultsBox: { backgroundColor: "#111", padding: 12, borderRadius: 8 },
  mono: { color: "#ccc", fontFamily: "monospace" },
  note: { color: "#ccc" },
  resultRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#222" },
  pos: { width: 32, color: "#fff", fontWeight: "700" },
  resultInfo: { flex: 1 },
  driver: { color: "#fff", fontWeight: "700" },
  team: { color: "#bbb", marginTop: 2 },
  time: { color: "#ccc", width: 110, textAlign: "right" },
  timeGroup: { width: 160, alignItems: "flex-end" },
  timeSmall: { color: "#ccc", fontSize: 12 },
  points: { color: "#86efac", fontWeight: "700", width: 40, textAlign: "right" },
  date: { color: "#bbb", marginBottom: 8 },
});