'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Reply {
  replyID: number
  userID: number
  authorName: string
  content: string
  upvotes: number
  createdAt: string
}

interface ThreadDetail {
  threadID: number
  userID: number
  authorName: string
  title: string
  content: string
  category: string
  createdAt: string
  replies: Reply[]
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${mins} minute${mins > 1 ? 's' : ''} ago`
}

export default function ThreadDetailPage() {
  const { threadId } = useParams()
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()
  const [thread, setThread] = useState<ThreadDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch(`/Forum/${threadId}`)
      .then(data => setThread(data))
      .catch(() => setError('Failed to load thread'))
      .finally(() => setLoading(false))
  }, [threadId])

  async function handleReply() {
    if (!replyContent.trim()) return
    if (!isLoggedIn) { router.push('/login'); return }
    setSubmitting(true)
    try {
      const newReply = await apiFetch(`/Forum/${threadId}/replies`, {
        method: 'POST',
        body: JSON.stringify({ content: replyContent }),
      })
      setThread(prev => prev ? {
        ...prev,
        replies: [...(prev.replies || []), newReply],
      } : prev)
      setReplyContent('')
    } catch {
      setError('Failed to post reply.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpvote(replyID: number) {
    try {
      await apiFetch(`/Forum/replies/${replyID}/upvote`, { method: 'POST' })
      setThread(prev => prev ? {
        ...prev,
        replies: prev.replies.map(r =>
          r.replyID === replyID ? { ...r, upvotes: r.upvotes + 1 } : r
        ),
      } : prev)
    } catch {
      // already upvoted
    }
  }

  async function handleDeleteThread() {
    if (!confirm('Delete this thread?')) return
    try {
      await apiFetch(`/Forum/${threadId}`, { method: 'DELETE' })
      router.push('/forum')
    } catch {
      setError('Failed to delete thread.')
    }
  }

  if (loading) return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '400px', fontFamily: 'var(--font-inter)', color: 'var(--text-muted)',
    }}>
      Loading...
    </div>
  )

  if (error || !thread) return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 48px' }}>
      <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--maroon)' }}>
        {error || 'Thread not found'}
      </p>
    </div>
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px' }}>

        <Link href="/forum" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>
          ← Back to Forum
        </Link>

        {/* Thread */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '36px', border: '1px solid var(--border)', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{
              backgroundColor: '#E8F5F0', color: '#2D7A5E',
              padding: '4px 12px', borderRadius: '100px',
              fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: '600',
            }}>
              {thread.category}
            </span>
            {user?.userId === thread.userID && (
              <button onClick={handleDeleteThread} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#C0392B',
              }}>
                Delete
              </button>
            )}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '2rem',
            fontWeight: '700', color: 'var(--text)', marginBottom: '16px', lineHeight: '1.3',
          }}>
            {thread.title}
          </h1>

          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: '0.95rem',
            color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px',
          }}>
            {thread.content}
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              by {thread.authorName}
            </span>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {timeAgo(thread.createdAt)}
            </span>
          </div>
        </div>

        {/* Replies */}
        <h2 style={{
          fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem',
          fontWeight: '700', color: 'var(--text)', marginBottom: '16px',
        }}>
          {(thread.replies || []).length} {(thread.replies || []).length === 1 ? 'Reply' : 'Replies'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {(thread.replies || []).length === 0 ? (
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No replies yet. Be the first to reply!
            </p>
          ) : (
            (thread.replies || []).map(reply => (
              <div key={reply.replyID} style={{
                backgroundColor: 'white', borderRadius: '16px',
                padding: '24px', border: '1px solid var(--border)',
                display: 'flex', gap: '16px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: 'var(--teal)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-cormorant)', fontSize: '1rem',
                  fontWeight: '700', flexShrink: 0,
                }}>
                  {reply.authorName?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
                      fontWeight: '500', color: 'var(--text)',
                    }}>
                      {reply.authorName}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--text-muted)',
                    }}>
                      {timeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                    color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '12px',
                  }}>
                    {reply.content}
                  </p>
                  <button onClick={() => handleUpvote(reply.replyID)} style={{
                    background: 'none', border: '1px solid var(--border)',
                    borderRadius: '100px', padding: '4px 12px', cursor: 'pointer',
                    fontFamily: 'var(--font-inter)', fontSize: '0.78rem',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    ▲ {reply.upvotes}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply form */}
        {isLoggedIn ? (
          <div style={{
            backgroundColor: 'var(--cream-light)', borderRadius: '16px',
            padding: '28px', border: '1px solid var(--border)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem',
              fontWeight: '700', color: 'var(--text)', marginBottom: '16px',
            }}>
              Post a Reply
            </h3>
            <textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'white',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box', resize: 'vertical',
                lineHeight: '1.6', marginBottom: '16px',
              }}
            />
            <button
              onClick={handleReply}
              disabled={submitting || !replyContent.trim()}
              style={{
                padding: '12px 28px',
                backgroundColor: submitting || !replyContent.trim() ? '#9BA8A3' : '#7C2D3E',
                color: 'white', border: 'none', borderRadius: '12px',
                fontFamily: 'var(--font-inter)', fontWeight: '600',
                fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              {submitting ? 'Posting...' : 'Post Reply →'}
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'var(--cream-light)', borderRadius: '16px',
            padding: '28px', border: '1px solid var(--border)', textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Login to join the conversation
            </p>
            <Link href="/login" style={{
              backgroundColor: '#7C2D3E', color: 'white',
              padding: '10px 24px', borderRadius: '100px',
              fontFamily: 'var(--font-inter)', fontWeight: '500',
              fontSize: '0.875rem', textDecoration: 'none',
            }}>
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}