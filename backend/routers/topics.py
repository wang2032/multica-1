from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from database import async_session
from models import Topic

router = APIRouter()


class TopicCreate(BaseModel):
    name: str
    keywords: str
    enabled: bool = True


class TopicUpdate(BaseModel):
    name: Optional[str] = None
    keywords: Optional[str] = None
    enabled: Optional[bool] = None


class TopicResponse(BaseModel):
    id: int
    name: str
    keywords: str
    enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/", response_model=TopicResponse, status_code=status.HTTP_201_CREATED)
async def create_topic(topic: TopicCreate):
    async with async_session() as session:
        existing = await session.execute(
            Topic.__table__.select().where(Topic.name == topic.name)
        )
        if existing.fetchone():
            raise HTTPException(status_code=400, detail="Topic already exists")

        db_topic = Topic(name=topic.name, keywords=topic.keywords, enabled=topic.enabled)
        session.add(db_topic)
        await session.commit()
        await session.refresh(db_topic)
        return db_topic


@router.get("/", response_model=list[TopicResponse])
async def list_topics(enabled: Optional[bool] = None):
    async with async_session() as session:
        query = Topic.__table__.select()
        if enabled is not None:
            query = query.where(Topic.enabled == enabled)
        result = await session.execute(query)
        topics = result.fetchall()
        return [TopicResponse.model_validate(t) for t in topics]


@router.get("/{topic_id}", response_model=TopicResponse)
async def get_topic(topic_id: int):
    async with async_session() as session:
        result = await session.get(Topic, topic_id)
        if not result:
            raise HTTPException(status_code=404, detail="Topic not found")
        return result


@router.patch("/{topic_id}", response_model=TopicResponse)
async def update_topic(topic_id: int, data: TopicUpdate):
    async with async_session() as session:
        topic = await session.get(Topic, topic_id)
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(topic, field, value)

        await session.commit()
        await session.refresh(topic)
        return topic


@router.delete("/{topic_id}", status_code=204)
async def delete_topic(topic_id: int):
    async with async_session() as session:
        topic = await session.get(Topic, topic_id)
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")

        await session.delete(topic)
        await session.commit()