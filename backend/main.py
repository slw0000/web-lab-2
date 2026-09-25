from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import requests
from backend.repository.json_crud import init_data_json

app = FastAPI()

origins = [
    "http://localhost:2000",
    "http://127.0.0.1:2000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "QUERY"],
    allow_headers=["*"],
)

init_data_json()

app.include_router(requests.router)


@app.get("/status")
def read_root():
    return {"Message": "Api is working! :P"}