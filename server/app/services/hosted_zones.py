import secrets
import string

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import HostedZone, User
from app.schemas.hosted_zone import HostedZoneCreate


def _generate_zone_id() -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "Z" + "".join(secrets.choice(alphabet) for _ in range(13))


def create_hosted_zone(db: Session, user: User, payload: HostedZoneCreate) -> HostedZone:
    zone = HostedZone(
        user_id=user.id,
        hosted_zone_id=_generate_zone_id(),
        domain_name=payload.domain_name,
        description=payload.description,
        zone_type=payload.zone_type,
        record_count=2,
        created_by="Route 53",
        vpcs=[v.model_dump() for v in payload.vpcs],
        tags=[t.model_dump() for t in payload.tags],
    )
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone


def list_hosted_zones_for_user(db: Session, user: User) -> list[HostedZone]:
    return (
        db.query(HostedZone)
        .filter(HostedZone.user_id == user.id)
        .order_by(HostedZone.id.desc())
        .all()
    )


def get_hosted_zone_for_user(db: Session, user: User, zone_pk: int) -> HostedZone:
    zone = (
        db.query(HostedZone)
        .filter(HostedZone.id == zone_pk, HostedZone.user_id == user.id)
        .first()
    )
    if zone is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found",
        )
    return zone
