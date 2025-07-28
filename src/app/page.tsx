'use client';

import { useEffect, useState } from 'react';

// Define the shape of each todo item
interface Todo {
  id: number;
  text: string;
  tag: string;
  priority: string;
  dueDate: string;
  status: 'Not Started' | 'Pending' | 'Done';
}

export default function TodoPage() {
  // State hooks for form inputs and todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [tag, setTag] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [motivation, setMotivation] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      tag,
      priority,
      dueDate,
      status: 'Not Started'
    };
    setTodos([...todos, newTodo]);
    setInput('');
    setDueDate('');
    setTag('Work');
    setPriority('Medium');
    setMotivation('');
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo))
    );
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => todo.status !== 'Done'));
    setMotivation('');
  };

  const updateStatus = (id: number, newStatus: Todo['status']) => {
    setTodos((prev) => {
      const updated = prev.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      );
      const changed = updated.find((todo) => todo.id === id);
      if (changed?.status === 'Done') {
        const messages = [
          '✅ Great work! Keep pushing forward!',
          '🎉 You’re getting things DONE!',
          '👏 One step closer to your goal!',
          '🚀 Look at you go!'
        ];
        const random = messages[Math.floor(Math.random() * messages.length)];
        setMotivation(random);
      } else {
        setMotivation('');
      }
      return updated;
    });
  };

  const completedCount = todos.filter((t) => t.status === 'Done').length;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center p-4">
      <div className="w-full max-w-3xl backdrop-blur-sm bg-white/10 rounded-xl p-6 shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-center">📝 Add Task</h2>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border p-2 rounded bg-white/10 placeholder-white/60"
          placeholder="Enter task..."
        />

        <div className="flex gap-2">
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="border p-2 rounded w-full bg-white/10 text-white">
            <option style={{ color: 'black' }}>Work</option>
            <option style={{ color: 'black' }}>Personal</option>
            <option style={{ color: 'black' }}>Urgent</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border p-2 rounded w-full bg-white/10 text-white">
            <option style={{ color: 'black' }}>Low</option>
            <option style={{ color: 'black' }}>Medium</option>
            <option style={{ color: 'black' }}>High</option>
          </select>
        </div>

        {/* Due date with custom calendar icon */}
        <label className="flex flex-col gap-1 text-sm text-white w-full">
          <span className="mb-1">Due Date</span>
          <div className="relative w-full">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border p-2 rounded bg-white/10 text-white appearance-none
              [&::-webkit-calendar-picker-indicator]:opacity-0
              [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            {/* Custom white calendar icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </label>


        <button
          onClick={addTodo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Add Task
        </button>

        <div>
          <p className="text-sm text-gray-300 mt-4">
            {completedCount} of {todos.length} completed
          </p>
          <div className="w-full h-3 bg-gray-700 rounded">
            <div className="h-3 bg-green-400 rounded" style={{ width: `${progress}%` }} />
          </div>
          {motivation && <p className="mt-2 text-green-300 text-sm italic">{motivation}</p>}
        </div>

        <button
          onClick={clearCompleted}
          className="mt-4 text-sm text-red-400 underline hover:text-red-300"
        >
          Clear Completed Tasks
        </button>
      </div>

      <div className="w-full max-w-3xl mt-10 backdrop-blur-sm bg-white/10 rounded-xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">📋 Task Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-white/10 text-left">
              <tr>
                <th className="p-2">Task</th>
                <th className="p-2">Tag</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Due</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="border-t border-white/20">
                  <td className="p-2">
                    {editingId === todo.id ? (
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border p-1 rounded w-full bg-white/10"
                      />
                    ) : (
                      <span>{todo.text}</span>
                    )}
                  </td>
                  <td className="p-2">{todo.tag}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs text-white ${
                        todo.priority === 'High'
                          ? 'bg-red-500'
                          : todo.priority === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    >
                      {todo.priority}
                    </span>
                  </td>
                  <td className="p-2">{todo.dueDate || '-'}</td>
                  <td className="p-2">
                    <select
                      value={todo.status}
                      onChange={(e) => updateStatus(todo.id, e.target.value as Todo['status'])}
                      className="border rounded p-1 text-sm bg-white/10 text-white"
                    >
                      <option style={{ color: 'black' }}>Not Started</option>
                      <option style={{ color: 'black' }}>Pending</option>
                      <option style={{ color: 'black' }}>Done</option>
                    </select>
                  </td>
                  <td className="p-2 space-x-2">
                    {editingId === todo.id ? (
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="text-green-300 text-sm hover:underline"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="text-blue-300 text-sm hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-400 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {todos.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-400">
                    No tasks yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
