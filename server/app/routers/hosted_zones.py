from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps.auth import get_current_user
from app.models import User
from app.schemas.hosted_zone import (
    HostedZoneCreate,
    HostedZoneListItem,
    HostedZoneRead,
    TagItem,
)
from app.schemas.record_set import RecordSetCreate, RecordSetRead
from app.services import hosted_zones as zone_service
from app.services import record_sets as record_service

router = APIRouter(prefix="/hosted-zones", tags=["hosted-zones"])


@router.post("", response_model=HostedZoneRead, status_code=status.HTTP_201_CREATED)
def create_zone(
    payload: HostedZoneCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HostedZoneRead:
    zone = zone_service.create_hosted_zone(db, user, payload)
    return HostedZoneRead.model_validate(zone)


@router.get("", response_model=list[HostedZoneListItem])
def list_zones(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    domain_name: str | None = Query(default=None),
    zone_type: str | None = Query(default=None),
    created_by: str | None = Query(default=None),
    record_count: str | None = Query(default=None),
    description: str | None = Query(default=None),
    hosted_zone_id: str | None = Query(default=None),
    q: str | None = Query(default=None),
) -> list[HostedZoneListItem]:
    zones = zone_service.list_hosted_zones_for_user(
        db,
        user,
        domain_name=domain_name,
        zone_type=zone_type,
        created_by=created_by,
        record_count=record_count,
        description=description,
        hosted_zone_id=hosted_zone_id,
        q=q,
    )
    return [HostedZoneListItem.model_validate(z) for z in zones]


@router.get("/filter-options")
def list_filter_options(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict[str, list[str]]:
    return zone_service.list_filter_options_for_user(db, user)


@router.get("/{zone_id}/tags", response_model=list[TagItem])
def list_zone_tags(
    zone_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[TagItem]:
    tags = zone_service.list_hosted_zone_tags_for_user(db, user, zone_id)
    return [TagItem.model_validate(t) for t in tags]


@router.get("/{zone_id}/record-sets", response_model=list[RecordSetRead])
def list_zone_record_sets(
    zone_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[RecordSetRead]:
    records = record_service.list_record_sets_for_zone(db, user, zone_id)
    return [RecordSetRead.model_validate(r) for r in records]


@router.post(
    "/{zone_id}/record-sets",
    response_model=RecordSetRead,
    status_code=status.HTTP_201_CREATED,
)
def create_zone_record_set(
    zone_id: int,
    payload: RecordSetCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> RecordSetRead:
    record = record_service.create_record_set(db, user, zone_id, payload)
    return RecordSetRead.model_validate(record)


@router.get("/{zone_id}", response_model=HostedZoneRead)
def get_zone(
    zone_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HostedZoneRead:
    zone = zone_service.get_hosted_zone_for_user(db, user, zone_id)
    return HostedZoneRead.model_validate(zone)
