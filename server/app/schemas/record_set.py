from pydantic import BaseModel, ConfigDict, Field


class RecordSetCreate(BaseModel):
    record_name: str = Field(min_length=1, max_length=255)
    record_type: str = Field(min_length=1, max_length=32)
    routing_policy: str = Field(default="Simple", max_length=64)
    differentiator: str | None = Field(default=None, max_length=255)
    alias: bool = False
    value: list[str] = Field(default_factory=list)
    ttl: int = Field(default=300, ge=0)
    health_check_id: str | None = Field(default=None, max_length=128)
    evaluate_target_health: bool = False
    record_id: str | None = Field(default=None, max_length=128)


class RecordSetRead(BaseModel):
    id: int
    record_name: str
    record_type: str
    routing_policy: str
    differentiator: str | None = None
    alias: bool
    value: list[str] = Field(default_factory=list)
    ttl: int
    health_check_id: str | None = None
    evaluate_target_health: bool = False
    record_id: str | None = None

    model_config = ConfigDict(from_attributes=True)
