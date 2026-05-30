'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/services/api'

export default function NewLessonPage() {
  const { id } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [videoURL, setVideoURL] = useState('')
  const [content, setContent] = useState('')
  const [sequenceOrder, setSequenceOrder] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!title) { setError('Title is required'); return }
    setLoading(true)
    setError('')
    try {
      await apiFetch('/Lesson', {
        method: 'POST',
        body: JSON.stringify({
          courseID: Number(id),
          title,
          videoURL,
          content,
          sequenceOrder,
        }),
      })
      router.push('/instructor/dashboard')
    } catch {
      setError('Failed to create lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 48px' }}>

        <Link href="/instructor/dashboard" style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '32px',
        }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '2.8rem',
          fontWeight: '700',
          color: 'var(--text)',
          marginBottom: '8px',
        }}>
          Add New Lesson
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          color: 'var(--text-muted)',
          marginBottom: '40px',
        }}>
          Course ID: {id}
        </p>

        {error && (
          <div style={{
            backgroundColor: '#FDF0EE',
            border: '1px solid #E8B4A8',
            color: '#C0392B',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '24px',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: 'var(--cream-light)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Title */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Lesson Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Introduction to the Magic Ring"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'white',
                border: '1.5px solid var(--border)',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Sequence Order */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Lesson Number
            </label>
            <input
              type="number"
              value={sequenceOrder}
              onChange={e => setSequenceOrder(Number(e.target.value))}
              min={1}
              style={{
                width: '120px',
                padding: '12px 14px',
                backgroundColor: 'white',
                border: '1.5px solid var(--border)',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Video URL */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Video URL
            </label>
            <input
              type="text"
              value={videoURL}
              onChange={e => setVideoURL(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'white',
                border: '1.5px solid var(--border)',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
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
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Lesson Content / Notes
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write lesson notes, instructions, or descriptions here..."
              rows={6}
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'white',
                border: '1.5px solid var(--border)',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
                lineHeight: '1.6',
              }}
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: '14px 32px',
              backgroundColor: loading ? '#9BA8A3' : '#7C2D3E',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'var(--font-inter)',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {loading ? 'Saving...' : 'Add Lesson →'}
          </button>
        </div>
      </div>
    </div>
  )
}