import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn.tienphong.vn/images/288838b178fd0e9c13f5f0cbdbbbe7ad5907be60c75e4b32a55b09703df8bf45bb6a8aa74831b3dbb43b2a2b7557deae/jack.jpg' }}
          style={styles.avatar}
        />
        
        <Text style={styles.name}>Nguyễn Minh Châu</Text>
        <Text style={styles.job}>Sinh viên</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.contactContainer}>
          <Text style={styles.contactLabel}>📧 Email</Text>
          <Text style={styles.contactInfo}>nminhchau.xxx@gmail.com</Text>
        </View>
        
        <View style={styles.contactContainer}>
          <Text style={styles.contactLabel}>📱 Điện thoại</Text>
          <Text style={styles.contactInfo}>086505xxxx</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#4a90e2',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  job: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 15,
  },
  contactContainer: {
    width: '100%',
    marginVertical: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '500',
  },
});