from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RecordSet(Base):
    __tablename__ = "record_sets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    hosted_zone_id: Mapped[int] = mapped_column(
        ForeignKey("hosted_zones.id", ondelete="CASCADE"), index=True, nullable=False
    )
    record_name: Mapped[str] = mapped_column(String(255), nullable=False)
    record_type: Mapped[str] = mapped_column(String(32), nullable=False)
    routing_policy: Mapped[str] = mapped_column(String(64), nullable=False, default="Simple")
    differentiator: Mapped[str | None] = mapped_column(String(255), nullable=True)
    alias: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    value: Mapped[list[Any]] = mapped_column(
        JSON, nullable=False, default=list, server_default=text("'[]'")
    )
    ttl: Mapped[int] = mapped_column(Integer, nullable=False, default=300)
    health_check_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    evaluate_target_health: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )
    record_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    hosted_zone = relationship("HostedZone", back_populates="record_sets")
