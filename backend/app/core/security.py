from __future__ import annotations

import hmac
import hashlib


def constant_time_compare(val1: str, val2: str) -> bool:
    """Safe string comparison to prevent timing attacks."""
    return hmac.compare_digest(val1.encode(), val2.encode())
