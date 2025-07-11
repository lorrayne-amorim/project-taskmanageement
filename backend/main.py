from typing import Union
from fastapi import FastAPI
import json
from fastapi.middleware.cors import CORSMiddleware
import os 
import time;

app = FastAPI()

# Libera acesso do frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou "http://localhost:5173" se quiser restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "boards.json"

# Verifica se existe o arquivo, senão cria
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)

from fastapi import Request

@app.delete("/boards/{board_id}/tasks")
async def delete_task(board_id: str, request: Request):
    data = await request.json()
    column_id = data["columnId"]
    task_id = data["taskId"]

    with open(DATA_FILE, "r") as f:
        boards = json.load(f)

    for board in boards:
        if board["id"] == board_id:
            board["columns"][column_id]["items"] = [
                task for task in board["columns"][column_id]["items"] if task["id"] != task_id
            ]
            break

    with open(DATA_FILE, "w") as f:
        json.dump(boards, f, indent=2)

    return {"ok": True}


@app.put("/boards/{board_id}")
async def update_board(board_id: str, request: Request):
    new_data = await request.json()

    with open(DATA_FILE, "r") as f:
        boards = json.load(f)

    for i, board in enumerate(boards):
        if board["id"] == board_id:
            boards[i] = new_data
            break

    with open(DATA_FILE, "w") as f:
        json.dump(boards, f, indent=2)

    return new_data
    
@app.get("/")
def get_board():
    with open(DATA_FILE, "r") as f:
        boards = json.load(f) #ler os existentes
    
    return boards

@app.get("/boards/{board_id}")
def get_board_by_id(board_id: str):
    with open(DATA_FILE, "r") as f:
        boards = json.load(f)

    for board in boards:
        if board["id"] == board_id:
            return board
    return {"error" : "Board not found"}
    
@app.post("/boards")
def create_board(data: dict):
    with open(DATA_FILE, "r") as f:
        boards = json.load(f) #ler os existentes

        new_board = {
            "id" : str(int(time.time())),
            "name" : data["name"],
            "columns":{
                "todo" : {"name": "To do", "items": []},
                "inProgress" : {"name": "Doing", "items": []},
                "done" : {"name": "Done", "items": []},
            }
        }

        boards.append(new_board) #add a lista

        with open(DATA_FILE, "w") as f:
            json.dump(boards,f, indent=2)
        
        return new_board