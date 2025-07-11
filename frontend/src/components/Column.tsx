import type { Task, ColumnType } from "../types/Board";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";

type Props = {
  columnId: ColumnType;
  columnName: string;
  tasks: Task[];
  onAddTask: (columnId: ColumnType, content: string) => void;
  onRemoveTask: (columnId: ColumnType, taskId: string) => void;
  onDragStart: (columnId: ColumnType, task: Task) => void;
  onDrop: (columnId: ColumnType) => void;
  onUpdateTask: (columnId: ColumnType, taskId: string, newContent: string) => void;
  onToggleComplete: (columnId: ColumnType, taskId: string, currentState: boolean) => void;
};

export function Column({
  columnId,
  columnName,
  tasks,
  onAddTask,
  onRemoveTask,
  onDragStart,
  onDrop,
  onUpdateTask,
  onToggleComplete,
}: Props) {
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState("");

  function handleUpdateTask(taskId: string) {
    if (!editedTaskContent.trim()) return;

    onUpdateTask(columnId, taskId, editedTaskContent);
    setEditingTaskId(null);
    setEditedTaskContent("");
  }

  function handleAdd() {
    if (!newTask.trim()) return;
    onAddTask(columnId, newTask);
    setNewTask("");
  }

  return (
    <div
      className="w-full sm:min-w-[20rem] sm:max-w-[20rem] bg-white/10 p-4 rounded-md"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(columnId)}
    >
      <h3 className="text-lg font-semibold mb-2">{columnName}</h3>

      {tasks.length === 0 ? (
        <p className="text-sm text-white/70 italic">Sem tarefas</p>
      ) : (
        tasks.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => onDragStart(columnId, item)}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded mb-2 flex items-center transition"
          >
            {/* Botão redondo de completar */}
            <button
              onClick={() => onToggleComplete(columnId, item.id, item.completed)}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mr-2 ${item.completed
                ? "bg-purple-400 border-purple-400"
                : "border-white"
                }`}
            ></button>

            {/* Conteúdo editável ou visual */}
            {editingTaskId === item.id ? (
              <input
                type="text"
                value={editedTaskContent}
                onChange={(e) => setEditedTaskContent(e.target.value)}
                onBlur={() => handleUpdateTask(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdateTask(item.id);
                }}
                autoFocus
                className="bg-white/80 text-black rounded px-2 py-1 w-full"
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setEditingTaskId(item.id);
                  setEditedTaskContent(item.content);
                }}
                className={`flex-1 ${item.completed ? "line-through opacity-50" : ""
                  }`}
              >
                {item.content}
              </span>
            )}

            {/* Botão de remover */}
            <button
              onClick={() => onRemoveTask(columnId, item.id)}
              className="ml-2 text-white hover:text-red-400 text-sm"
            >
              ✕
            </button>
          </div>
        ))
      )}

      {/* Input de nova tarefa */}
      <div className="flex mt-3">
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          className="flex-1 px-3 py-2 rounded-l bg-white/80 text-black placeholder-zinc-700"
        />
        <button
          onClick={handleAdd}
          className="px-4 rounded-r bg-pink-600 hover:bg-pink-500 text-white font-semibold"
        >
          <IoIosAdd className="size-6" />
        </button>
      </div>
    </div>
  );
}
