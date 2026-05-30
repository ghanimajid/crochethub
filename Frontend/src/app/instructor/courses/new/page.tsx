'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

export default function NewCoursePage() {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficultyID, setDifficultyID] = useState(3)
  const [thumbnailURL, setThumbnailURL] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
  if (!title) { setError('Title is required'); return }
  if (!thumbnailURL) { setError('Thumbnail URL is required'); return }
  setLoading(true)
  setError('')
  try {
    await apiFetch('/Course', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        difficultyID,
        thumbnailURL,
        tagIDs: [],
        prerequisiteIDs: [],
      }),
    })
    router.push('/instructor/dashboard')
  } catch (err: any) {
    console.error('Create course error:', err)
    setError(err?.message || 'Failed to create course. Please try again.')
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
          Create New Course
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          color: 'var(--text-muted)',
          marginBottom: '40px',
        }}>
          Fill in the details below to publish your course
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
              Course Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Crochet Fundamentals 101"
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

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What will students learn in this course?"
              rows={4}
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

          {/* Difficulty */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Difficulty Level
            </label>
            <select
              value={difficultyID}
              onChange={e => setDifficultyID(Number(e.target.value))}
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
                color: 'var(--text)',
              }}
            >
              <option value={3}>Beginner</option>
              <option value={4}>Intermediate</option>
              <option value={5}>Advanced</option>
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Thumbnail URL *
            </label>
            <input
              type="text"
              value={thumbnailURL}
              onChange={e => setThumbnailURL(e.target.value)}
              placeholder="https://example.com/image.jpg"
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
            {thumbnailURL && (
              <img
                src={thumbnailURL}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginTop: '10px',
                }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            )}
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginTop: '6px',
            }}>
              Tip: upload your image to imgbb.com and paste the direct link here
            </p>
          </div>

          {/* Submit */}
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
            {loading ? 'Creating...' : 'Publish Course →'}
          </button>
        </div>
      </div>
    </div>
  )
}