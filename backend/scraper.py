import httpx
from datetime import datetime
from sqlalchemy import select
import os
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

from database import async_session
from models import Topic, Article


class NewsScraper:
    def __init__(self):
        self.api_key = os.getenv("NEWSAPI_KEY")
        self.base_url = "https://newsapi.org/v2/everything"

    async def fetch_news_for_topic(self, topic: Topic) -> list[dict]:
        """Fetch news articles for a topic based on its keywords."""
        if not self.api_key:
            return self._fetch_mock_data(topic)

        keywords = topic.keywords.replace(",", " OR ")
        params = {
            "q": keywords,
            "apiKey": self.api_key,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 20,
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url, params=params, timeout=30)
                data = response.json()

                if data.get("status") == "ok":
                    articles = []
                    for item in data.get("articles", []):
                        articles.append({
                            "title": item.get("title", ""),
                            "url": item.get("url", ""),
                            "source": item.get("source", {}).get("name"),
                            "description": item.get("description"),
                            "published_at": item.get("publishedAt"),
                        })
                    return articles
        except Exception as e:
            print(f"Error fetching news for {topic.name}: {e}")

        return self._fetch_mock_data(topic)

    def _fetch_mock_data(self, topic: Topic) -> list[dict]:
        """Return mock data when no API key is available."""
        return [
            {
                "title": f"Sample article about {topic.name}",
                "url": "https://example.com/article1",
                "source": "Example News",
                "description": f"Latest news related to {topic.keywords}",
                "published_at": datetime.utcnow().isoformat(),
            },
            {
                "title": f"Updates on {topic.name} - Industry trends",
                "url": "https://example.com/article2",
                "source": "Tech Daily",
                "description": f"Comprehensive coverage of {topic.keywords}",
                "published_at": datetime.utcnow().isoformat(),
            },
        ]

    async def save_articles(self, topic_id: int, articles: list[dict]):
        """Save articles to database, avoiding duplicates by URL."""
        async with async_session() as session:
            for article_data in articles:
                existing = await session.execute(
                    select(Article).where(
                        Article.topic_id == topic_id,
                        Article.url == article_data["url"]
                    )
                )
                if existing.fetchone():
                    continue

                published_at = None
                if article_data.get("published_at"):
                    try:
                        published_at = datetime.fromisoformat(
                            article_data["published_at"].replace("Z", "+00:00")
                        )
                    except ValueError:
                        pass

                article = Article(
                    topic_id=topic_id,
                    title=article_data["title"],
                    url=article_data["url"],
                    source=article_data.get("source"),
                    description=article_data.get("description"),
                    published_at=published_at,
                )
                session.add(article)

            await session.commit()


async def run_scrape():
    """Main function to scrape all enabled topics."""
    scraper = NewsScraper()

    async with async_session() as session:
        result = await session.execute(
            select(Topic).where(Topic.enabled == True)
        )
        topics = result.scalars().all()

    for topic in topics:
        articles = await scraper.fetch_news_for_topic(topic)
        if articles:
            await scraper.save_articles(topic.id, articles)
            print(f"Fetched {len(articles)} articles for topic: {topic.name}")
        else:
            print(f"No articles found for topic: {topic.name}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(run_scrape())