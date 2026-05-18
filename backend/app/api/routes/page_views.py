from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.page_view import PageView
from app.schemas.admin import PageViewRequest, PageViewResponse
from app.services.ip_fraud_check import check_ip_fraud

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/page-views", tags=["tracking"])


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else ""


@router.post("", response_model=PageViewResponse)
async def record_page_view(
    payload: PageViewRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> PageViewResponse:
    ip = _get_client_ip(request)
    fraud = await check_ip_fraud(ip)

    pv = PageView(
        session_id=payload.session_id,
        page_url=payload.page_url,
        product_slug=payload.product_slug,
        ip_address=ip,
        country=fraud.country,
        is_vpn=fraud.is_vpn or fraud.is_proxy,
        is_valid_algeria=fraud.allowed and fraud.country == "DZ",
        user_agent=request.headers.get("user-agent"),
        utm_json=payload.utm or {},
        referrer=payload.referrer or request.headers.get("referer"),
    )
    db.add(pv)
    await db.flush()
    logger.debug("PageView recorded: ip=%s valid_dz=%s", ip, pv.is_valid_algeria)
    return PageViewResponse(recorded=True)
