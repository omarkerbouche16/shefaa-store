from __future__ import annotations

import hmac
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/auth/login")

ALGORITHM = "HS256"


def constant_time_compare(val1: str, val2: str) -> bool:
    """Safe string comparison to prevent timing attacks."""
    return hmac.compare_digest(val1.encode(), val2.encode())


def create_admin_token(data: dict[str, Any]) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.ADMIN_JWT_EXPIRE_HOURS)
    payload.update({"exp": expire, "iss": "shefaa-admin"})
    return jwt.encode(payload, settings.ADMIN_JWT_SECRET, algorithm=ALGORITHM)


def verify_admin_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.ADMIN_JWT_SECRET, algorithms=[ALGORITHM])
        if payload.get("iss") != "shefaa-admin":
            raise JWTError("invalid issuer")
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_current_admin(token: str = Depends(oauth2_scheme)) -> dict[str, Any]:
    return verify_admin_token(token)
