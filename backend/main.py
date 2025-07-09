from typing import Union
from fastapi import FastAPI
import json
from fastapi.middleware.cors import CORSMiddleware
import os 

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

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/boards")
def get_boards():
    with open(DATA_FILE, "r") as f:
        return json.load(f)