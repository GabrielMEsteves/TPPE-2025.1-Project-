"""add numero_assento and tipo_assento to passagem

Revision ID: 12e341fdbbd0
Revises: 99448895e7ee
Create Date: 2025-07-16 10:44:57.506786

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '12e341fdbbd0'
down_revision: Union[str, Sequence[str], None] = '99448895e7ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('passagens', sa.Column('numero_assento', sa.String(), nullable=True))
    op.add_column('passagens', sa.Column('tipo_assento', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('passagens', 'numero_assento')
    op.drop_column('passagens', 'tipo_assento')
