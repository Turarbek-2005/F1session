import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const drivers = [
    { id: '1', name: 'Max Verstappen', team: 'Red Bull Racing' },
    { id: '2', name: 'Charles Leclerc', team: 'Ferrari' },
    { id: '3', name: 'Lando Norris', team: 'McLaren' },
    { id: '4', name: 'Lewis Hamilton', team: 'Mercedes' },
];

const DriversScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>F1 Drivers</Text>
            <FlatList
                data={drivers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.team}>{item.team}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#f3f3f3',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    team: {
        fontSize: 14,
        color: '#555',
    },
});

export default DriversScreen;
