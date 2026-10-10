import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from app.db.mongodb import users_collection
from app.schemas.auth import (
    UserSignup,
    UserLogin,
    Token,
    ProfileUpdate,
    PasswordChange,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/signup", response_model=Token)
def signup(user_data: UserSignup):
    existing_user = users_collection.find_one({"email": user_data.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())

    new_user = {
        "id": user_id,
        "email": user_data.email,
        "hashed_password": hash_password(user_data.password),
        "name": None,
        "created_at": datetime.utcnow(),
    }

    users_collection.insert_one(new_user)

    token = create_access_token({
        "sub": user_id,
        "email": user_data.email,
    })

    return {"access_token": token}


@router.post("/login", response_model=Token)
def login(user_data: UserLogin):
    user = users_collection.find_one({"email": user_data.email})

    if not user or not verify_password(
        user_data.password,
        user["hashed_password"],
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
    })

    return {"access_token": token}


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user.get("name"),
    }


@router.put("/me")
def update_profile(
    data: ProfileUpdate,
    current_user=Depends(get_current_user),
):
    users_collection.update_one(
        {"id": current_user["id"]},
        {"$set": {"name": data.name}},
    )

    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": data.name,
    }


@router.put("/me/password")
def change_password(
    data: PasswordChange,
    current_user=Depends(get_current_user),
):
    if not verify_password(
        data.current_password,
        current_user["hashed_password"],
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect",
        )

    users_collection.update_one(
        {"id": current_user["id"]},
        {"$set": {"hashed_password": hash_password(data.new_password)}},
    )

    return {"message": "Password updated successfully"}