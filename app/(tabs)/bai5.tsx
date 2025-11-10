import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
// 1. Import axios
import axios from 'axios';

// 2. API Key của bạn
const API_KEY = 'a051f8d4be0fea3f0842474990dd6513';
// 3. Hai đường dẫn API
const API_URL_CURRENT = 'https://api.openweathermap.org/data/2.5/weather';
const API_URL_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast';

// Kiểu dữ liệu cho state thời tiết (giúp code rõ ràng hơn)
interface WeatherData {
  name: string;
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
}

// Kiểu cho 1 mục dự báo trong danh sách forecast (API OpenWeatherMap)
interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    // có thể mở rộng khi cần (temp_min, temp_max, ...)
  };
  weather: {
    description: string;
    icon: string;
  }[];
  // có thể thêm các trường khác nếu cần (wind, clouds, etc.)
}

// Hàm tiện ích viết hoa chữ cái đầu
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // State mới để lưu dự báo 3 ngày
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (city.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thành phố!');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData([]); // Reset dự báo cũ

    try {
      // Cấu hình params chung
      const params = {
        q: city,
        appid: API_KEY,
        units: 'metric', // Để lấy nhiệt độ C
      };

      // Gọi 2 endpoint (current + forecast) song song
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(API_URL_CURRENT, { params }),
        axios.get(API_URL_FORECAST, { params }),
      ]);

      // Lưu dữ liệu thời tiết hiện tại
      setWeatherData(currentWeatherResponse.data);

      // Xử lý dữ liệu dự báo 5 ngày/3 giờ
      const fullList = forecastResponse.data.list as ForecastItem[];
      const today = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay "YYYY-MM-DD"

      const dailyData = fullList.filter((item: ForecastItem) => {
        const [itemDate, itemTime] = item.dt_txt.split(' ');
        // Lọc ra các mục vào 12:00 trưa của những ngày tiếp theo
        return itemTime === '12:00:00' && itemDate !== today;
      });

      // Lưu 3 ngày đầu tiên
      setForecastData(dailyData.slice(0, 3));

    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('Không tìm thấy thành phố này. Vui lòng thử lại.');
      } else {
        setError('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng kiểm tra kết nối.');
        console.error(err); // Log lỗi ra console để debug
      }
    } finally {
      setLoading(false); // Luôn tắt loading sau khi xong
    }
  };

  const renderWeatherInfo = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#3498db" style={styles.loader} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (weatherData) {
      const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;

      return (
        // Dùng Fragment để trả về nhiều component
        <>
          {/* THẺ THỜI TIẾT HIỆN TẠI */}
          <View style={styles.resultCard}>
            <Text style={styles.cityName}>{weatherData.name}</Text>
            <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
            
            <Text style={styles.temperature}>
              {weatherData.main.temp.toFixed(1)}°C
            </Text>
            <Text style={styles.description}>
              {capitalizeFirstLetter(weatherData.weather[0].description)}
            </Text>
            <Text style={styles.feelsLike}>
              Cảm giác như: {weatherData.main.feels_like.toFixed(1)}°C
            </Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Độ ẩm</Text>
                <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Tốc độ gió</Text>
                <Text style={styles.detailValue}>{weatherData.wind.speed} m/s</Text>
              </View>
            </View>
          </View>

          {/* DỰ BÁO 3 NGÀY TIẾP THEO */}
          {forecastData.length > 0 && (
            <>
              <Text style={styles.forecastTitle}>Dự báo 3 ngày tới</Text>
              {/* THAY ĐỔI TỪ SCROLLVIEW SANG VIEW */}
              <View style={styles.forecastContainer}>
                {forecastData.map((item) => {
                  const itemDate = new Date(item.dt * 1000);
                  // Lấy tên Thứ (viết tắt) và Ngày/Tháng
                  const dayOfWeek = itemDate.toLocaleDateString('vi-VN', { weekday: 'short' });
                  const date = itemDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                  const forecastIconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

                  return (
                    <View key={item.dt} style={styles.forecastCard}>
                      <Text style={styles.forecastDay}>{dayOfWeek}</Text>
                      <Text style={styles.forecastDate}>{date}</Text>
                      <Image source={{ uri: forecastIconUrl }} style={styles.forecastIcon} />
                      <Text style={styles.forecastTemp}>{item.main.temp.toFixed(0)}°C</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </>
      );
    }

    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🌤️</Text>
            <Text style={styles.emptyText}>Nhập tên thành phố để xem thời tiết</Text>
        </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Dự Báo Thời Tiết</Text>
        
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên thành phố (ví dụ: Hanoi)"
            placeholderTextColor="#95a5a6"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={fetchWeather} // Cho phép nhấn "Enter" để tìm
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchWeather}>
            <Text style={styles.searchButtonText}>Tìm</Text>
          </TouchableOpacity>
        </View>
        
        {renderWeatherInfo()}
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
    padding: 20,
    paddingBottom: 40, // Thêm padding dưới
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  inputCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 25,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weatherIcon: {
    width: 150,
    height: 150,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '200',
    color: '#2c3e50',
    marginVertical: -10,
  },
  description: {
    fontSize: 20,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 5,
  },
  feelsLike: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 20,
  },
  detailBox: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },

  // ===== STYLE MỚI CHO DỰ BÁO 3 NGÀY =====
  forecastTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 30,
    marginBottom: 15,
    paddingLeft: 5,
  },
  // THAY ĐỔI STYLE Ở ĐÂY
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Căn đều các thẻ ra giữa
    width: '100%',
  },
  forecastCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    // marginRight: 10, // Bỏ marginRight
    width: 110, // Giữ độ rộng cố định
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  forecastDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  forecastIcon: {
    width: 60,
    height: 60,
  },
  forecastTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: -5,
  },
  // ======================================
});