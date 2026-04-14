from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def utcnow() -> datetime:
  return datetime.now(timezone.utc)


class Customer(Base):
  __tablename__ = 'customers'

  id: Mapped[int] = mapped_column(primary_key=True)
  full_name: Mapped[str] = mapped_column(String(255), nullable=False)
  email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
  phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
  address_line: Mapped[str] = mapped_column(String(255), nullable=False)
  city: Mapped[str] = mapped_column(String(120), nullable=False)
  postal_code: Mapped[str] = mapped_column(String(32), nullable=False)
  province: Mapped[str] = mapped_column(String(120), nullable=False)
  notes: Mapped[str | None] = mapped_column(Text, nullable=True)
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
  updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

  orders = relationship('Order', back_populates='customer')
