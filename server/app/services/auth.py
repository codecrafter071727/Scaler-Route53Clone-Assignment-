from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import User
from app.schemas import SignInRequest, SignUpRequest
from app.services.ids import generate_account_id
from app.services.password import hash_password, verify_password


def register_user(db: Session, payload: SignUpRequest) -> User:
    email = payload.email.lower().strip()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )
    if db.query(User).filter(User.phone == payload.phone).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this phone number already exists",
        )

    account_id = generate_account_id()
    while db.query(User).filter(User.account_id == account_id).first():
        account_id = generate_account_id()

    user = User(
        account_id=account_id,
        name=payload.name,
        email=email,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, payload: SignInRequest) -> User:
    identifier = payload.identifier.strip()
    email_key = identifier.lower()
    phone_key = identifier.replace(" ", "")
    user = (
        db.query(User)
        .filter((User.email == email_key) | (User.phone == phone_key))
        .first()
    )
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/phone or password",
        )
    return user
