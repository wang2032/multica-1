export interface Topic {
  id: number;
  name: string;
  keywords: string;
  enabled: boolean;
  created_at: string;
}

export interface Article {
  id: number;
  topic_id: number;
  title: string;
  url: string;
  source: string | null;
  description: string | null;
  published_at: string | null;
  fetched_at: string;
}