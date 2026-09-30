from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    details = []
    for error in exc.errors():
        er = {
            "field": ".".join(
                str(part) for part in error["loc"] if part not in ("body", "query")
            ),
            "message": error["msg"],
        }

        details.append(er)

    return JSONResponse(
        status_code=422,
        content={
            "message": "Ошибка валидации данных",
            "details": details,
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": str(exc.detail),
            "details": [],
        },
        headers=exc.headers,
    )


@app.exception_handler(Exception)
async def unexpected_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Внутренняя ошибка сервера",
            "details": [],
        },
    )


init_data_json()

app.include_router(requests.router)


@app.get("/status")
def read_root():
    return {"Message": "Api is working! :P"}
