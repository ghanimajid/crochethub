'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Pattern {
  patternID: number
  title: string
  difficulty: string
  totalReviews: number
  averageRating: number
  materials: any[]
}

export default function InstructorPatternsPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user?.role !== 'Instructor') { router.push('/'); return }

    apiFetch('/Pattern')
      .then(data => {
        const all = Array.isArray(data) ? data : []
        // filter only this instructor's patterns
        const mine = all.filter((p: any) => p.createdBy === user?.userId)
        setPatterns(mine)
      })
      .catch(() => setPatterns([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn, user, router])

  async function handleDelete(patternID: number) {
    if (!confirm('Delete this pattern?')) return
    try {
      await apiFetch(`/Pattern/${patternID}`, { method: 'DELETE' })
      setPatterns(prev => prev.filter(p => p.patternID !== patternID))
    } catch {
      alert('Failed to delete pattern.')
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '40px',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              color: 'var(--teal)', fontWeight: '500', marginBottom: '6px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              Instructor Dashboard
            </p>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
              fontWeight: '700', color: 'var(--text)',
            }}>
              My Patterns
            </h1>
          </div>
          <Link href="/instructor/patterns/new" style={{
            backgroundColor: '#7C2D3E', color: 'white',
            padding: '14px 28px', borderRadius: '100px',
            fontFamily: 'var(--font-inter)', fontWeight: '500',
            fontSize: '0.9rem', textDecoration: 'none',
          }}>
            + Create Pattern
          </Link>
        </div>

        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
        ) : patterns.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '60px', textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)', marginBottom: '20px' }}>
              You haven't created any patterns yet.
            </p>
            <Link href="/instructor/patterns/new" style={{
              backgroundColor: '#7C2D3E', color: 'white', padding: '12px 28px',
              borderRadius: '100px', fontFamily: 'var(--font-inter)',
              fontWeight: '500', textDecoration: 'none',
            }}>
              Create Your First Pattern
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {patterns.map(pattern => (
              <div key={pattern.patternID} style={{
                backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '24px',
                display: 'flex', alignItems: 'center', gap: '20px',
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem',
                    fontWeight: '600', color: 'var(--text)', marginBottom: '6px',
                  }}>
                    {pattern.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{
                      fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)',
                    }}>
                      {pattern.difficulty}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)',
                    }}>
                      {pattern.materials?.length || 0} materials
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)',
                    }}>
                      {pattern.totalReviews} reviews
                    </span>
                    {pattern.averageRating > 0 && (
                      <span style={{
                        fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#B45309',
                      }}>
                        ★ {pattern.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/instructor/patterns/${pattern.patternID}/edit`} style={{
                    backgroundColor: 'var(--teal)', color: 'white',
                    padding: '8px 18px', borderRadius: '100px',
                    fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                    fontWeight: '500', textDecoration: 'none',
                  }}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(pattern.patternID)} style={{
                    backgroundColor: 'transparent', border: '1.5px solid #E8B4A8',
                    color: '#C0392B', padding: '8px 18px', borderRadius: '100px',
                    fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                    fontWeight: '500', cursor: 'pointer',
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}