import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  const links = [
    { name: "Drivers", screen: "Drivers" as const },
    { name: "Teams", screen: "Teams" as const },
  ];

  return (
    <View style={styles.container}>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
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
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 30,
    maxWidth: 800,
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
    textAlign: 'center',
  },
});

export default HomeScreen;
