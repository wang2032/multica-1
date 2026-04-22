from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from database import engine, Base
from routers import topics, news
from scraper import run_scrape


scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    scheduler.add_job(run_scrape, "interval", minutes=30, id="news_scraper")
    scheduler.start()
    yield
    # Shutdown
    scheduler.shutdown()


app = FastAPI(title="News Tracker API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(topics.router, prefix="/api/topics", tags=["topics"])
app.include_router(news.router, prefix="/api/news", tags=["news"])


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/scrape")
async def trigger_scrape():
    """Manually trigger a scrape of all enabled topics."""
    await run_scrape()
    return {"status": "scrape triggered"}