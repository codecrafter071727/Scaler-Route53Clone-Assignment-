from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class VpcAssociation(BaseModel):
    region: str = Field(default="", max_length=128)
    vpc_id: str = Field(default="", max_length=128)

    @field_validator("region", "vpc_id")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class TagItem(BaseModel):
    key: str = Field(..., min_length=1, max_length=128)
    value: str = Field(default="", max_length=256)

    @field_validator("key", "value")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class HostedZoneCreate(BaseModel):
    domain_name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(default="", max_length=256)
    zone_type: Literal["public", "private"]
    vpcs: list[VpcAssociation] = Field(default_factory=list)
    tags: list[TagItem] = Field(default_factory=list, max_length=50)

    @field_validator("domain_name")
    @classmethod
    def domain_required(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Domain name is required")
        return cleaned

    @field_validator("description")
    @classmethod
    def description_trim(cls, value: str) -> str:
        return value.strip()

    @model_validator(mode="after")
    def validate_addons(self) -> "HostedZoneCreate":
        if self.zone_type == "private":
            filled = [v for v in self.vpcs if v.region and v.vpc_id]
            if not filled:
                raise ValueError(
                    "Private hosted zones require at least one VPC with region and VPC ID"
                )
            vpc_ids = [v.vpc_id.lower() for v in filled]
            if len(vpc_ids) != len(set(vpc_ids)):
                raise ValueError("Each VPC ID must be unique")
            self.vpcs = filled
        else:
            self.vpcs = []
        self.tags = [t for t in self.tags if t.key]
        return self


class HostedZoneUpdate(BaseModel):
    description: str = Field(default="", max_length=256)
    vpcs: list[VpcAssociation] = Field(default_factory=list)
    tags: list[TagItem] = Field(default_factory=list, max_length=50)

    @field_validator("description")
    @classmethod
    def description_trim(cls, value: str) -> str:
        return value.strip()

    @model_validator(mode="after")
    def validate_addons(self) -> "HostedZoneUpdate":
        filled = [v for v in self.vpcs if v.region and v.vpc_id]
        vpc_ids = [v.vpc_id.lower() for v in filled]
        if len(vpc_ids) != len(set(vpc_ids)):
            raise ValueError("Each VPC ID must be unique")
        self.vpcs = filled
        self.tags = [t for t in self.tags if t.key]
        return self


class HostedZoneRead(BaseModel):
    id: int
    hosted_zone_id: str
    domain_name: str
    description: str
    zone_type: Literal["public", "private"]
    record_count: int
    created_by: str
    user_id: int
    vpcs: list[VpcAssociation]
    tags: list[TagItem]

    model_config = ConfigDict(from_attributes=True)


class HostedZoneListItem(BaseModel):
    id: int
    hosted_zone_id: str
    domain_name: str
    description: str
    zone_type: Literal["public", "private"]
    record_count: int
    created_by: str

    model_config = ConfigDict(from_attributes=True)
