"use client";
import { useState, useRef } from "react";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        { id: Date.now(), text: input.trim(), completed: false },
        ...todos,
      ]);
      setInput("");
      inputRef.current?.focus();
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id: number) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingText } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-black dark:to-gray-900 transition-colors">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
          Todo App
        </h1>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKey}
            aria-label="Add todo"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 flex items-center gap-1 transition disabled:opacity-50"
            disabled={!input.trim()}
            aria-label="Add todo"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
        <ul className="flex flex-col gap-2 mt-2">
          {todos.length === 0 && (
            <li className="text-center text-gray-400 dark:text-gray-500">
              No todos yet. Add one!
            </li>
          )}
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition bg-gray-100 dark:bg-gray-800 border border-transparent hover:border-blue-400 dark:hover:border-blue-500 ${
                todo.completed ? "opacity-60 line-through" : ""
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  todo.completed
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-400 dark:border-gray-600"
                }`}
                aria-label={
                  todo.completed ? "Mark as incomplete" : "Mark as complete"
                }
              >
                {todo.completed && <CheckIcon className="w-4 h-4 text-white" />}
              </button>
              {editingId === todo.id ? (
                <input
                  className="flex-1 rounded px-2 py-1 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(todo.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                  aria-label="Edit todo"
                />
              ) : (
                <span
                  className={`flex-1 text-base sm:text-lg cursor-pointer select-text ${
                    todo.completed
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                  onDoubleClick={() => startEdit(todo.id, todo.text)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") startEdit(todo.id, todo.text);
                  }}
                  aria-label={todo.text}
                >
                  {todo.text}
                </span>
              )}
              <button
                onClick={() => startEdit(todo.id, todo.text)}
                className="opacity-0 group-hover:opacity-100 transition text-blue-500 hover:text-blue-700 focus:opacity-100"
                aria-label="Edit todo"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 focus:opacity-100"
                aria-label="Delete todo"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>{todos.filter((t) => !t.completed).length} left</span>
          <span>{todos.length} total</span>
        </div>
      </div>
    </div>
  );
}
