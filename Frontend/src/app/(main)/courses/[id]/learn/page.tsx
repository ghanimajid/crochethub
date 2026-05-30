'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { lessonService } from '@/services/lessonService'
import { useAuth } from '@/context/AuthContext'

interface Lesson {
  lessonID: number
  courseID: number
  title: string
  videoURL: string
  content: string
  sequenceOrder: number
  isCompleted: boolean
  timeSpent: number
}

export default function LearnPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    async function load() {
      try {
        const data = await lessonService.getByCourse(Number(id))
        const lessonsArray = Array.isArray(data) ? data : []
        setLessons(lessonsArray)
        if (lessonsArray.length > 0) {
          setCurrentLesson(lessonsArray[0])
        }
      } catch {
        setError('Failed to load lessons')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isLoggedIn, router])

  async function handleComplete() {
    if (!currentLesson) return
    setCompleting(true)
    try {
      await lessonService.markComplete(currentLesson.lessonID, 0)
      // update local state
      setLessons(prev => prev.map(l =>
        l.lessonID === currentLesson.lessonID ? { ...l, isCompleted: true } : l
      ))
      setCurrentLesson(prev => prev ? { ...prev, isCompleted: true } : prev)
      // go to next lesson
      const currentIndex = lessons.findIndex(l => l.lessonID === currentLesson.lessonID)
      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1])
      }
    } catch {
      setError('Failed to mark lesson complete')
    } finally {
      setCompleting(false)
    }
  }

  function getYouTubeEmbed(url: string) {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
      fontFamily: 'var(--font-inter)',
      color: 'var(--text-muted)',
    }}>
      Loading lessons...
    </div>
  )

  if (error || lessons.length === 0) return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 48px',
      fontFamily: 'var(--font-inter)',
      color: 'var(--text-muted)',
      textAlign: 'center',
    }}>
      <p style={{ marginBottom: '16px' }}>{error || 'No lessons available yet.'}</p>
      <Link href={`/courses/${id}`} style={{
        color: 'var(--teal)',
        textDecoration: 'none',
      }}>
        ← Back to Course
      </Link>
    </div>
  )

  const embedURL = currentLesson ? getYouTubeEmbed(currentLesson.videoURL) : null

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '32px',
      }}>

        {/* Main content */}
        <div>
          {/* Back link */}
          <Link href={`/courses/${id}`} style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '20px',
          }}>
            ← Back to Course
          </Link>

          {/* Video player */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            marginBottom: '24px',
          }}>
            {embedURL ? (
              <iframe
                src={embedURL}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-inter)',
              }}>
                No video available for this lesson
              </div>
            )}
          </div>

          {/* Lesson info */}
          <div style={{
            backgroundColor: 'var(--cream-light)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid var(--border)',
            marginBottom: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                }}>
                  Lesson {currentLesson?.sequenceOrder}
                </p>
                <h1 style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--text)',
                }}>
                  {currentLesson?.title}
                </h1>
              </div>

              {currentLesson?.isCompleted ? (
                <span style={{
                  backgroundColor: '#E8F5F0',
                  color: '#2D6B5E',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  flexShrink: 0,
                }}>
                  ✓ Completed
                </span>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  style={{
                    backgroundColor: completing ? '#9BA8A3' : '#7C2D3E',
                    color: 'white',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: completing ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {completing ? 'Saving...' : 'Mark as Complete'}
                </button>
              )}
            </div>

            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
            }}>
              {currentLesson?.content}
            </p>
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => {
                const currentIndex = lessons.findIndex(l => l.lessonID === currentLesson?.lessonID)
                if (currentIndex > 0) setCurrentLesson(lessons[currentIndex - 1])
              }}
              disabled={lessons.findIndex(l => l.lessonID === currentLesson?.lessonID) === 0}
              style={{
                backgroundColor: 'transparent',
                border: '1.5px solid var(--border)',
                padding: '10px 24px',
                borderRadius: '100px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                opacity: lessons.findIndex(l => l.lessonID === currentLesson?.lessonID) === 0 ? 0.4 : 1,
              }}
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                const currentIndex = lessons.findIndex(l => l.lessonID === currentLesson?.lessonID)
                if (currentIndex < lessons.length - 1) setCurrentLesson(lessons[currentIndex + 1])
              }}
              disabled={lessons.findIndex(l => l.lessonID === currentLesson?.lessonID) === lessons.length - 1}
              style={{
                backgroundColor: 'var(--teal)',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '100px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.875rem',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                opacity: lessons.findIndex(l => l.lessonID === currentLesson?.lessonID) === lessons.length - 1 ? 0.4 : 1,
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Sidebar — lesson list */}
        <div style={{
          backgroundColor: 'var(--cream-light)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '24px',
          height: 'fit-content',
          position: 'sticky',
          top: '80px',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.3rem',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '16px',
          }}>
            Course Content
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lessons.map((lesson, index) => (
              <button
                key={lesson.lessonID}
                onClick={() => setCurrentLesson(lesson)}
                style={{
                  backgroundColor: currentLesson?.lessonID === lesson.lessonID ? '#7C2D3E' : 'transparent',
                  border: '1px solid',
                  borderColor: currentLesson?.lessonID === lesson.lessonID ? '#7C2D3E' : 'var(--border)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: lesson.isCompleted ? '#2D6B5E' : currentLesson?.lessonID === lesson.lessonID ? 'rgba(255,255,255,0.2)' : 'var(--cream)',
                  border: `1.5px solid ${lesson.isCompleted ? '#2D6B5E' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: lesson.isCompleted ? 'white' : currentLesson?.lessonID === lesson.lessonID ? 'white' : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {lesson.isCompleted ? '✓' : index + 1}
                </div>
                <span style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.82rem',
                  color: currentLesson?.lessonID === lesson.lessonID ? 'white' : 'var(--text)',
                  lineHeight: '1.4',
                }}>
                  {lesson.title}
                </span>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '8px',
            }}>
              {lessons.filter(l => l.isCompleted).length} of {lessons.length} completed
            </p>
            <div style={{
              backgroundColor: 'var(--border)',
              borderRadius: '100px',
              height: '6px',
            }}>
              <div style={{
                backgroundColor: '#2D6B5E',
                borderRadius: '100px',
                height: '6px',
                width: `${lessons.length > 0 ? (lessons.filter(l => l.isCompleted).length / lessons.length) * 100 : 0}%`,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}