from fastapi import APIRouter
import requests

from config.setting import SPRING_BOOT_URL

router = APIRouter()

@router.post("/register")
def register(payload: dict):

    response = requests.post(
        f"{SPRING_BOOT_URL}/auth/register",
        json=payload
    )

    return {
        "status": response.status_code,
        "message": response.text
    }


@router.post("/login")
def login(payload: dict):

    response = requests.post(
        f"{SPRING_BOOT_URL}/auth/login",
        json=payload
    )

    return response.json()