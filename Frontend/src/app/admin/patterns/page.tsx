'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Pattern {
  patternID: number
  title: string
  difficulty: string
  creatorName: string
  totalReviews: number
  averageRating: number
}

export default function AdminPatternsPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingPattern, setDeletingPattern] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user?.role !== 'Admin') { router.push('/'); return }

    apiFetch('/Pattern')
      .then(data => setPatterns(Array.isArray(data) ? data : []))
      .catch(() => setPatterns([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn, user, router])

  async function handleDelete(patternID: number) {
    if (!confirm('Delete this pattern?')) return
    setDeletingPattern(patternID)
    try {
      await apiFetch(`/Pattern/${patternID}`, { method: 'DELETE' })
      setPatterns(prev => prev.filter(p => p.patternID !== patternID))
    } catch {
      alert('Failed to delete pattern.')
    } finally {
      setDeletingPattern(null)
    }
  }

  const filtered = patterns.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.creatorName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>

        <a href="/admin/dashboard" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>← Back to Dashboard</a>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
            fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
          }}>Manage Patterns</h1>
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
            {patterns.length} total patterns
          </p>
        </div>

        <input type="text" placeholder="Search by title or creator..."
          value={search} onChange={e => setSearch(e.target.value)} style={{
            width: '100%', maxWidth: '480px', padding: '14px 20px',
            backgroundColor: 'white', border: '1.5px solid var(--border)',
            borderRadius: '100px', fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem', color: 'var(--text)', outline: 'none',
            display: 'block', marginBottom: '24px', boxSizing: 'border-box',
          }} />

        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(pattern => (
              <div key={pattern.patternID} style={{
                backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem',
                    fontWeight: '600', color: 'var(--text)', marginBottom: '4px',
                  }}>{pattern.title}</p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      by {pattern.creatorName}
                    </span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {pattern.difficulty}
                    </span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {pattern.totalReviews} reviews
                    </span>
                    {pattern.averageRating > 0 && (
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#B45309' }}>
                        ★ {pattern.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/patterns/${pattern.patternID}`} style={{
                  color: 'var(--teal)', fontFamily: 'var(--font-inter)',
                  fontSize: '0.82rem', textDecoration: 'none',
                  border: '1.5px solid var(--teal)', padding: '8px 16px', borderRadius: '100px',
                }}>View</Link>
                <button onClick={() => handleDelete(pattern.patternID)}
                  disabled={deletingPattern === pattern.patternID} style={{
                    backgroundColor: 'transparent', border: '1.5px solid #E8B4A8',
                    color: '#C0392B', padding: '8px 16px', borderRadius: '100px',
                    fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                    fontWeight: '500', cursor: 'pointer',
                  }}>
                  {deletingPattern === pattern.patternID ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}