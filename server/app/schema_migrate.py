"""Lightweight SQLite column backfills (create_all does not ALTER)."""

from __future__ import annotations

from sqlalchemy import inspect, text

from app.database import engine
from app.services.ids import generate_account_id


def ensure_schema() -> None:
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return

    columns = {col["name"] for col in inspector.get_columns("users")}
    with engine.begin() as conn:
        if "account_id" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN account_id VARCHAR(12)"))

        rows = conn.execute(
            text(
                "SELECT id FROM users WHERE account_id IS NULL OR TRIM(account_id) = ''"
            )
        ).fetchall()
        for (user_id,) in rows:
            # Keep unique: regenerate on rare collision
            for _ in range(8):
                account_id = generate_account_id()
                exists = conn.execute(
                    text("SELECT 1 FROM users WHERE account_id = :a LIMIT 1"),
                    {"a": account_id},
                ).first()
                if exists is None:
                    conn.execute(
                        text("UPDATE users SET account_id = :a WHERE id = :i"),
                        {"a": account_id, "i": user_id},
                    )
                    break
