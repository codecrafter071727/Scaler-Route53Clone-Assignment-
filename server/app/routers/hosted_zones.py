from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps.auth import get_current_user
from app.models import User
from app.schemas.hosted_zone import (
    HostedZoneCreate,
    HostedZoneListItem,
    HostedZoneRead,
    HostedZoneUpdate,
    TagItem,
)
from app.schemas.pagination import (
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    Paginated,
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


@router.get("", response_model=Paginated[HostedZoneListItem])
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
    page: int = Query(default=DEFAULT_PAGE, ge=1),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
) -> Paginated[HostedZoneListItem]:
    zones, total = zone_service.list_hosted_zones_for_user(
        db,
        user,
        domain_name=domain_name,
        zone_type=zone_type,
        created_by=created_by,
        record_count=record_count,
        description=description,
        hosted_zone_id=hosted_zone_id,
        q=q,
        page=page,
        page_size=page_size,
    )
    return Paginated[HostedZoneListItem].from_items(
        [HostedZoneListItem.model_validate(z) for z in zones],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/filter-options")
def list_filter_options(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict[str, list[str]]:
    return zone_service.list_filter_options_for_user(db, user)


@router.get("/{hosted_zone_id}/tags", response_model=list[TagItem])
def list_zone_tags(
    hosted_zone_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[TagItem]:
    tags = zone_service.list_hosted_zone_tags_for_user(db, user, hosted_zone_id)
    return [TagItem.model_validate(t) for t in tags]


@router.get("/{hosted_zone_id}/record-sets", response_model=Paginated[RecordSetRead])
def list_zone_record_sets(
    hosted_zone_id: str,
    record_type: str | None = Query(default=None, alias="type"),
    routing_policy: str | None = Query(default=None),
    alias: str | None = Query(default=None),
    record_name: str | None = Query(default=None),
    differentiator: str | None = Query(default=None),
    value: str | None = Query(default=None),
    ttl: str | None = Query(default=None),
    health_check_id: str | None = Query(default=None),
    evaluate_target_health: str | None = Query(default=None),
    record_id: str | None = Query(default=None),
    q: str | None = Query(default=None),
    page: int = Query(default=DEFAULT_PAGE, ge=1),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Paginated[RecordSetRead]:
    records, total = record_service.filter_record_sets(
        db,
        user,
        hosted_zone_id,
        record_type=record_type,
        routing_policy=routing_policy,
        alias=alias,
        record_name=record_name,
        differentiator=differentiator,
        value=value,
        ttl=ttl,
        health_check_id=health_check_id,
        evaluate_target_health=evaluate_target_health,
        record_id=record_id,
        q=q,
        page=page,
        page_size=page_size,
    )
    return Paginated[RecordSetRead].from_items(
        [RecordSetRead.model_validate(r) for r in records],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{hosted_zone_id}/record-sets/filter-options")
def list_zone_record_set_filter_options(
    hosted_zone_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict[str, list[str]]:
    return record_service.list_record_set_filter_options(db, user, hosted_zone_id)


@router.post(
    "/{hosted_zone_id}/record-sets",
    response_model=RecordSetRead,
    status_code=status.HTTP_201_CREATED,
)
def create_zone_record_set(
    hosted_zone_id: str,
    payload: RecordSetCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> RecordSetRead:
    record = record_service.create_record_set(db, user, hosted_zone_id, payload)
    return RecordSetRead.model_validate(record)


@router.delete(
    "/{hosted_zone_id}/record-sets/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_zone_record_set(
    hosted_zone_id: str,
    record_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> None:
    record_service.delete_record_set(db, user, hosted_zone_id, record_id)


@router.get("/{hosted_zone_id}", response_model=HostedZoneRead)
def get_zone(
    hosted_zone_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HostedZoneRead:
    zone = zone_service.get_hosted_zone_for_user(db, user, hosted_zone_id)
    return HostedZoneRead.model_validate(zone)


@router.patch("/{hosted_zone_id}", response_model=HostedZoneRead)
def update_zone(
    hosted_zone_id: str,
    payload: HostedZoneUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HostedZoneRead:
    zone = zone_service.update_hosted_zone(db, user, hosted_zone_id, payload)
    return HostedZoneRead.model_validate(zone)


@router.delete("/{hosted_zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_zone(
    hosted_zone_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> None:
    zone_service.delete_hosted_zone(db, user, hosted_zone_id)
