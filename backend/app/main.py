from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import upload, query, documents, auth


STARTUP_LOGO = """
=========================================
 🚀 RagVault Starting...
 🌐 API Documentation: http://127.0.0.1:8000/docs
=========================================
"""

SHUTDOWN_LOGO = """
=========================================
 👋 RagVault Shutting Down...
=========================================
"""


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(STARTUP_LOGO)
    yield
    print(SHUTDOWN_LOGO)


app = FastAPI(title="RagVault", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://ragvault-mukul.netlify.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(query.router)
app.include_router(documents.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "Hello, RagVault is running!"}
