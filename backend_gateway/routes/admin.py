from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import requests

from config.setting import SPRING_BOOT_URL

router = APIRouter()

@router.get("/users")
def get_all_users(request: Request):
    headers = {}
    auth_header = request.headers.get("Authorization")
    if auth_header:
        headers["Authorization"] = auth_header

    try:
        response = requests.get(
            f"{SPRING_BOOT_URL}/admin/users",
            headers=headers
        )
        
        try:
            content = response.json()
        except Exception:
            content = {"message": response.text}
            
        return JSONResponse(status_code=response.status_code, content=content)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Gateway error: {str(e)}"})
