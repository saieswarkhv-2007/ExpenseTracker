from fastapi import APIRouter
import requests

from config.setting import SPRING_BOOT_URL

router = APIRouter()

@router.get("/")
def get_all_expenses():

    response = requests.get(
        f"{SPRING_BOOT_URL}/expenses"
    )

    return response.json()


@router.post("/")
def add_expense(payload: dict):

    response = requests.post(
        f"{SPRING_BOOT_URL}/expenses",
        json=payload
    )

    return response.json()


@router.put("/{id}")
def update_expense(id: int,
                   payload: dict):

    response = requests.put(
        f"{SPRING_BOOT_URL}/expenses/{id}",
        json=payload
    )

    return response.json()


@router.delete("/{id}")
def delete_expense(id: int):

    response = requests.delete(
        f"{SPRING_BOOT_URL}/expenses/{id}"
    )

    return {
        "message": response.text
    }