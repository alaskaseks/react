import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (title) =>
    setTasks((prev) => [...prev, { id: Date.now(), title }]);с

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Задачі</h1>
        <TaskForm onAdd={addTask} />
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
