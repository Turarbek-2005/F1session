import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const teams = [
    { id: '1', name: 'Red Bull Racing', base: 'Milton Keynes, UK' },
    { id: '2', name: 'Ferrari', base: 'Maranello, Italy' },
    { id: '3', name: 'Mercedes', base: 'Brackley, UK' },
    { id: '4', name: 'McLaren', base: 'Woking, UK' },
];

const TeamsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>F1 Teams</Text>
            <FlatList
                data={teams}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.base}>{item.base}</Text>
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
    base: {
        fontSize: 14,
        color: '#555',
    },
});

export default TeamsScreen;
