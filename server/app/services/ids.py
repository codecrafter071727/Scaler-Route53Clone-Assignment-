"""AWS-style public identifiers."""

from __future__ import annotations

import secrets
import string


def generate_account_id() -> str:
    """12-digit AWS account id lookalike (leading digit 1–9)."""
    first = str(secrets.randbelow(9) + 1)
    rest = "".join(str(secrets.randbelow(10)) for _ in range(11))
    return first + rest


def generate_hosted_zone_id() -> str:
    """Route 53 HostedZoneId lookalike, e.g. Z3AADJGX04AX89."""
    alphabet = string.ascii_uppercase + string.digits
    return "Z" + "".join(secrets.choice(alphabet) for _ in range(13))
