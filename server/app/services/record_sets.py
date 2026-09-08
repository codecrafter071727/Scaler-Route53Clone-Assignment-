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


def _get_zone_for_user(db: Session, user: User, hosted_zone_id: str) -> HostedZone:
    zone = (
        db.query(HostedZone)
        .filter(
            HostedZone.hosted_zone_id == hosted_zone_id.strip(),
            HostedZone.user_id == user.id,
        )
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
    db: Session, user: User, hosted_zone_id: str
) -> list[RecordSet]:
    zone = _get_zone_for_user(db, user, hosted_zone_id)

    records = (
        db.query(RecordSet)
        .filter(RecordSet.hosted_zone_id == zone.id)
        .order_by(RecordSet.id.asc())
        .all()
    )
    if records:
        return records
    return seed_default_record_sets(db, zone)


def list_record_set_filter_options(
    db: Session, user: User, hosted_zone_id: str
) -> dict[str, list[str]]:
    records = list_record_sets_for_zone(db, user, hosted_zone_id)

    def unique(values: list[str]) -> list[str]:
        seen: set[str] = set()
        out: list[str] = []
        for value in values:
            if value in seen:
                continue
            seen.add(value)
            out.append(value)
        return out

    return {
        "record_name": unique([r.record_name for r in records]),
        "record_type": unique([r.record_type for r in records]),
        "routing_policy": unique([r.routing_policy for r in records]),
        "differentiator": unique(
            [r.differentiator for r in records if r.differentiator]
        ),
        "alias": ["Yes", "No"],
        "value": unique(
            [line for r in records for line in (r.value or [])]
        ),
        "ttl": unique([str(r.ttl) for r in records]),
        "health_check_id": unique(
            [r.health_check_id for r in records if r.health_check_id]
        ),
        "evaluate_target_health": ["Yes", "No"],
        "record_id": unique([r.record_id for r in records if r.record_id]),
    }


def filter_record_sets(
    db: Session,
    user: User,
    hosted_zone_id: str,
    *,
    record_type: str | None = None,
    routing_policy: str | None = None,
    alias: str | None = None,
    record_name: str | None = None,
    differentiator: str | None = None,
    value: str | None = None,
    ttl: str | None = None,
    health_check_id: str | None = None,
    evaluate_target_health: str | None = None,
    record_id: str | None = None,
    q: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[RecordSet], int]:
    from app.schemas.pagination import clamp_page, clamp_page_size, page_offset

    records = list_record_sets_for_zone(db, user, hosted_zone_id)

    def matches(record: RecordSet) -> bool:
        if record_type and record.record_type.upper() != record_type.strip().upper():
            return False
        if routing_policy and record.routing_policy != routing_policy.strip():
            return False
        if alias is not None and alias != "":
            want_alias = alias.strip().lower() in {"yes", "true", "1", "alias"}
            if record.alias != want_alias:
                return False
        if record_name and record.record_name != record_name.strip():
            return False
        if differentiator is not None and differentiator != "":
            if (record.differentiator or "") != differentiator.strip():
                return False
        if value and value.strip():
            needle = value.strip().lower()
            if not any(needle in line.lower() for line in (record.value or [])):
                return False
        if ttl is not None and ttl != "":
            try:
                if record.ttl != int(ttl):
                    return False
            except ValueError:
                return False
        if health_check_id is not None and health_check_id != "":
            if (record.health_check_id or "") != health_check_id.strip():
                return False
        if evaluate_target_health is not None and evaluate_target_health != "":
            want = evaluate_target_health.strip().lower() in {
                "yes",
                "true",
                "1",
            }
            if record.evaluate_target_health != want:
                return False
        if record_id is not None and record_id != "":
            if (record.record_id or "") != record_id.strip():
                return False
        if q and q.strip():
            term = q.strip().lower()
            haystacks = [
                record.record_name,
                record.record_type,
                record.routing_policy,
                record.differentiator or "",
                "Yes" if record.alias else "No",
                " ".join(record.value or []),
                str(record.ttl),
                record.health_check_id or "",
                "Yes" if record.evaluate_target_health else "No",
                record.record_id or "",
            ]
            if not any(term in h.lower() for h in haystacks):
                return False
        return True

    filtered = [r for r in records if matches(r)]
    total = len(filtered)
    p = clamp_page(page)
    size = clamp_page_size(page_size)
    start = page_offset(p, size)
    return filtered[start : start + size], total


def create_record_set(
    db: Session, user: User, hosted_zone_id: str, payload: RecordSetCreate
) -> RecordSet:
    zone = _get_zone_for_user(db, user, hosted_zone_id)
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


PROTECTED_TYPES = frozenset({"NS", "SOA"})


def delete_record_set(
    db: Session, user: User, hosted_zone_id: str, record_pk: int
) -> None:
    zone = _get_zone_for_user(db, user, hosted_zone_id)
    record = (
        db.query(RecordSet)
        .filter(
            RecordSet.id == record_pk,
            RecordSet.hosted_zone_id == zone.id,
        )
        .first()
    )
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found",
        )

    record_type = (record.record_type or "").upper()
    if record_type in PROTECTED_TYPES and record.record_name == zone.domain_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Default {record_type} records cannot be deleted. "
                "Delete all other records first, then delete the hosted zone."
            ),
        )

    db.delete(record)
    db.flush()
    zone.record_count = (
        db.query(RecordSet).filter(RecordSet.hosted_zone_id == zone.id).count()
    )
    db.commit()
