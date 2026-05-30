'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Thread {
  threadID: number
  authorName: string
  title: string
  category: string
  replyCount: number
  createdAt: string
}

export default function AdminForumPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingThread, setDeletingThread] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user?.role !== 'Admin') { router.push('/'); return }

    apiFetch('/Admin/forum')
      .then(data => setThreads(Array.isArray(data) ? data : []))
      .catch(() => setThreads([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn, user, router])

  async function handleDelete(threadID: number) {
    if (!confirm('Delete this thread?')) return
    setDeletingThread(threadID)
    try {
      await apiFetch(`/Admin/forum/${threadID}`, { method: 'DELETE' })
      setThreads(prev => prev.filter(t => t.threadID !== threadID))
    } catch {
      alert('Failed to delete thread.')
    } finally {
      setDeletingThread(null)
    }
  }

  const filtered = threads.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.authorName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>

        <a href="/admin/dashboard" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>
          ← Back to Dashboard
        </a>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
            fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
          }}>
            Moderate Forum
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
            {threads.length} total threads
          </p>
        </div>

        <input
          type="text"
          placeholder="Search threads..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '480px', padding: '14px 20px',
            backgroundColor: 'white', border: '1.5px solid var(--border)',
            borderRadius: '100px', fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem', color: 'var(--text)', outline: 'none',
            display: 'block', marginBottom: '24px', boxSizing: 'border-box',
          }}
        />

        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(thread => (
              <div key={thread.threadID} style={{
                backgroundColor: 'var(--cream-light)',
                border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem',
                    fontWeight: '600', color: 'var(--text)', marginBottom: '4px',
                  }}>
                    {thread.title}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      by {thread.authorName}
                    </span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {thread.category}
                    </span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--teal)' }}>
                      {thread.replyCount} replies
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(thread.threadID)}
                  disabled={deletingThread === thread.threadID}
                  style={{
                    backgroundColor: 'transparent', border: '1.5px solid #E8B4A8',
                    color: '#C0392B', padding: '8px 16px', borderRadius: '100px',
                    fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                    fontWeight: '500', cursor: 'pointer',
                  }}
                >
                  {deletingThread === thread.threadID ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}