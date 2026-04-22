import type { Topic, Article } from './types';

const API_BASE = 'http://localhost:8000/api';

export async function fetchTopics(enabled?: boolean): Promise<Topic[]> {
  const url = enabled !== undefined
    ? `${API_BASE}/topics?enabled=${enabled}`
    : `${API_BASE}/topics`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}

export async function createTopic(data: { name: string; keywords: string }): Promise<Topic> {
  const res = await fetch(`${API_BASE}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create topic');
  return res.json();
}

export async function updateTopic(id: number, data: Partial<Topic>): Promise<Topic> {
  const res = await fetch(`${API_BASE}/topics/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update topic');
  return res.json();
}

export async function deleteTopic(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/topics/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete topic');
}

export async function fetchNews(topicId?: number, keyword?: string): Promise<Article[]> {
  const params = new URLSearchParams();
  if (topicId) params.set('topic_id', String(topicId));
  if (keyword) params.set('keyword', keyword);
  const url = `${API_BASE}/news${params.size ? '?' + params.toString() : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}

export async function triggerScrape(): Promise<void> {
  const res = await fetch(`${API_BASE}/scrape`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger scrape');
}