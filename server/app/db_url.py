"""Resolve DATABASE_URL so SQLite always uses a stable on-disk path."""

from __future__ import annotations

import shutil
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = SERVER_DIR / "data"
DEFAULT_SQLITE_PATH = DATA_DIR / "app.db"


def resolve_database_url(url: str) -> str:
    """Pin relative SQLite paths under server/data so restarts keep the same file.

    Relative paths like sqlite:///./app.db depend on process CWD and often create
    a new empty DB after deploy or when uvicorn is started from another folder.
    Non-SQLite URLs (e.g. Postgres) are returned unchanged.
    """
    if not url.startswith("sqlite:"):
        return url

    path = _sqlite_path_from_url(url)
    path.parent.mkdir(parents=True, exist_ok=True)
    _migrate_legacy_sqlite(path)
    return f"sqlite:///{path.resolve().as_posix()}"


def _sqlite_path_from_url(url: str) -> Path:
    # sqlite:///relative  |  sqlite:////absolute  |  sqlite:///C:/abs (Windows)
    if url.startswith("sqlite:////"):
        return Path("/" + url.removeprefix("sqlite:////"))

    rest = url.removeprefix("sqlite:///")
    if rest in ("", ".", "./app.db", "app.db"):
        return DEFAULT_SQLITE_PATH

    candidate = Path(rest)
    if candidate.is_absolute():
        return candidate

    # Paths like ./data/app.db stay under the server package root
    return (SERVER_DIR / rest).resolve()


def _migrate_legacy_sqlite(target: Path) -> None:
    """Copy server/app.db into data/ once so existing local data is kept."""
    legacy = SERVER_DIR / "app.db"
    if target.exists() or not legacy.is_file():
        return
    if legacy.resolve() == target.resolve():
        return
    try:
        shutil.move(str(legacy), str(target))
    except OSError:
        # File may be locked by a running uvicorn; keep a durable copy instead.
        shutil.copy2(str(legacy), str(target))
