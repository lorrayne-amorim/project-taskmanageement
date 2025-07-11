import { useState, useEffect } from "react"
import { getBoards, createBoard } from "../services/api"
import type { Board } from "../types/Board";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [newBoardName, setNewBoardName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getBoards().then(setBoards);
    }, []);

    async function handleCreateBoard() {
        if (!newBoardName.trim()) return;

        const newBoard = await createBoard(newBoardName);
        setBoards([...boards, newBoard]);
        setNewBoardName("");
    }
    return (
        <div className="max-w-6xl mx-auto p-2">
            <div className="mb-5 flex gap-2">
                <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Nome do novo quadro"
                    className="p-2 py-3 rounded border bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                />
                <button
                    onClick={handleCreateBoard}
                    className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded"
                >
                    Criar
                </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        className="bg-white text-black p-6 rounded-md shadow hover:shadow-lg hover:bg-gray-100 cursor-pointer transition"
                        onClick={() => navigate(`/board/${board.id}`)}
                    >
                        {board.name}
                    </div>
                ))}
            </div>
        </div>
    );
}