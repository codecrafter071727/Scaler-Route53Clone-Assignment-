"""Shared list pagination helpers."""

from __future__ import annotations

from math import ceil
from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


def clamp_page(page: int) -> int:
    return max(DEFAULT_PAGE, page)


def clamp_page_size(page_size: int) -> int:
    return min(MAX_PAGE_SIZE, max(1, page_size))


def page_offset(page: int, page_size: int) -> int:
    return (clamp_page(page) - 1) * clamp_page_size(page_size)


class PageMeta(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int


class Paginated(BaseModel, Generic[T]):
    items: list[T]
    page: int = Field(..., ge=1)
    page_size: int = Field(..., ge=1)
    total: int = Field(..., ge=0)
    total_pages: int = Field(..., ge=0)

    @classmethod
    def from_items(
        cls,
        items: list[T],
        *,
        total: int,
        page: int,
        page_size: int,
    ) -> "Paginated[T]":
        p = clamp_page(page)
        size = clamp_page_size(page_size)
        pages = ceil(total / size) if total > 0 else 0
        return cls(
            items=items,
            page=p,
            page_size=size,
            total=total,
            total_pages=pages,
        )
