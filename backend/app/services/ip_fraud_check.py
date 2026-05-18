from __future__ import annotations

import logging
from dataclasses import dataclass, field

import geoip2.errors
import geoip2.webservice
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

VALID_COUNTRY = "DZ"  # Algeria


@dataclass
class FraudCheckResult:
    allowed: bool
    reason: str
    country: str = ""
    is_vpn: bool = False
    is_proxy: bool = False


def _is_whitelisted_phone(phone: str) -> bool:
    whitelist = [p.strip() for p in settings.WHITELISTED_PHONES.split(",") if p.strip()]
    normalized = phone.lstrip("0").lstrip("+213")
    for w in whitelist:
        if normalized == w.lstrip("0") or phone == w:
            return True
    return False


async def check_ip_fraud(ip: str, phone: str = "") -> FraudCheckResult:
    """
    Allow request only if:
      1. IP resolves to Algeria (DZ)
      2. IP is not a VPN / proxy / Tor exit node
    Whitelisted phones bypass this check entirely.
    """
    if phone and _is_whitelisted_phone(phone):
        logger.debug("IP check bypassed for whitelisted phone %s", phone)
        return FraudCheckResult(allowed=True, reason="whitelisted_phone")

    if not ip:
        return FraudCheckResult(allowed=False, reason="IP address missing")

    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        logger.warning("MaxMind not configured — IP check skipped (dev mode)")
        return FraudCheckResult(allowed=True, reason="maxmind_not_configured")

    try:
        async with geoip2.webservice.AsyncClient(
            int(settings.MAXMIND_ACCOUNT_ID),
            settings.MAXMIND_LICENSE_KEY,
            host="geolite.info",
        ) as client:
            country_code, is_vpn, is_proxy = await _query_maxmind(client, ip)

        # Second-pass VPN check via IPQS when insights aren't available
        if not is_vpn and not is_proxy:
            is_vpn = await _check_vpn_ipqs(ip)

        if country_code != VALID_COUNTRY:
            return FraudCheckResult(
                allowed=False,
                reason=f"الطلبية متاحة للجزائر فقط ({country_code or 'unknown'})",
                country=country_code,
                is_vpn=is_vpn,
                is_proxy=is_proxy,
            )

        if is_vpn or is_proxy:
            return FraudCheckResult(
                allowed=False,
                reason="تم رفض الطلب بسبب استخدام VPN أو Proxy",
                country=country_code,
                is_vpn=is_vpn,
                is_proxy=is_proxy,
            )

        return FraudCheckResult(
            allowed=True,
            reason="ok",
            country=country_code,
        )

    except geoip2.errors.AddressNotFoundError:
        return FraudCheckResult(allowed=False, reason="عنوان IP غير معروف")
    except Exception as exc:
        logger.error("MaxMind IP check failed for %s: %s", ip, exc)
        if settings.ENVIRONMENT == "production":
            return FraudCheckResult(allowed=False, reason="خطأ في التحقق من الموقع الجغرافي")
        # In dev/staging fail open so local testing still works
        return FraudCheckResult(allowed=True, reason="maxmind_error_dev_passthrough")


async def _query_maxmind(
    client: geoip2.webservice.AsyncClient,
    ip: str,
) -> tuple[str, bool, bool]:
    """
    Try the Insights endpoint first (includes VPN/proxy traits).
    Fall back to Country endpoint if Insights is not in the subscription plan.
    Returns (country_code, is_vpn, is_proxy).
    """
    try:
        record = await client.insights(ip)
        traits = record.traits
        is_vpn = bool(
            getattr(traits, "is_anonymous_vpn", False)
            or getattr(traits, "is_anonymous", False)
        )
        is_proxy = bool(
            getattr(traits, "is_hosting_provider", False)
            or getattr(traits, "is_public_proxy", False)
            or getattr(traits, "is_tor", False)
            or getattr(traits, "is_residential_proxy", False)
        )
        return record.country.iso_code or "", is_vpn, is_proxy
    except geoip2.errors.GeoIP2Error:
        # Insights not available on this plan — fall back to Country
        record = await client.country(ip)
        return record.country.iso_code or "", False, False


async def _check_vpn_ipqs(ip: str) -> bool:
    """IP Quality Score VPN/proxy check (second-pass verification)."""
    api_key = settings.IPQS_API_KEY
    if not api_key:
        return False
    try:
        url = f"https://ipqualityscore.com/api/json/ip/{api_key}/{ip}"
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url, params={"strictness": 1, "allow_public_access_points": True})
            if resp.status_code == 200:
                data = resp.json()
                return bool(data.get("vpn") or data.get("proxy") or data.get("tor"))
    except Exception as exc:
        logger.warning("IPQS check failed for %s: %s", ip, exc)
    return False
