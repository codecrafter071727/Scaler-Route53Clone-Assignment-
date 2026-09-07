import secrets
import string

from fastapi import HTTPException, status
from sqlalchemy import String, cast, or_
from sqlalchemy.orm import Query, Session

from app.models import HostedZone, User
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate
from app.services import record_sets as record_service


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
    record_service.seed_default_record_sets(db, zone)
    db.refresh(zone)
    return zone


def _normalize_zone_type(value: str) -> str:
    return value.strip().lower()


def list_hosted_zones_for_user(
    db: Session,
    user: User,
    *,
    domain_name: str | None = None,
    zone_type: str | None = None,
    created_by: str | None = None,
    record_count: str | None = None,
    description: str | None = None,
    hosted_zone_id: str | None = None,
    q: str | None = None,
) -> list[HostedZone]:
    query: Query[HostedZone] = db.query(HostedZone).filter(
        HostedZone.user_id == user.id
    )

    if domain_name:
        query = query.filter(HostedZone.domain_name == domain_name.strip())
    if zone_type:
        query = query.filter(HostedZone.zone_type == _normalize_zone_type(zone_type))
    if created_by:
        query = query.filter(HostedZone.created_by == created_by.strip())
    if description is not None and description != "":
        query = query.filter(HostedZone.description == description.strip())
    if hosted_zone_id:
        query = query.filter(HostedZone.hosted_zone_id == hosted_zone_id.strip())
    if record_count is not None and record_count != "":
        try:
            query = query.filter(HostedZone.record_count == int(record_count))
        except ValueError:
            query = query.filter(HostedZone.id == -1)

    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                HostedZone.domain_name.ilike(term),
                HostedZone.zone_type.ilike(term),
                HostedZone.created_by.ilike(term),
                HostedZone.description.ilike(term),
                HostedZone.hosted_zone_id.ilike(term),
                cast(HostedZone.record_count, String).ilike(term),
            )
        )

    return query.order_by(HostedZone.id.desc()).all()


def list_filter_options_for_user(db: Session, user: User) -> dict[str, list[str]]:
    """Distinct filter values for every property, from the user's zones."""
    zones = (
        db.query(HostedZone)
        .filter(HostedZone.user_id == user.id)
        .order_by(HostedZone.id.desc())
        .all()
    )

    domain_names: list[str] = []
    zone_types: list[str] = []
    created_bys: list[str] = []
    record_counts: list[str] = []
    descriptions: list[str] = []
    hosted_zone_ids: list[str] = []

    seen: dict[str, set[str]] = {
        "domain_name": set(),
        "zone_type": set(),
        "created_by": set(),
        "record_count": set(),
        "description": set(),
        "hosted_zone_id": set(),
    }

    for zone in zones:
        if zone.domain_name and zone.domain_name not in seen["domain_name"]:
            seen["domain_name"].add(zone.domain_name)
            domain_names.append(zone.domain_name)

        type_label = (zone.zone_type or "").strip().capitalize()
        if type_label and type_label not in seen["zone_type"]:
            seen["zone_type"].add(type_label)
            zone_types.append(type_label)

        if zone.created_by and zone.created_by not in seen["created_by"]:
            seen["created_by"].add(zone.created_by)
            created_bys.append(zone.created_by)

        count_label = str(zone.record_count)
        if count_label not in seen["record_count"]:
            seen["record_count"].add(count_label)
            record_counts.append(count_label)

        desc = (zone.description or "").strip()
        if desc and desc not in seen["description"]:
            seen["description"].add(desc)
            descriptions.append(desc)

        if zone.hosted_zone_id and zone.hosted_zone_id not in seen["hosted_zone_id"]:
            seen["hosted_zone_id"].add(zone.hosted_zone_id)
            hosted_zone_ids.append(zone.hosted_zone_id)

    return {
        "domain_name": domain_names,
        "zone_type": zone_types,
        "accelerated_recovery": ["Disabled"],
        "created_by": created_bys,
        "record_count": record_counts,
        "description": descriptions,
        "hosted_zone_id": hosted_zone_ids,
    }


def list_property_values_for_user(
    db: Session, user: User, property_key: str
) -> list[str]:
    options = list_filter_options_for_user(db, user)
    if property_key not in options:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown filter property: {property_key}",
        )
    return options[property_key]

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


def update_hosted_zone(
    db: Session, user: User, zone_pk: int, payload: HostedZoneUpdate
) -> HostedZone:
    zone = get_hosted_zone_for_user(db, user, zone_pk)

    if zone.zone_type == "private" and len(payload.vpcs) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Private hosted zones require at least one VPC with region and VPC ID",
        )

    zone.description = payload.description
    zone.tags = [t.model_dump() for t in payload.tags]
    if zone.zone_type == "private":
        zone.vpcs = [v.model_dump() for v in payload.vpcs]
    else:
        zone.vpcs = []

    db.commit()
    db.refresh(zone)
    return zone


def list_hosted_zone_tags_for_user(
    db: Session, user: User, zone_pk: int
) -> list[dict]:
    zone = get_hosted_zone_for_user(db, user, zone_pk)
    return list(zone.tags or [])
