'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Pattern {
  patternID: number
  title: string
  description: string
  difficulty: string
  creatorName: string
  courseID: number | null
  courseTitle: string | null
  materials: { materialID: number; materialName: string; quantity: string }[]
  averageRating: number
  totalReviews: number
  createdAt: string
}

interface Review {
  reviewID: number
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return 'just now'
}

export default function PatternDetailPage() {
  const { id } = useParams()
  const { isLoggedIn } = useAuth()
  const [pattern, setPattern] = useState<Pattern | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [savingPattern, setSavingPattern] = useState(false)

  useEffect(() => {
    Promise.all([
      apiFetch(`/Pattern/${id}`),
      apiFetch(`/Pattern/${id}/reviews`),
      isLoggedIn ? apiFetch(`/Favorite/${id}/check`) : Promise.resolve(false),
    ])
      .then(([patternData, reviewsData, savedData]) => {
        setPattern(patternData)
        setReviews(Array.isArray(reviewsData) ? reviewsData : [])
        setIsSaved(savedData === true || savedData?.isFavorited === true)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [id, isLoggedIn])

  async function handleToggleSave() {
    if (!isLoggedIn) return
    setSavingPattern(true)
    try {
      if (isSaved) {
        await apiFetch(`/Favorite/${id}`, { method: 'DELETE' })
        setIsSaved(false)
      } else {
        await apiFetch(`/Favorite/${id}`, { method: 'POST' })
        setIsSaved(true)
      }
    } catch {
      // already saved or error
    } finally {
      setSavingPattern(false)
    }
  }

  async function handleSubmitReview() {
    if (rating === 0) return
    setSubmittingReview(true)
    try {
      await apiFetch(`/Pattern/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
        }),
      })
      setReviewSuccess(true)
      // refresh reviews
      const updated = await apiFetch(`/Pattern/${id}/reviews`)
      setReviews(Array.isArray(updated) ? updated : [])
    } catch {
      setReviewSuccess(true)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '400px', fontFamily: 'var(--font-inter)', color: 'var(--text-muted)',
    }}>
      Loading pattern...
    </div>
  )

  if (!pattern) return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 48px' }}>
      <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--maroon)' }}>Pattern not found</p>
    </div>
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px' }}>

        <Link href="/patterns" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>
          ← Back to Patterns
        </Link>

        {/* Header */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '36px', border: '1px solid var(--border)', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span style={{
              backgroundColor: '#E8F5F0', color: '#2D7A5E',
              padding: '4px 12px', borderRadius: '100px',
              fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: '600',
            }}>
              {pattern.difficulty}
            </span>
            {pattern.averageRating > 0 && (
              <span style={{
                backgroundColor: '#FEF3E2', color: '#B45309',
                padding: '4px 12px', borderRadius: '100px',
                fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: '600',
              }}>
                ★ {pattern.averageRating.toFixed(1)} ({pattern.totalReviews} reviews)
              </span>
            )}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem',
            fontWeight: '700', color: 'var(--text)', marginBottom: '16px',
          }}>
            {pattern.title}
          </h1>

          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: '0.95rem',
            color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px',
          }}>
            {pattern.description}
          </p>

          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--text-muted)',
          }}>
            by {pattern.creatorName}
          </p>

          {pattern.courseTitle && (
            <Link href={`/courses/${pattern.courseID}`} style={{
              display: 'inline-block', marginTop: '12px',
              fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
              color: 'var(--teal)', textDecoration: 'none',
            }}>
              Part of: {pattern.courseTitle} →
            </Link>
          )}
        </div>

        {/* Materials */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '32px', border: '1px solid var(--border)', marginBottom: '24px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem',
            fontWeight: '700', color: 'var(--text)', marginBottom: '20px',
          }}>
            Materials Needed
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pattern.materials.map(mat => (
              <div key={mat.materialID} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '12px 16px',
                backgroundColor: 'var(--cream)', borderRadius: '10px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: 'var(--text)',
                }}>
                  {mat.materialName}
                </span>
                <span style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
                  color: 'var(--text-muted)', fontWeight: '500',
                }}>
                  {mat.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '32px', border: '1px solid var(--border)', marginBottom: '24px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem',
            fontWeight: '700', color: 'var(--text)', marginBottom: '20px',
          }}>
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map((review: any) => (
                <div key={review.reviewID} style={{
                  borderBottom: '1px solid var(--border)', paddingBottom: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                      fontWeight: '500', color: 'var(--text)',
                    }}>
                      {review.authorName || review.userName}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#E8B84B', fontSize: '0.9rem' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--text-muted)',
                      }}>
                        {timeAgo(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  {review.comment && (
                    <p style={{
                      fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                      color: 'var(--text-secondary)', lineHeight: '1.6',
                    }}>
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Write a review */}
        {isLoggedIn && (
          <div style={{
            backgroundColor: 'var(--cream-light)', borderRadius: '20px',
            padding: '32px', border: '1px solid var(--border)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem',
              fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
            }}>
              Write a Review
            </h3>

            {reviewSuccess ? (
              <div style={{
                backgroundColor: '#E8F5F0', border: '1px solid #2D6B5E',
                color: '#2D6B5E', borderRadius: '10px', padding: '12px 16px',
                fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
              }}>
                Thanks for your review!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '2rem',
                        color: star <= (hoverRating || rating) ? '#E8B84B' : '#E5DDD5',
                        padding: '0 2px',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience with this pattern (optional)..."
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 14px', backgroundColor: 'white',
                    border: '1.5px solid var(--border)', borderRadius: '10px',
                    fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                    outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6',
                  }}
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || submittingReview}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: rating === 0 ? '#9BA8A3' : '#7C2D3E',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontFamily: 'var(--font-inter)', fontWeight: '600',
                    fontSize: '0.9rem', cursor: rating === 0 ? 'not-allowed' : 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}