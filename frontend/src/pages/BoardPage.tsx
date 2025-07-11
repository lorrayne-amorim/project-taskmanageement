import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { getBoardById, updateBoard, deleteTask } from "../services/api";
import type { Board, ColumnType, Task } from "../types/Board";
import { Column } from "../components/Column";

export const BoardPage = () => {
    const { id } = useParams();
    const [board, setBoard] = useState<Board | null>(null);
    const [draggedTask, setDraggedTask] = useState<{ columnId: ColumnType; task: Task } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");

    function handleDragStart(columnId: ColumnType, task: Task) {
        setDraggedTask({ columnId, task });
    }

    function handleDrop(targetColumnId: ColumnType) {
        if (!draggedTask || !board) return;

        const { columnId: sourceColumnId, task } = draggedTask;
        if (sourceColumnId === targetColumnId) return;

        const updatedBoard = { ...board };

        // Remover da coluna original
        updatedBoard.columns[sourceColumnId].items = updatedBoard.columns[sourceColumnId].items.filter(
            (t) => t.id !== task.id
        );

        // Adicionar à nova coluna
        updatedBoard.columns[targetColumnId].items.push(task);

        // Persistir no backend
        updateBoard(board.id, updatedBoard).then(setBoard);

        setDraggedTask(null);
    }

    function handleAddTask(columnId: ColumnType, content: string) {
        if (!board) return;

        const newTask = {
            id: Date.now().toString(),
            content,
            completed: false,
        };

        const updated = { ...board };
        updated.columns[columnId].items.push(newTask);
        updateBoard(board.id, updated).then((newBoard) => {
            setBoard(newBoard);
        });
    }

    function handleRemoveTask(columnId: ColumnType, taskId: string) {
        if (!board) return;

        const updated = { ...board };


        updated.columns[columnId].items = updated.columns[columnId].items.filter(
            (item) => item.id !== taskId
        );

        deleteTask(board.id, columnId, taskId).then(() => {
            // Atualiza localmente o estado após o backend confirmar a exclusão
            const updated = { ...board };
            updated.columns[columnId].items = updated.columns[columnId].items.filter(
                (item) => item.id !== taskId
            );
            setBoard(updated);
        });

    }

    function handleUpdateBoardName() {
        if (!board) return;
        const updated = { ...board, name: editedName };
        updateBoard(board.id, updated).then((newBoard) => {
            setBoard(newBoard);
            setIsEditing(false);
        });
    }

    function handleUpdateTask(columnId: ColumnType, taskId: string, newContent: string) {
        if (!board) return;

        const updated = { ...board };

        updated.columns[columnId].items = updated.columns[columnId].items.map((task) =>
            task.id === taskId ? { ...task, content: newContent } : task
        );

        updateBoard(board.id, updated).then((newBoard) => {
            setBoard(newBoard);
        });
    }

    function handleToggleComplete(columnId: ColumnType, taskId: string, currentState: boolean) {
        if (!board) return;

        const updated = { ...board };

        updated.columns[columnId].items = updated.columns[columnId].items.map((task) =>
            task.id === taskId ? { ...task, completed: !currentState } : task
        );

        updateBoard(board.id, updated).then((newBoard) => {
            setBoard(newBoard);
        });
    }



    useEffect(() => {
        if (id) {
            getBoardById(id).then(setBoard);
        }
    }, [id]);

    if (!board) {
        return <div className="text-white p-6">Carrgando...</div>
    }
    return (
        <div className="min-h-screen p-4 sm:p-6 text-white flex flex-col items-center">
            {isEditing ? (
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={handleUpdateBoardName}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateBoardName();
                    }}
                    autoFocus
                    className="bg-white/80 text-black px-3 py-2 rounded shadow w-full max-w-md mx-auto"
                />
            ) : (
                <h2
                    className="text-2xl sm:text-3xl text-white mb-5 font-bold cursor-pointer text-center"
                    onDoubleClick={() => {
                        setIsEditing(true);
                        setEditedName(board.name);
                    }}
                >
                    Quadro: {board.name}
                </h2>
            )}

            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:overflow-x-auto  sm:justify-center gap-5 pb-5 items-center">
                    {(Object.keys(board.columns) as ColumnType[]).map((key) => {
                        const column = board.columns[key];

                        return (
                            <Column
                                key={key}
                                columnId={key}
                                columnName={column.name}
                                tasks={column.items}
                                onAddTask={handleAddTask}
                                onRemoveTask={handleRemoveTask}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onUpdateTask={handleUpdateTask}
                                onToggleComplete={handleToggleComplete}
                            />
                        );
                    })}
                </div>
            </div>
            <p>Clique duas vezes para editar a tarefa</p>
        </div>
    );

}
