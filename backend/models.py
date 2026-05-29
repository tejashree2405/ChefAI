from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    JSON,
    ForeignKey,
    DateTime
)

from datetime import datetime

from database import Base


class Recipe(Base):

    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    description = Column(Text)

    recipe_data = Column(JSON)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


class ChatMessage(Base):

    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    role = Column(String)

    content = Column(Text)

    recipe_id = Column(
        Integer,
        ForeignKey("recipes.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )