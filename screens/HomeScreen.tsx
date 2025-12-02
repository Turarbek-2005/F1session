import React, { ComponentProps, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  AppBar,
  IconButton,
  Button,
  Surface,
} from "@react-native-material/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { logout } from "./authSlice";

type RootStackParamList = {
  Home: undefined;
  Drivers: undefined;
  Teams: undefined;
  Login: undefined;
  Register: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  type MCI = ComponentProps<typeof MaterialCommunityIcons>["name"];

  const links: { name: string; screen: keyof RootStackParamList; icon: MCI }[] = [
    { name: "Drivers", screen: "Drivers", icon: "car" },
    { name: "Teams", screen: "Teams", icon: "flag-checkered" },
  ];

  const toggleMenu = () => setMenuVisible((v) => !v);

  const navigateTo = (screen: keyof RootStackParamList) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    dispatch(logout());
    toggleMenu();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <AppBar
        title="F1KZ"
        color="#e10600"
        centerTitle={true}
        leading={
          <IconButton
            icon={<MaterialCommunityIcons name="menu" size={24} color="#fff" />}
            onPress={toggleMenu}
          />
        }
      />

      {/* Drawer implemented with Modal + Surface */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Surface style={styles.drawerSurface} elevation={6}>
            <View style={styles.drawerHeader}>
              <MaterialCommunityIcons
                name="speedometer"
                size={42}
                color="#e10600"
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.drawerTitle}>F1KZ</Text>
                <Text style={styles.drawerSubtitle}>
                  {user ? `Welcome, ${user.username}` : "Formula 1 Kazakhstan"}
                </Text>
              </View>
            </View>

            <View style={styles.drawerItems}>
              <TouchableOpacity
                style={[styles.drawerItem, styles.drawerItemActive]}
                onPress={() => navigateTo("Home")}
              >
                <MaterialCommunityIcons name="home" size={22} color="#fff" />
                <Text style={styles.drawerItemText}>Home</Text>
              </TouchableOpacity>

              {links.map((link) => (
                <TouchableOpacity
                  key={link.name}
                  style={styles.drawerItem}
                  onPress={() => navigateTo(link.screen)}
                >
                  <MaterialCommunityIcons
                    name={link.icon}
                    size={22}
                    color="#fff"
                  />
                  <Text style={styles.drawerItemText}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.drawerAuthSection}>
              {user ? (
                <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={handleLogout}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={22}
                    color="#fff"
                  />
                  <Text style={styles.drawerItemText}>Logout</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigateTo("Login")}
                  >
                    <MaterialCommunityIcons
                      name="login"
                      size={22}
                      color="#fff"
                    />
                    <Text style={styles.drawerItemText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigateTo("Register")}
                  >
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={22}
                      color="#fff"
                    />
                    <Text style={styles.drawerItemText}>Register</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>
                © {new Date().getFullYear()} F1KZ
              </Text>
            </View>
          </Surface>
        </TouchableOpacity>
      </Modal>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.titleHighlight}>F1KZ</Text>
        </Text>
        <Text style={styles.subtitle}>
          Explore your favorite Formula 1 teams and drivers
        </Text>

        <View style={styles.gridContainer}>
          {links.map((link) => (
            <Pressable
              key={link.name}
              onPress={() => navigation.navigate(link.screen)}
              style={({ pressed }) => [
                styles.card,
                pressed ? { transform: [{ scale: 0.99 }] } : null,
              ]}
            >
              <Surface elevation={4} style={styles.cardSurface}>
                <View style={styles.cardInner}>
                  <MaterialCommunityIcons
                    name={link.icon}
                    size={44}
                    color="#e10600"
                  />
                  <Text style={styles.cardTitle}>{link.name}</Text>
                  <Button
                    title="Open"
                    color="#e10600"
                    onPress={() => navigation.navigate(link.screen)}
                    style={styles.cardButton}
                  />
                </View>
              </Surface>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footerWrapper}>
        <Text style={styles.footer}>
          © {new Date().getFullYear()} F1KZ. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
  },
  drawerSurface: { width: 280, backgroundColor: "#111", paddingBottom: 40 },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  drawerTitle: { color: "#e10600", fontSize: 20, fontWeight: "700" },
  drawerSubtitle: { color: "#bbb", fontSize: 12 },
  drawerItems: { paddingTop: 12 },
  drawerAuthSection: {
    borderTopWidth: 1,
    borderTopColor: "#222",
    marginTop: 12,
    paddingTop: 12,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 12,
  },
  drawerItemActive: {
    backgroundColor: "#1a1a1a",
    borderLeftWidth: 4,
    borderLeftColor: "#e10600",
  },
  drawerItemText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  drawerFooter: {
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  drawerFooterText: { color: "#666", fontSize: 12 },
  content: { padding: 20, alignItems: "center" },
  title: {
    color: "#fff",
    fontSize: 36,
    textAlign: "center",
    marginTop: 36,
    fontWeight: "800",
  },
  titleHighlight: { color: "#e10600" },
  subtitle: {
    color: "#ddd",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: { width: 160, margin: 8, borderRadius: 12 },
  cardSurface: {
    borderRadius: 12,
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  cardInner: { alignItems: "center", justifyContent: "center" },
  cardTitle: { color: "#fff", marginTop: 8, fontSize: 18, fontWeight: "700" },
  cardButton: { marginTop: 10, alignSelf: "center" },
  footerWrapper: { alignItems: "center", marginTop: 20 },
  footer: { color: "#888" },
});

export default HomeScreen;
