from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps.auth import get_current_user
from app.models import User
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneListItem, HostedZoneRead
from app.services import hosted_zones as zone_service

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
) -> list[HostedZoneListItem]:
    zones = zone_service.list_hosted_zones_for_user(db, user)
    return [HostedZoneListItem.model_validate(z) for z in zones]


@router.get("/{zone_id}", response_model=HostedZoneRead)
def get_zone(
    zone_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HostedZoneRead:
    zone = zone_service.get_hosted_zone_for_user(db, user, zone_id)
    return HostedZoneRead.model_validate(zone)
