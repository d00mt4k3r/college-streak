import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert } from "react-native";
import { useApp } from "../../src/context/AppContext";
import { colors, spacing, radius } from "../../src/constants/theme";
import Card from "../../src/components/Card";
import ProgressBar from "../../src/components/ProgressBar";
import SubjectItem from "../../src/components/SubjectItem";
import TaskItem from "../../src/components/TaskItem";

export default function TasksScreen() {
  const { data, ready, addSubject, deleteSubject, addTask, toggleTask, deleteTask } = useApp();
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  if (!ready || !data) return null;

  const totalDone = Object.values(data.tasks).flat().filter((t) => t.done).length;
  const totalAll = Object.values(data.tasks).flat().length;

  const selectedSubject = data.subjects.find((s) => s.id === selectedSubjectId);
  const selectedTasks = selectedSubjectId ? (data.tasks[selectedSubjectId] || []) : [];

  const handleAddSubject = () => {
    const name = newSubjectName.trim();
    if (!name) return;
    addSubject(name);
    setNewSubjectName("");
  };

  const handleDeleteSubject = (id, name) => {
    Alert.alert("Удалить предмет?", `«${name}» и все его задания будут удалены.`, [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: () => {
        if (selectedSubjectId === id) setSelectedSubjectId(null);
        deleteSubject(id);
      } },
    ]);
  };

  const handleAddTask = () => {
    const title = newTaskTitle.trim();
    if (!title || !selectedSubjectId) return;
    addTask(selectedSubjectId, title);
    setNewTaskTitle("");
  };

  if (selectedSubject) {
    const done = selectedTasks.filter((t) => t.done).length;
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
        <Pressable onPress={() => setSelectedSubjectId(null)}>
          <Text style={styles.back}>← Все предметы</Text>
        </Pressable>

        <Text style={styles.title}>📚 {selectedSubject.name}</Text>
        <ProgressBar value={done} total={selectedTasks.length} label={`${done} / ${selectedTasks.length} выполнено`} />

        <Card style={{ marginTop: spacing.md }}>
          {selectedTasks.length === 0 && <Text style={styles.empty}>Пока нет заданий</Text>}
          {selectedTasks.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              done={task.done}
              onToggle={() => toggleTask(selectedSubjectId, task.id)}
              onDelete={() => deleteTask(selectedSubjectId, task.id)}
            />
          ))}
        </Card>

        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="Новое задание"
            placeholderTextColor={colors.textSecondary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
          />
          <Pressable style={styles.addBtn} onPress={handleAddTask}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Card style={{ marginBottom: spacing.md }}>
        <ProgressBar value={totalDone} total={totalAll} label="📚 Все задания" color={colors.accent} />
      </Card>

      {data.subjects.length === 0 && <Text style={styles.empty}>Добавь первый предмет ниже</Text>}

      {data.subjects.map((subject) => {
        const list = data.tasks[subject.id] || [];
        const done = list.filter((t) => t.done).length;
        return (
          <SubjectItem
            key={subject.id}
            name={subject.name}
            done={done}
            total={list.length}
            onPress={() => setSelectedSubjectId(subject.id)}
            onDelete={() => handleDeleteSubject(subject.id, subject.name)}
          />
        );
      })}

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Новый предмет"
          placeholderTextColor={colors.textSecondary}
          value={newSubjectName}
          onChangeText={setNewSubjectName}
          onSubmitEditing={handleAddSubject}
        />
        <Pressable style={styles.addBtn} onPress={handleAddSubject}>
          <Text style={styles.addBtnText}>+</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "700", marginVertical: spacing.sm },
  back: { color: colors.info, fontSize: 14, marginBottom: spacing.sm },
  empty: { color: colors.textSecondary, textAlign: "center", paddingVertical: spacing.md },
  addRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  input: {
    flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    color: colors.textPrimary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  addBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  addBtnText: { color: "#fff", fontSize: 22, fontWeight: "700" },
});
