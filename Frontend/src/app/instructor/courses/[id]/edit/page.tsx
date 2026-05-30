'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/services/api'
import { courseService } from '@/services/courseService'
import { lessonService } from '@/services/lessonService'

interface Lesson {
  lessonID: number
  title: string
  sequenceOrder: number
  videoURL: string
  content: string
}

export default function EditCoursePage() {
  const { id } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficultyID, setDifficultyID] = useState(3)
  const [thumbnailURL, setThumbnailURL] = useState('')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [deletingLesson, setDeletingLesson] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      courseService.getById(Number(id)),
      lessonService.getByCourse(Number(id)),
    ]).then(([courseData, lessonsData]) => {
      setTitle(courseData.title || '')
      setDescription(courseData.description || '')
      setThumbnailURL(courseData.thumbnailURL || '')
      const diffMap: Record<string, number> = {
        'Beginner': 3, 'Intermediate': 4, 'Advanced': 5,
      }
      setDifficultyID(diffMap[courseData.difficulty] || 3)
      setLessons(Array.isArray(lessonsData) ? lessonsData : [])
    })
    .catch(() => setError('Failed to load course'))
    .finally(() => setFetching(false))
  }, [id])

  async function handleUpdate() {
    if (!title) { setError('Title is required'); return }
    if (!thumbnailURL) { setError('Thumbnail URL is required'); return }
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      await apiFetch(`/Course/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title, description, difficultyID, thumbnailURL,
          tagIDs: [], prerequisiteIDs: [],
        }),
      })
      setSuccess(true)
      setTimeout(() => router.push('/instructor/dashboard'), 1500)
    } catch {
      setError('Failed to update course.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteLesson(lessonID: number) {
    if (!confirm('Delete this lesson?')) return
    setDeletingLesson(lessonID)
    try {
      await apiFetch(`/Lesson/${lessonID}`, { method: 'DELETE' })
      setLessons(prev => prev.filter(l => l.lessonID !== lessonID))
    } catch {
      setError('Failed to delete lesson.')
    } finally {
      setDeletingLesson(null)
    }
  }

  if (fetching) return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '400px', fontFamily: 'var(--font-inter)', color: 'var(--text-muted)',
    }}>Loading...</div>
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 48px' }}>

        <Link href="/instructor/dashboard" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
          fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
        }}>
          Edit Course
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)', color: 'var(--text-muted)', marginBottom: '40px',
        }}>
          Update your course details below
        </p>

        {success && (
          <div style={{
            backgroundColor: '#E8F5F0', border: '1px solid #2D6B5E', color: '#2D6B5E',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
            fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          }}>
            Course updated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#FDF0EE', border: '1px solid #E8B4A8', color: '#C0392B',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
            fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        {/* Course details form */}
        <div style={{
          backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '40px',
          display: 'flex', flexDirection: 'column', gap: '24px',
          marginBottom: '32px',
        }}>
          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px',
            }}>Course Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'white',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px',
            }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              rows={4} style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'white',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px',
            }}>Difficulty Level</label>
            <select value={difficultyID} onChange={e => setDifficultyID(Number(e.target.value))}
              style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'white',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box', color: 'var(--text)',
              }}
            >
              <option value={3}>Beginner</option>
              <option value={4}>Intermediate</option>
              <option value={5}>Advanced</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px',
            }}>Thumbnail URL *</label>
            <input type="text" value={thumbnailURL} onChange={e => setThumbnailURL(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'white',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            {thumbnailURL && (
              <img src={thumbnailURL} alt="Preview" style={{
                width: '100%', height: '160px', objectFit: 'cover',
                borderRadius: '10px', marginTop: '10px',
              }} onError={e => (e.currentTarget.style.display = 'none')} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleUpdate} disabled={loading} style={{
              padding: '14px 32px',
              backgroundColor: loading ? '#9BA8A3' : '#7C2D3E',
              color: 'white', border: 'none', borderRadius: '12px',
              fontFamily: 'var(--font-inter)', fontWeight: '600', fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Saving...' : 'Save Changes →'}
            </button>
            <Link href="/instructor/dashboard" style={{
              padding: '14px 24px', backgroundColor: 'transparent',
              color: 'var(--text-secondary)', border: '1.5px solid var(--border)',
              borderRadius: '12px', fontFamily: 'var(--font-inter)',
              fontSize: '0.95rem', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>
              Cancel
            </Link>
          </div>
        </div>

        {/* Lessons section */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '16px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem',
            fontWeight: '700', color: 'var(--text)',
          }}>
            Lessons ({lessons.length})
          </h2>
          <Link href={`/instructor/courses/${id}/lesson/new`} style={{
            backgroundColor: 'var(--teal)', color: 'white',
            padding: '10px 20px', borderRadius: '100px',
            fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
            fontWeight: '500', textDecoration: 'none',
          }}>
            + Add Lesson
          </Link>
        </div>

        {lessons.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '32px', textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
              No lessons yet. Add your first lesson!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lessons.sort((a, b) => a.sequenceOrder - b.sequenceOrder).map(lesson => (
              <div key={lesson.lessonID} style={{
                backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: 'var(--teal)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
                  fontWeight: '600', flexShrink: 0,
                }}>
                  {lesson.sequenceOrder}
                </div>
                <span style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.95rem',
                  color: 'var(--text)', flex: 1,
                }}>
                  {lesson.title}
                </span>
                <button
                  onClick={() => handleDeleteLesson(lesson.lessonID)}
                  disabled={deletingLesson === lesson.lessonID}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1.5px solid #E8B4A8',
                    color: '#C0392B', padding: '6px 14px',
                    borderRadius: '100px', fontFamily: 'var(--font-inter)',
                    fontSize: '0.78rem', cursor: 'pointer',
                  }}
                >
                  {deletingLesson === lesson.lessonID ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}