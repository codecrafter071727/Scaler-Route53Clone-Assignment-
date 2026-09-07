from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class HostedZone(Base):
    """Single table — VPCs and tags stored as JSON addon sections."""

    __tablename__ = "hosted_zones"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    hosted_zone_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    domain_name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    zone_type: Mapped[str] = mapped_column(String(16), nullable=False)  # public | private
    record_count: Mapped[int] = mapped_column(Integer, nullable=False, default=2)
    created_by: Mapped[str] = mapped_column(String(255), nullable=False)
    # Addon sections — always on this table (empty list when unused)
    vpcs: Mapped[list[dict[str, Any]]] = mapped_column(
        JSON, nullable=False, default=list, server_default=text("'[]'")
    )
    tags: Mapped[list[dict[str, Any]]] = mapped_column(
        JSON, nullable=False, default=list, server_default=text("'[]'")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    record_sets = relationship(
        "RecordSet",
        back_populates="hosted_zone",
        cascade="all, delete-orphan",
    )
