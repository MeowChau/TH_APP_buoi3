import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Bai4Screen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const themCongViec = () => {
    if (task.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung công việc!');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: task.trim(),
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTask('');
  };

const xoaCongViec = (id: string) => {
  setTasks(tasks.filter(item => item.id !== id));
};

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = tasks.filter(t => t.completed).length;

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity 
        style={styles.taskContent}
        onPress={() => toggleComplete(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => xoaCongViec(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Todo List</Text>
        <Text style={styles.subtitle}>Quản lý công việc của bạn</Text>
      </View>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Thêm công việc mới..."
          placeholderTextColor="#95a5a6"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={themCongViec}
        />
        <TouchableOpacity style={styles.addButton} onPress={themCongViec}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Chưa có công việc nào</Text>
          <Text style={styles.emptySubtext}>Thêm công việc đầu tiên của bạn!</Text>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{tasks.length}</Text>
              <Text style={styles.statLabel}>Tổng</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#27ae60' }]}>
                {completedCount}
              </Text>
              <Text style={styles.statLabel}>Hoàn thành</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#e67e22' }]}>
                {tasks.length - completedCount}
              </Text>
              <Text style={styles.statLabel}>Còn lại</Text>
            </View>
          </View>

          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  inputCard: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingHorizontal: 15,
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});