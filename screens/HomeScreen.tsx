import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Drivers: undefined;
  Teams: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const links = [
    { name: "Drivers", screen: "Drivers" as const, icon: "🏎️" },
    { name: "Teams", screen: "Teams" as const, icon: "🏁" },
  ];

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateTo = (screen: keyof RootStackParamList) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Header with Burger Menu */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.burgerButton} 
          onPress={toggleMenu}
          activeOpacity={0.7}
        >
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>F1KZ</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Burger Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={[styles.menuItem, styles.menuItemActive]}
                onPress={() => navigateTo('Home')}
              >
                <Text style={styles.menuIcon}>🏠</Text>
                <Text style={styles.menuItemText}>Home</Text>
              </TouchableOpacity>

              {links.map((link) => (
                <TouchableOpacity
                  key={link.name}
                  style={styles.menuItem}
                  onPress={() => navigateTo(link.screen)}
                >
                  <Text style={styles.menuIcon}>{link.icon}</Text>
                  <Text style={styles.menuItemText}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.menuFooter}>
              <Text style={styles.menuFooterText}>F1KZ © {new Date().getFullYear()}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Заголовок */}
      <Text style={styles.title}>
        Welcome to <Text style={styles.titleHighlight}>F1KZ</Text>
      </Text>
      <Text style={styles.subtitle}>Explore your favorite Formula 1 teams and drivers</Text>

      {/* Карточки */}
      <View style={styles.gridContainer}>
        {links.map((link) => (
          <TouchableOpacity
            key={link.name}
            style={styles.card}
            onPress={() => navigation.navigate(link.screen)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardTitle}>{link.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Футер */}
      <Text style={styles.footer}>
        © {new Date().getFullYear()} F1KZ. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#ff0000ff',
  },
  burgerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  burgerLine: {
    width: 30,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#111',
    borderRightWidth: 2,
    borderRightColor: '#e10600',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e10600',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 15,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: '#1a1a1a',
    borderLeftColor: '#e10600',
  },
  menuIcon: {
    fontSize: 24,
  },
  menuItemText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  menuFooter: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  menuFooterText: {
    color: '#666',
    fontSize: 12,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
  titleHighlight: {
    color: '#e10600',
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 30,
    maxWidth: 800,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 20,
    width: 140,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e10600',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  footer: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 80,
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default HomeScreen;
