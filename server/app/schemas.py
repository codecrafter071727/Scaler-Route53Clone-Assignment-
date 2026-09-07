from pydantic import BaseModel, ConfigDict, Field


class ItemBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)


class ItemCreate(ItemBase):
    pass


class ItemRead(ItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
