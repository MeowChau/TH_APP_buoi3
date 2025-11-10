import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Bai2Screen() {
  const [toan, setToan] = useState('');
  const [ly, setLy] = useState('');
  const [hoa, setHoa] = useState('');
  const [diemTB, setDiemTB] = useState<number | null>(null);
  // Thêm state để quản lý lỗi cho từng ô input
  const [errors, setErrors] = useState<{ toan?: string; ly?: string; hoa?: string }>({});

  /**
   * Hàm này chỉ kiểm tra và trả về tin nhắn lỗi (nếu có)
   * thay vì hiển thị Alert
   */
  const validateScore = (diem: string, mon: string): string | null => {
    if (diem.trim() === '') {
      return `Vui lòng nhập điểm ${mon}!`;
    }
    const diemSo = parseFloat(diem);
    if (isNaN(diemSo)) {
      return `Điểm ${mon} không hợp lệ!`;
    }
    if (diemSo < 0 || diemSo > 10) {
      return `Điểm ${mon} phải từ 0 - 10!`;
    }
    return null; // Không có lỗi
  };

  const tinhDiemTB = () => {
    // 1. Kiểm tra tất cả các môn
    const toanError = validateScore(toan, 'Toán');
    const lyError = validateScore(ly, 'Lý');
    const hoaError = validateScore(hoa, 'Hóa');

    // 2. Tạo một đối tượng chứa tất cả lỗi
    const newErrors: { toan?: string; ly?: string; hoa?: string } = {};
    if (toanError) newErrors.toan = toanError;
    if (lyError) newErrors.ly = lyError;
    if (hoaError) newErrors.hoa = hoaError;

    // 3. Cập nhật state lỗi
    setErrors(newErrors);
    setDiemTB(null); // Xóa kết quả cũ (nếu có)

    // 4. Nếu có bất kỳ lỗi nào, dừng lại
    // **YÊU CẦU CỦA BẠN:** Không can thiệp (xóa) textbox
    if (Object.keys(newErrors).length > 0) {
      // Hiển thị 1 Alert chung cho lỗi đầu tiên tìm thấy
      Alert.alert('Lỗi', toanError || lyError || hoaError || 'Dữ liệu không hợp lệ');
      return; 
    }

    // 5. Nếu không có lỗi, tiến hành tính toán
    const diemToan = parseFloat(toan);
    const diemLy = parseFloat(ly);
    const diemHoa = parseFloat(hoa);

    const trungBinh = (diemToan + diemLy + diemHoa) / 3;
    setDiemTB(trungBinh);
  };

  const xepLoai = (diem: number) => {
    if (diem >= 8) return { text: 'Giỏi', color: '#27ae60', emoji: '🏆' };
    if (diem >= 6.5) return { text: 'Khá', color: '#3498db', emoji: '⭐' };
    if (diem >= 5) return { text: 'Trung bình', color: '#f39c12', emoji: '👍' };
    return { text: 'Yếu', color: '#e74c3c', emoji: '💪' };
  };

  const reset = () => {
    setToan('');
    setLy('');
    setHoa('');
    setDiemTB(null);
    setErrors({}); // Cũng reset lỗi
  };

  // Hàm helper để xóa lỗi khi người dùng bắt đầu nhập
  const handleTextChange = (
    text: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    fieldName: 'toan' | 'ly' | 'hoa'
  ) => {
    setter(text);
    // Nếu có lỗi ở trường này, xóa nó đi
    if (errors[fieldName]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: undefined,
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>📊 Tính Điểm Trung Bình</Text>
          <Text style={styles.note}>⚠️ Điểm hợp lệ từ 0 đến 10</Text>

          {/* Môn Toán */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>📐 Toán</Text>
            <TextInput
              // Áp dụng style lỗi nếu có
              style={[styles.input, errors.toan ? styles.inputError : null]}
              placeholder="Nhập điểm (0-10)"
              keyboardType="decimal-pad"
              value={toan}
              onChangeText={text => handleTextChange(text, setToan, 'toan')}
              maxLength={4}
            />
            {/* Hiển thị tin nhắn lỗi bên dưới */}
            {errors.toan && <Text style={styles.errorText}>{errors.toan}</Text>}
          </View>

          {/* Môn Lý */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>⚛️ Lý</Text>
            <TextInput
              style={[styles.input, errors.ly ? styles.inputError : null]}
              placeholder="Nhập điểm (0-10)"
              keyboardType="decimal-pad"
              value={ly}
              onChangeText={text => handleTextChange(text, setLy, 'ly')}
              maxLength={4}
            />
            {errors.ly && <Text style={styles.errorText}>{errors.ly}</Text>}
          </View>

          {/* Môn Hóa */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>🧪 Hóa</Text>
            <TextInput
              style={[styles.input, errors.hoa ? styles.inputError : null]}
              placeholder="Nhập điểm (0-10)"
              keyboardType="decimal-pad"
              value={hoa}
              onChangeText={text => handleTextChange(text, setHoa, 'hoa')}
              maxLength={4}
            />
            {errors.hoa && <Text style={styles.errorText}>{errors.hoa}</Text>}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={tinhDiemTB}>
              <Text style={styles.buttonText}>Tính Điểm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={reset}>
              <Text style={styles.buttonTextSecondary}>Làm Mới</Text>
            </TouchableOpacity>
          </View>

          {diemTB !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultEmoji}>{xepLoai(diemTB).emoji}</Text>
              <Text style={styles.resultLabel}>Điểm trung bình</Text>
              <Text style={styles.resultScore}>{diemTB.toFixed(2)}</Text>
              <View style={[styles.rankBadge, { backgroundColor: xepLoai(diemTB).color }]}>
                <Text style={styles.rankText}>{xepLoai(diemTB).text}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, // Giảm độ đậm của shadow
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  note: {
    fontSize: 13,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 15, // Giảm margin một chút
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 2, // Tăng độ dày border để dễ thấy
    borderColor: '#e0e0e0', // Border mặc định
  },
  // Style mới khi input bị lỗi
  inputError: {
    borderColor: '#e74c3c', // Border màu đỏ
  },
  // Style mới cho tin nhắn lỗi
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 25,
    padding: 25,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  resultScore: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 10,
  },
  rankBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 5,
  },
  rankText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});