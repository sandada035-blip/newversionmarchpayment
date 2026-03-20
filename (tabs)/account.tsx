import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ThemedView style={styles.container}>
      {/* ផ្នែកខាងលើ៖ បង្ហាញឈ្មោះ និងលេខទូរសព្ទ */}
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={100} color="#0a7ea4" />
        <ThemedText type="title">ហម ម៉ាលីនដា</ThemedText>
        <ThemedText type="defaultSemiBold">លេខទូរសព្ទ: 017 751 115</ThemedText>
      </View>

      <View style={styles.linkContainer}>
        {/* ប៊ូតុង Telegram: ប្តូរលីងនៅបន្ទាត់ខាងក្រោមនេះ */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => openLink('https://t.me/MalindaHorm')} 
        >
          <Ionicons name="paper-plane" size={24} color="white" />
          <Text style={styles.buttonText}>Telegram</Text>
        </TouchableOpacity>

        {/* ប៊ូតុង Facebook: ប្តូរលីងនៅបន្ទាត់ខាងក្រោមនេះ */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#1877F2' }]} 
          onPress={() => openLink('https://facebook.com/hammalinda')} 
        >
          <Ionicons name="logo-facebook" size={24} color="white" />
          <Text style={styles.buttonText}>Facebook Profile</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  profileHeader: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  linkContainer: { width: '100%', gap: 15 },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0088cc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', marginLeft: 10, fontSize: 18, fontWeight: 'bold' },
});