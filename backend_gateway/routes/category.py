from fastapi import APIRouter
import requests

from config.setting import SPRING_BOOT_URL

router = APIRouter()

@router.get("/")
def get_categories():

    response = requests.get(
        f"{SPRING_BOOT_URL}/categories"
    )

    return response.json()


@router.post("/")
def add_category(payload: dict):

    response = requests.post(
        f"{SPRING_BOOT_URL}/categories",
        json=payload
    )

    return response.json()