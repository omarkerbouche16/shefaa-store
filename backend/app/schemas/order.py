from __future__ import annotations

from pydantic import BaseModel, field_validator, model_validator


class OfferSchema(BaseModel):
    pieces: int
    priceDa: int
    label: str


class CartItemSchema(BaseModel):
    productId: str
    slug: str
    name: str
    image: str
    offer: OfferSchema
    quantity: int = 1
    source: str


class UpsellSchema(BaseModel):
    productId: str
    priceDa: int
    accepted: bool


class CreateOrderRequest(BaseModel):
    customerName: str
    phoneLocal: str
    phoneE164: str
    items: list[CartItemSchema]
    subtotalDa: int
    upsell: UpsellSchema | None = None
    utm: dict[str, str | None] = {}
    landingPage: str = ""
    eventIds: dict[str, str] = {}

    @field_validator("customerName")
    @classmethod
    def validate_customer_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2 or len(v) > 80:
            raise ValueError("اسم العميل يجب أن يكون بين 2 و80 حرفاً")
        return v

    @field_validator("items")
    @classmethod
    def validate_items_non_empty(cls, v: list[CartItemSchema]) -> list[CartItemSchema]:
        if not v:
            raise ValueError("يجب أن تحتوي الطلبية على منتج واحد على الأقل")
        return v


class OrderResponse(BaseModel):
    orderId: str
    status: str
    totalDa: int
    message: str
