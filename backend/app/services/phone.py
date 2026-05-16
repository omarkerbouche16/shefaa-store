from __future__ import annotations

import re

# Algerian mobile prefixes after country code: 5, 6, 7
_LOCAL_RE = re.compile(r"^0([567]\d{8})$")
_INTL_RE = re.compile(r"^(?:\+?213|00213)([567]\d{8})$")


def _extract_subscriber(raw: str) -> str:
    """Return the 9-digit subscriber number or raise ValueError."""
    raw = raw.strip().replace(" ", "").replace("-", "")
    m = _LOCAL_RE.match(raw)
    if m:
        return m.group(1)
    m = _INTL_RE.match(raw)
    if m:
        return m.group(1)
    raise ValueError(
        f"رقم الهاتف غير صالح. يجب أن يكون رقم جزائري مثل 05XXXXXXXX أو +213XXXXXXXXX"
    )


def normalize_local(raw: str) -> str:
    """Return 0XXXXXXXXX (10 digits)."""
    return "0" + _extract_subscriber(raw)


def normalize_e164(raw: str) -> str:
    """Return +213XXXXXXXXX."""
    return "+213" + _extract_subscriber(raw)


def normalize_capi_numeric(raw: str) -> str:
    """Return 213XXXXXXXXX (no +)."""
    return "213" + _extract_subscriber(raw)


def parse_phone(raw: str) -> tuple[str, str, str]:
    """
    Return (local, e164, capi_numeric).
    Raises ValueError if phone is invalid.
    """
    sub = _extract_subscriber(raw)
    return "0" + sub, "+213" + sub, "213" + sub
