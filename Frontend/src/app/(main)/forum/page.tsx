'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Thread {
  threadID: number
  userID: number
  authorName: string
  title: string
  content: string
  category: string
  replyCount: number
  createdAt: string
}

const categories = ['All', 'Beginner Help', 'Pattern Sharing', 'Tools and Materials', 'General Discussion']

const categoryColors: Record<string, { bg: string; color: string }> = {
  'Beginner Help': { bg: '#E8F5F0', color: '#2D7A5E' },
  'Pattern Sharing': { bg: '#FEE8E8', color: '#9B2C2C' },
  'Tools and Materials': { bg: '#FEF3E2', color: '#B45309' },
  'General Discussion': { bg: '#EEF0FE', color: '#4338CA' },
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

export default function ForumPage() {
  const { isLoggedIn } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState('All')

  useEffect(() => {
    apiFetch('/Forum')
      .then(data => setThreads(Array.isArray(data) ? data : []))
      .catch(() => setThreads([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = threads.filter(t =>
    selected === 'All' || t.category === selected
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        backgroundColor: 'var(--cream-light)',
        borderBottom: '1px solid var(--border)',
        padding: '48px',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              color: 'var(--teal)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              Community
            </p>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '3.5rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '8px',
            }}>
              Forum
            </h1>
            <p style={{
              fontFamily: 'var(--font-inter)',
              color: 'var(--text-muted)',
              fontSize: '1rem',
            }}>
              Ask questions, share your work, connect with fellow crafters
            </p>
          </div>
          {isLoggedIn && (
            <Link href="/forum/new" style={{
              backgroundColor: '#7C2D3E',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '100px',
              fontFamily: 'var(--font-inter)',
              fontWeight: '500',
              fontSize: '0.9rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              + New Thread
            </Link>
          )}
        </div>

        {/* Category tabs */}
        <div style={{
          maxWidth: '1000px',
          margin: '32px auto 0',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                border: '1.5px solid',
                borderColor: selected === cat ? 'var(--teal)' : 'var(--border)',
                backgroundColor: selected === cat ? 'var(--teal)' : 'white',
                color: selected === cat ? 'white' : 'var(--text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Thread List */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px' }}>
        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading threads...</p>
        ) : filtered.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--cream-light)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
              No threads yet. Be the first to post!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(thread => (
              <Link
                key={thread.threadID}
                href={`/forum/${thread.threadID}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '28px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: 'white',
                    flexShrink: 0,
                  }}>
                    {thread.authorName?.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: categoryColors[thread.category]?.bg || 'var(--cream)',
                        color: categoryColors[thread.category]?.color || 'var(--text-muted)',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                      }}>
                        {thread.category}
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--text)',
                      marginBottom: '8px',
                      lineHeight: '1.3',
                    }}>
                      {thread.title}
                    </h3>

                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                    }}>
                      {thread.content.substring(0, 120)}...
                    </p>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}>
                        by {thread.authorName}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}>
                        {timeAgo(thread.createdAt)}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.8rem',
                        color: 'var(--teal)',
                        fontWeight: '500',
                      }}>
                        {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}