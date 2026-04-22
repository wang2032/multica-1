import { useState, useEffect, useCallback } from 'react'
import type { Topic, Article } from './types'
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  fetchNews,
  triggerScrape,
} from './api'

function App() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [keyword, setKeyword] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTopicName, setNewTopicName] = useState('')
  const [newTopicKeywords, setNewTopicKeywords] = useState('')
  const [loading, setLoading] = useState(false)

  const loadTopics = useCallback(async () => {
    try {
      const data = await fetchTopics()
      setTopics(data)
    } catch (e) {
      console.error('Failed to load topics:', e)
    }
  }, [])

  const loadNews = useCallback(async () => {
    try {
      const data = await fetchNews(selectedTopic ?? undefined, keyword || undefined)
      setArticles(data)
    } catch (e) {
      console.error('Failed to load news:', e)
    }
  }, [selectedTopic, keyword])

  useEffect(() => {
    loadTopics()
    loadNews()
  }, [loadTopics, loadNews])

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicName.trim() || !newTopicKeywords.trim()) return

    try {
      await createTopic({ name: newTopicName.trim(), keywords: newTopicKeywords.trim() })
      setNewTopicName('')
      setNewTopicKeywords('')
      setShowAddForm(false)
      loadTopics()
    } catch (e) {
      console.error('Failed to add topic:', e)
    }
  }

  const handleToggleTopic = async (topic: Topic) => {
    try {
      await updateTopic(topic.id, { enabled: !topic.enabled })
      loadTopics()
    } catch (e) {
      console.error('Failed to toggle topic:', e)
    }
  }

  const handleDeleteTopic = async (id: number) => {
    try {
      await deleteTopic(id)
      if (selectedTopic === id) setSelectedTopic(null)
      loadTopics()
    } catch (e) {
      console.error('Failed to delete topic:', e)
    }
  }

  const handleScrape = async () => {
    setLoading(true)
    try {
      await triggerScrape()
      loadNews()
    } catch (e) {
      console.error('Failed to trigger scrape:', e)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">News Tracker</h1>
          <button
            onClick={handleScrape}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Scraping...' : 'Fetch News'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Topics */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-900">Topics</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  {showAddForm ? 'Cancel' : '+ Add'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddTopic} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Topic name"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Keywords (comma-separated)"
                    value={newTopicKeywords}
                    onChange={(e) => setNewTopicKeywords(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                  >
                    Create
                  </button>
                </form>
              )}

              <button
                onClick={() => setSelectedTopic(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${
                  selectedTopic === null
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Topics
              </button>

              <div className="space-y-1">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="group flex items-center gap-2"
                  >
                    <button
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-sm ${
                        selectedTopic === topic.id
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {topic.name}
                    </button>
                    <button
                      onClick={() => handleToggleTopic(topic)}
                      className={`text-xs px-2 py-1 rounded ${
                        topic.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {topic.enabled ? 'On' : 'Off'}
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {topics.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No topics yet. Add one to get started.
                </p>
              )}
            </div>
          </aside>

          {/* Main Content - Articles */}
          <section className="lg:col-span-3">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search articles by keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Articles Grid */}
            <div className="grid gap-4">
              {articles.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No articles found.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adding topics and clicking "Fetch News"
                  </p>
                </div>
              ) : (
                articles.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow block"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                            {article.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          {article.source && <span>{article.source}</span>}
                          {article.published_at && (
                            <span>{formatDate(article.published_at)}</span>
                          )}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-300 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </a>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App