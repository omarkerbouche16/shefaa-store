from __future__ import annotations

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

PRODUCT_PRICES: dict[str, dict[int, int]] = {
    "biotin-gummies":  {1: 1999, 2: 2790, 3: 3490},
    "marine-collagen": {1: 1999, 2: 2790, 3: 3490},
    "honey-nuts":      {1: 1999, 2: 2790, 3: 3490},
    "shea-butter":     {1: 1999, 2: 2790, 3: 3490},
    "argan-oil":       {1: 1999, 2: 2790, 3: 3490},
    "sesame-seeds":    {1: 1999, 2: 2790, 3: 3490},
    "desert-herbs":    {1: 1999, 2: 2790, 3: 3490},
    "ashwagandha":     {1: 1999, 2: 2790, 3: 3490},
}

PRODUCT_SKUS: dict[str, str] = {
    "biotin-gummies":  "SHF-BTN-001",
    "marine-collagen": "SHF-MCL-002",
    "honey-nuts":      "SHF-HNY-003",
    "shea-butter":     "SHF-SHB-004",
    "argan-oil":       "SHF-ARG-005",
    "sesame-seeds":    "SHF-SES-006",
    "desert-herbs":    "SHF-HRB-007",
    "ashwagandha":     "SHF-ASH-008",
}

UPSELL_PRICE: int = 999
VALID_PRODUCT_IDS: set[str] = set(PRODUCT_PRICES.keys())


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "Shefaa API"
    BACKEND_CORS_ORIGINS: list[str] = ["https://shefaa.shop", "http://localhost:3000"]
    DATABASE_URL: str = ""
    GOOGLE_SHEET_WEBHOOK_URL: str = ""
    META_PIXEL_ID: str = ""
    META_ACCESS_TOKEN: str = ""
    META_TEST_EVENT_CODE: str = ""
    TIKTOK_PIXEL_CODE: str = ""
    TIKTOK_ACCESS_TOKEN: str = ""
    SNAP_PIXEL_ID: str = ""
    SNAP_ACCESS_TOKEN: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # MaxMind GeoIP2 web service
    MAXMIND_ACCOUNT_ID: str = ""
    MAXMIND_LICENSE_KEY: str = ""

    # Comma-separated phone numbers that bypass IP fraud checks (for testing)
    WHITELISTED_PHONES: str = "055000000"

    # Second VPN detection platform (IP Quality Score)
    IPQS_API_KEY: str = ""

    # Admin dashboard credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = ""
    ADMIN_JWT_SECRET: str = "change-me-in-production"
    ADMIN_JWT_EXPIRE_HOURS: int = 8

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
