from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.deps.auth import get_current_user
from app.models import User
from app.schemas import (
    AuthResponse,
    MessageResponse,
    SignInRequest,
    SignUpRequest,
    UserRead,
)
from app.services import auth as auth_service
from app.services.session import create_session, revoke_session
from fastapi import Cookie

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        max_age=settings.session_max_age_seconds,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
        path="/",
    )


def _clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        domain=settings.cookie_domain,
        secure=settings.cookie_secure,
        httponly=True,
        samesite=settings.cookie_samesite,
    )


@router.post("/signup", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignUpRequest, db: Session = Depends(get_db)) -> MessageResponse:
    auth_service.register_user(db, payload)
    return MessageResponse(message="Account created successfully")


@router.post("/signin", response_model=AuthResponse)
def signin(
    payload: SignInRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthResponse:
    user = auth_service.authenticate_user(db, payload)
    session = create_session(db, user)
    _set_session_cookie(response, session.token)
    return AuthResponse(message="Signed in successfully", user=UserRead.model_validate(user))


@router.post("/signout", response_model=MessageResponse)
def signout(
    response: Response,
    db: Session = Depends(get_db),
    session_token: str | None = Cookie(default=None, alias=settings.session_cookie_name),
) -> MessageResponse:
    revoke_session(db, session_token)
    _clear_session_cookie(response)
    return MessageResponse(message="Signed out successfully")


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)) -> User:
    return user
