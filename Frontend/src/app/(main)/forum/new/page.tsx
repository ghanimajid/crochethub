'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categories = ['Beginner Help', 'Pattern Sharing', 'Tools & Materials', 'General']

export default function NewThreadPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const router = useRouter()

  function handleSubmit() {
    if (!title || !content) return
    // will connect to API later
    router.push('/forum')
  }

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 48px' }}>

        <Link href="/forum" style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '32px',
        }}>
          ← Back to Forum
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '3rem',
          fontWeight: '700',
          color: 'var(--text)',
          marginBottom: '8px',
        }}>
          New Thread
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          color: 'var(--text-muted)',
          marginBottom: '48px',
        }}>
          Share something with the community
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Category */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '10px',
            }}>
              Category
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: '1.5px solid',
                    borderColor: category === cat ? 'var(--teal)' : 'var(--border)',
                    backgroundColor: category === cat ? 'var(--teal)' : 'white',
                    color: category === cat ? 'white' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.82rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '10px',
            }}>
              Thread Title
            </label>
            <input
              type="text"
              placeholder="What's your question or topic?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                backgroundColor: 'white',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Content */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '10px',
            }}>
              Content
            </label>
            <textarea
              placeholder="Share your thoughts, question, or project..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                padding: '14px 18px',
                backgroundColor: 'white',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: '1.6',
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: 'var(--maroon)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontFamily: 'var(--font-inter)',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            Post Thread
          </button>
        </div>
      </div>
    </div>
  )
}