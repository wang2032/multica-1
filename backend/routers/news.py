from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from database import async_session
from models import Article, Topic

router = APIRouter()


class ArticleResponse(BaseModel):
    id: int
    topic_id: int
    title: str
    url: str
    source: Optional[str]
    description: Optional[str]
    published_at: Optional[datetime]
    fetched_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=list[ArticleResponse])
async def list_news(
    topic_id: Optional[int] = None,
    keyword: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
):
    async with async_session() as session:
        query = Article.__table__.select()

        if topic_id is not None:
            query = query.where(Article.topic_id == topic_id)

        if keyword:
            query = query.where(Article.title.like(f"%{keyword}%"))

        query = query.order_by(Article.published_at.desc()).limit(limit).offset(offset)

        result = await session.execute(query)
        articles = result.fetchall()
        return [ArticleResponse.model_validate(a) for a in articles]


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: int):
    async with async_session() as session:
        result = await session.get(Article, article_id)
        if not result:
            raise HTTPException(status_code=404, detail="Article not found")
        return result