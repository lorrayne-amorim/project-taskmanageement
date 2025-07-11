import type { Board } from "../types/Board";

export async function getBoards() {
    try {
        const response = await fetch('http://localhost:8000/');
        if (!response.ok) {
            throw new Error("Erro ao buscar boards");
        }
        const data = await response.json();
        return data;
    } catch (error: unknown) {
        console.log("Erro ao buscar boards: ", error);
        return [];
    }
}

export async function getBoardById(id: string): Promise<Board | null> {
    try {
        const response = await fetch(`http://localhost:8000/boards/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar board");
        }
        return await response.json();
    } catch (error: unknown) {
        console.log("Erro ao buscar boards: ", error);
        return null;
    }
}

export async function createBoard(name: string): Promise<Board> {
    const response = await fetch('http://localhost:8000/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    return await response.json();
}

export async function updateBoard(boardId: string, data: Board): Promise<Board> {
  const response = await fetch(`http://localhost:8000/boards/${boardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar o board");
  }

  return await response.json();
}


export async function deleteTask(boardId: string, columnId: string, taskId: string) {
  const response = await fetch(`http://localhost:8000/boards/${boardId}/tasks`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ columnId, taskId }),
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar tarefa");
  }

  return await response.json();
}
