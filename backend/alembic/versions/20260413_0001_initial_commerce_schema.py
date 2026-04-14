"""Initial commerce schema.

Revision ID: 20260413_0001
Revises: None
Create Date: 2026-04-13 21:45:00
"""

from alembic import op
import sqlalchemy as sa


revision = '20260413_0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
  op.create_table(
    'customers',
    sa.Column('id', sa.Integer(), primary_key=True),
    sa.Column('full_name', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('phone', sa.String(length=50), nullable=True),
    sa.Column('address_line', sa.String(length=255), nullable=False),
    sa.Column('city', sa.String(length=120), nullable=False),
    sa.Column('postal_code', sa.String(length=32), nullable=False),
    sa.Column('province', sa.String(length=120), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
  )
  op.create_index('ix_customers_email', 'customers', ['email'], unique=True)

  op.create_table(
    'orders',
    sa.Column('id', sa.Integer(), primary_key=True),
    sa.Column('reference', sa.String(length=64), nullable=False),
    sa.Column('customer_id', sa.Integer(), nullable=False),
    sa.Column('stripe_session_id', sa.String(length=255), nullable=False),
    sa.Column('stripe_payment_intent_id', sa.String(length=255), nullable=True),
    sa.Column('amount_total', sa.Integer(), nullable=False),
    sa.Column('currency', sa.String(length=8), nullable=False),
    sa.Column('status', sa.String(length=32), nullable=False),
    sa.Column('notification_sent_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ondelete='RESTRICT'),
    sa.UniqueConstraint('reference', name='uq_orders_reference'),
    sa.UniqueConstraint('stripe_payment_intent_id'),
    sa.UniqueConstraint('stripe_session_id', name='uq_orders_stripe_session_id'),
  )
  op.create_index('ix_orders_customer_id', 'orders', ['customer_id'], unique=False)
  op.create_index('ix_orders_reference', 'orders', ['reference'], unique=False)
  op.create_index('ix_orders_status', 'orders', ['status'], unique=False)
  op.create_index('ix_orders_stripe_session_id', 'orders', ['stripe_session_id'], unique=False)

  op.create_table(
    'order_items',
    sa.Column('id', sa.Integer(), primary_key=True),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.String(length=120), nullable=True),
    sa.Column('product_name', sa.String(length=255), nullable=False),
    sa.Column('unit_price', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('subtotal', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
  )
  op.create_index('ix_order_items_order_id', 'order_items', ['order_id'], unique=False)


def downgrade() -> None:
  op.drop_index('ix_order_items_order_id', table_name='order_items')
  op.drop_table('order_items')

  op.drop_index('ix_orders_stripe_session_id', table_name='orders')
  op.drop_index('ix_orders_status', table_name='orders')
  op.drop_index('ix_orders_reference', table_name='orders')
  op.drop_index('ix_orders_customer_id', table_name='orders')
  op.drop_table('orders')

  op.drop_index('ix_customers_email', table_name='customers')
  op.drop_table('customers')
