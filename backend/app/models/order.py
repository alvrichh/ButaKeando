from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def utcnow() -> datetime:
  return datetime.now(timezone.utc)


class Order(Base):
  __tablename__ = 'orders'
  __table_args__ = (
    UniqueConstraint('stripe_session_id', name='uq_orders_stripe_session_id'),
    UniqueConstraint('reference', name='uq_orders_reference'),
  )

  id: Mapped[int] = mapped_column(primary_key=True)
  reference: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
  customer_id: Mapped[int] = mapped_column(ForeignKey('customers.id', ondelete='RESTRICT'), nullable=False, index=True)
  stripe_session_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
  stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(255), nullable=True, unique=True)
  amount_total: Mapped[int] = mapped_column(Integer, nullable=False)
  currency: Mapped[str] = mapped_column(String(8), nullable=False)
  status: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
  notification_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

  customer = relationship('Customer', back_populates='orders')
  items = relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')


class OrderItem(Base):
  __tablename__ = 'order_items'

  id: Mapped[int] = mapped_column(primary_key=True)
  order_id: Mapped[int] = mapped_column(ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
  product_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
  product_name: Mapped[str] = mapped_column(String(255), nullable=False)
  unit_price: Mapped[int] = mapped_column(Integer, nullable=False)
  quantity: Mapped[int] = mapped_column(Integer, nullable=False)
  subtotal: Mapped[int] = mapped_column(Integer, nullable=False)
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

  order = relationship('Order', back_populates='items')
