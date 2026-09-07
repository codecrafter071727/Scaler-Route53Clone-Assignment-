import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.config import settings
from app.models import SessionToken, User


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def create_session(db: Session, user: User) -> SessionToken:
    token = secrets.token_urlsafe(48)
    expires_at = _utcnow() + timedelta(seconds=settings.session_max_age_seconds)
    row = SessionToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def get_user_by_session_token(db: Session, token: str | None) -> User | None:
    if not token:
        return None
    row = db.query(SessionToken).filter(SessionToken.token == token).first()
    if row is None:
        return None
    expires = row.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < _utcnow():
        db.delete(row)
        db.commit()
        return None
    return row.user


def revoke_session(db: Session, token: str | None) -> None:
    if not token:
        return
    row = db.query(SessionToken).filter(SessionToken.token == token).first()
    if row is not None:
        db.delete(row)
        db.commit()
