import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ServersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🌍 Servers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});