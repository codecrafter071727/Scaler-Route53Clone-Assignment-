from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import HostedZone, RecordSet, User
from app.schemas.record_set import RecordSetCreate

DEFAULT_NS = [
    "ns-1536.awsdns-00.co.uk.",
    "ns-0.awsdns-00.com.",
    "ns-512.awsdns-00.net.",
    "ns-1024.awsdns-00.org.",
]


def _get_zone_for_user(db: Session, user: User, zone_pk: int) -> HostedZone:
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


def seed_default_record_sets(db: Session, zone: HostedZone) -> list[RecordSet]:
    """Create the default NS + SOA records AWS adds for every hosted zone."""
    existing = (
        db.query(RecordSet)
        .filter(RecordSet.hosted_zone_id == zone.id)
        .count()
    )
    if existing > 0:
        return (
            db.query(RecordSet)
            .filter(RecordSet.hosted_zone_id == zone.id)
            .order_by(RecordSet.id.asc())
            .all()
        )

    ns = RecordSet(
        hosted_zone_id=zone.id,
        record_name=zone.domain_name,
        record_type="NS",
        routing_policy="Simple",
        differentiator=None,
        alias=False,
        value=list(DEFAULT_NS),
        ttl=172800,
        health_check_id=None,
        evaluate_target_health=False,
        record_id=None,
    )
    soa = RecordSet(
        hosted_zone_id=zone.id,
        record_name=zone.domain_name,
        record_type="SOA",
        routing_policy="Simple",
        differentiator=None,
        alias=False,
        value=[
            f"{DEFAULT_NS[0]} awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
        ],
        ttl=900,
        health_check_id=None,
        evaluate_target_health=False,
        record_id=None,
    )
    db.add_all([ns, soa])
    zone.record_count = 2
    db.commit()
    db.refresh(ns)
    db.refresh(soa)
    return [ns, soa]


def list_record_sets_for_zone(
    db: Session, user: User, zone_pk: int
) -> list[RecordSet]:
    zone = _get_zone_for_user(db, user, zone_pk)

    records = (
        db.query(RecordSet)
        .filter(RecordSet.hosted_zone_id == zone.id)
        .order_by(RecordSet.id.asc())
        .all()
    )
    if records:
        return records
    return seed_default_record_sets(db, zone)


def create_record_set(
    db: Session, user: User, zone_pk: int, payload: RecordSetCreate
) -> RecordSet:
    zone = _get_zone_for_user(db, user, zone_pk)
    existing_count = (
        db.query(RecordSet).filter(RecordSet.hosted_zone_id == zone.id).count()
    )
    if existing_count == 0:
        seed_default_record_sets(db, zone)
        db.refresh(zone)

    values = [v.strip() for v in payload.value if v and str(v).strip()]
    if not payload.alias and not values:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Value is required when Alias is off.",
        )

    record = RecordSet(
        hosted_zone_id=zone.id,
        record_name=payload.record_name.strip(),
        record_type=payload.record_type.strip().upper(),
        routing_policy=(payload.routing_policy or "Simple").strip() or "Simple",
        differentiator=payload.differentiator,
        alias=payload.alias,
        value=values,
        ttl=payload.ttl,
        health_check_id=payload.health_check_id,
        evaluate_target_health=payload.evaluate_target_health,
        record_id=payload.record_id,
    )
    db.add(record)
    db.flush()
    zone.record_count = (
        db.query(RecordSet).filter(RecordSet.hosted_zone_id == zone.id).count()
    )
    db.commit()
    db.refresh(record)
    return record
