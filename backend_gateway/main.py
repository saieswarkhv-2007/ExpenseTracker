from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.expense import router as expense_router
from routes.category import router as category_router
from routes.admin import router as admin_router

app = FastAPI(
    title="Expense Tracker Gateway"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    expense_router,
    prefix="/expenses",
    tags=["Expenses"]
)

app.include_router(
    category_router,
    prefix="/categories",
    tags=["Categories"]
)

app.include_router(
    admin_router,
    prefix="/admin",
    tags=["Admin"]
)

@app.get("/")
def home():

    return {
        "message":"Expense Tracker Gateway Running"
    }