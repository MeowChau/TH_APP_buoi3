import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Bai3Screen() {
  const [backgroundColor, setBackgroundColor] = useState('#9b8f07ff');

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const doiMau = () => {
    const newColor = generateRandomColor();
    setBackgroundColor(newColor);
  };

  const isDark = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  // Tính toán màu chữ (trắng hoặc đen) dựa trên màu nền
  const textColor = isDark(backgroundColor) ? '#ffffff' : '#000000';

  return (
    // 1. ÁP DỤNG MÀU NỀN TỪ STATE Ở ĐÂY
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        
        {/* 2. ÁP DỤNG MÀU CHỮ TỰ ĐỘNG Ở ĐÂY */}
        <Text style={[styles.title, { color: textColor }]}>
          🎨 Đổi Màu Ngẫu Nhiên
        </Text>
        
        <View style={styles.colorBoxContainer}>
          {/* Hộp nhỏ này vẫn dùng state 'backgroundColor' như cũ */}
          <View style={[styles.colorBox, { backgroundColor }]}>
            <Text style={[styles.colorCode, { color: textColor }]}>
              {backgroundColor.toUpperCase()}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={doiMau}>
          <Text style={styles.buttonText}>✨ Đổi Màu</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Nhấn nút để tạo màu ngẫu nhiên
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Xóa 'backgroundColor: #f8f9fa' cố định ở đây
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    // Xóa 'color: #2c3e50' cố định ở đây
  },
  colorBoxContainer: {
    marginBottom: 40,
  },
  colorBox: {
    width: 200,
    height: 200,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  colorCode: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: '#2c3e50', 
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff', 
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});