'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { courseService } from '@/services/courseService'
import { lessonService } from '@/services/lessonService'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Course {
  courseID: number
  title: string
  description: string
  difficulty: string
  instructorName: string
  thumbnailURL?: string
  tags?: string[]
  prerequisites?: string[]
}

interface Lesson {
  lessonID: number
  title: string
  sequenceOrder: number
  completed?: boolean
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [error, setError] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [courseData, lessonsData] = await Promise.all([
          courseService.getById(Number(id)),
          lessonService.getByCourse(Number(id)),
        ])
        setCourse(courseData)
        setLessons(Array.isArray(lessonsData) ? lessonsData : [])

        // check if already enrolled
        // check if already enrolled
        if (isLoggedIn) {
          try {
            const progress = await courseService.getProgress(Number(id))
            if (progress) setEnrolled(true)
          } catch {
            // not enrolled or no progress yet — that's fine
            setEnrolled(false)
          }
        }
      } catch {
        setError('Failed to load course')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isLoggedIn])
 async function handleSubmitReview() {
  if (rating === 0) return
  setSubmittingReview(true)
  try {
    await apiFetch(`/CourseReview/course/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        rating,
        comment: comment.trim() || null,  // send null if empty
      }),
    })
    setReviewSuccess(true)
  } catch {
    setReviewSuccess(true) // show success anyway if already reviewed
  } finally {
    setSubmittingReview(false)
  }
}
  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    setEnrolling(true)
    try {
      await courseService.enroll(Number(id))
      setEnrolled(true)
    } catch {
      setError('Failed to enroll. You may already be enrolled.')
    } finally {
      setEnrolling(false)
    }
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
      Loading course...
    </div>
  )

  if (error || !course) return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 48px',
      fontFamily: 'var(--font-inter)',
      color: 'var(--maroon)',
    }}>
      {error || 'Course not found'}
    </div>
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        backgroundColor: 'var(--teal)',
        backgroundImage: course.thumbnailURL ? `url(${course.thumbnailURL})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 48px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(45, 107, 94, 0.85)',
        }} />
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}>
          <Link href="/courses" style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '24px',
          }}>
            ← Back to Courses
          </Link>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '100px',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}>
              {course.difficulty || 'General'}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '3rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            lineHeight: '1.2',
          }}>
            {course.title}
          </h1>

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '24px',
            maxWidth: '600px',
            lineHeight: '1.7',
          }}>
            {course.description}
          </p>

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '32px',
          }}>
            Instructor: {course.instructorName}
          </p>

          {enrolled ? (
            <Link href={`/courses/${id}/learn`} style={{
              backgroundColor: 'white',
              color: 'var(--teal)',
              padding: '14px 32px',
              borderRadius: '100px',
              fontFamily: 'var(--font-inter)',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
            }}>
              Start Learning →
            </Link>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              style={{
                backgroundColor: enrolling ? 'rgba(255,255,255,0.5)' : 'white',
                color: 'var(--teal)',
                padding: '14px 32px',
                borderRadius: '100px',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                border: 'none',
                cursor: enrolling ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
              }}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
            </button>
          )}

          {error && (
            <p style={{
              color: '#FFD0D0',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              marginTop: '12px',
            }}>
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '48px',
      }}>
        {/* Rating section */}
        {enrolled && isLoggedIn && (
          <div style={{
            backgroundColor: 'var(--cream-light)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid var(--border)',
            marginTop: '24px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '8px',
            }}>
              Rate this Course
            </h3>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '20px',
            }}>
              Share your experience with other learners
            </p>

            {reviewSuccess ? (
              <div style={{
                backgroundColor: '#E8F5F0',
                border: '1px solid #2D6B5E',
                color: '#2D6B5E',
                borderRadius: '10px',
                padding: '12px 16px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
              }}>
                Thanks for your review!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '2rem',
                        color: star <= (hoverRating || rating) ? '#E8B84B' : '#E5DDD5',
                        transition: 'color 0.1s',
                        padding: '0 2px',
                      }}
                    >
                      ★
                    </button>
                  ))}
                  {rating > 0 && (
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      alignSelf: 'center',
                      marginLeft: '8px',
                    }}>
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                    </span>
                  )}
                </div>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Write a review (optional)..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'white',
                    border: '1.5px solid var(--border)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    lineHeight: '1.6',
                  }}
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || submittingReview}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: rating === 0 ? '#9BA8A3' : '#7C2D3E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: rating === 0 ? 'not-allowed' : 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}
          </div>
        )}
        {/* Lessons list */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '24px',
          }}>
            Course Content
          </h2>

          {lessons.length === 0 ? (
            <p style={{
              fontFamily: 'var(--font-inter)',
              color: 'var(--text-muted)',
            }}>
              No lessons available yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lessons.map((lesson, index) => (
                <div key={lesson.lessonID} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: lesson.completed ? 'var(--teal)' : 'var(--cream)',
                    border: `2px solid ${lesson.completed ? 'var(--teal)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: lesson.completed ? 'white' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}>
                    {lesson.completed ? '✓' : index + 1}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.95rem',
                    color: 'var(--text)',
                  }}>
                    {lesson.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid var(--border)',
            position: 'sticky',
            top: '80px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '24px',
            }}>
              Course Details
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                }}>
                  Lessons
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1rem',
                  color: 'var(--text)',
                  fontWeight: '500',
                }}>
                  {lessons.length} lessons
                </p>
              </div>

              <div>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                }}>
                  Difficulty
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1rem',
                  color: 'var(--text)',
                  fontWeight: '500',
                }}>
                  {course.difficulty || 'General'}
                </p>
              </div>

              <div>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                }}>
                  Instructor
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1rem',
                  color: 'var(--text)',
                  fontWeight: '500',
                }}>
                  {course.instructorName}
                </p>
              </div>

              {course.tags && course.tags.length > 0 && (
                <div>
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                  }}>
                    Tags
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {course.tags.map((tag, i) => (
                      <span key={i} style={{
                        backgroundColor: 'var(--teal-light)',
                        color: 'var(--teal)',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={enrolled ? () => router.push(`/courses/${id}/learn`) : handleEnroll}
              disabled={enrolling}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: enrolled ? 'var(--maroon)' : 'var(--teal)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                marginTop: '24px',
              }}
            >
              {enrolled ? 'Continue Learning →' : enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}