import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from app.config import settings

PHONE_RE = re.compile(r"^\+?[0-9]{10,15}$")


class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=32)
    password: str = Field(..., min_length=settings.password_min_length, max_length=128)
    confirm_password: str = Field(..., min_length=1, max_length=128)

    @field_validator("name")
    @classmethod
    def name_required(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Name is required")
        return cleaned

    @field_validator("phone")
    @classmethod
    def phone_valid(cls, value: str) -> str:
        cleaned = value.strip().replace(" ", "")
        if not PHONE_RE.match(cleaned):
            raise ValueError("Phone must be 10–15 digits (optional leading +)")
        return cleaned

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        if value.strip() != value or not value.strip():
            raise ValueError("Password cannot be empty or padded with spaces")
        return value

    @model_validator(mode="after")
    def passwords_match(self) -> "SignUpRequest":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class SignInRequest(BaseModel):
    identifier: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("identifier", "password")
    @classmethod
    def required_trimmed(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("This field is required")
        return cleaned


class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    message: str


class AuthResponse(BaseModel):
    message: str
    user: UserRead
