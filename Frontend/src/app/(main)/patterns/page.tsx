'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/services/api'
import { useAuth } from '@/context/AuthContext'


interface Pattern {
  patternID: number
  title: string
  description: string
  difficulty: string
  creatorName: string
  materials: { materialID: number; materialName: string; quantity: string }[]
  averageRating: number
  totalReviews: number
  createdAt: string
  thumbnailURL?: string
}

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

const difficultyColors: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: '#E8F5F0', color: '#2D7A5E' },
  Intermediate: { bg: '#FEF3E2', color: '#B45309' },
  Advanced: { bg: '#FEE8E8', color: '#9B2C2C' },
}

const patternImages = [
  'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80',
  'https://images.unsplash.com/photo-1603571370693-2e9b72022e6f?w=600&q=80',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
  'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&q=80',
  'https://images.unsplash.com/photo-1563464720-2b56cef4f87c?w=600&q=80',
]

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')
  const { isLoggedIn } = useAuth()
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    apiFetch('/Pattern')
      .then(data => setPatterns(Array.isArray(data) ? data : []))
      .catch(() => setPatterns([]))
      .finally(() => setLoading(false))

    if (isLoggedIn) {
      apiFetch('/Favorite')
        .then(data => {
          const ids = Array.isArray(data)
            ? data.map((f: any) => f.patternID)
            : []
          setFavorites(ids)
        })
        .catch(() => { })
    }
  }, [isLoggedIn])

  async function toggleFavorite(e: React.MouseEvent, patternID: number) {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) return

    try {
      if (favorites.includes(patternID)) {
        await apiFetch(`/Favorite/${patternID}`, { method: 'DELETE' })
        setFavorites(prev => prev.filter(id => id !== patternID))
      } else {
        await apiFetch(`/Favorite/${patternID}`, { method: 'POST' })
        setFavorites(prev => [...prev, patternID])
      }
    } catch { }
  }

  const filtered = patterns.filter(p => {
    const matchesDiff = selected === 'All' || p.difficulty === selected
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.creatorName?.toLowerCase().includes(search.toLowerCase())
    return matchesDiff && matchesSearch
  })

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        backgroundColor: 'var(--cream-light)',
        borderBottom: '1px solid var(--border)',
        padding: '48px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.75rem',
            color: 'var(--teal)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: '600',
            marginBottom: '12px',
          }}>
            {patterns.length} Patterns Available
          </p>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '3.5rem',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '8px',
          }}>
            Pattern Library
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter)',
            color: 'var(--text-muted)',
            fontSize: '1rem',
            marginBottom: '32px',
          }}>
            Find your next masterpiece among our hand-crafted guides
          </p>

          <input
            type="text"
            placeholder="Search patterns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '14px 20px',
              backgroundColor: 'white',
              border: '1.5px solid var(--border)',
              borderRadius: '100px',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.9rem',
              color: 'var(--text)',
              outline: 'none',
              display: 'block',
              marginBottom: '24px',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setSelected(d)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '100px',
                  border: '1.5px solid',
                  borderColor: selected === d ? 'var(--teal)' : 'var(--border)',
                  backgroundColor: selected === d ? 'var(--teal)' : 'white',
                  color: selected === d ? 'white' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
            Loading patterns...
          </p>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px',
            fontFamily: 'var(--font-inter)', color: 'var(--text-muted)',
          }}>
            No patterns found
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {filtered.map((pattern, index) => (
              <Link
                key={pattern.patternID}
                href={`/patterns/${pattern.patternID}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  height: '100%',
                }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img
                      src={pattern.thumbnailURL || patternImages[index % patternImages.length]}
                      alt={pattern.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = patternImages[index % patternImages.length]
                      }}
                    />
                    {isLoggedIn && (
                      <button
                        onClick={e => toggleFavorite(e, pattern.patternID)}
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          backgroundColor: 'rgba(255,255,255,0.92)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '1rem',
                        }}
                      >
                        {favorites.includes(pattern.patternID) ? '❤️' : '🤍'}
                      </button>
                    )}
                    {pattern.averageRating > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#B45309',
                      }}>
                        ★ {pattern.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: difficultyColors[pattern.difficulty]?.bg || 'var(--cream)',
                        color: difficultyColors[pattern.difficulty]?.color || 'var(--text-secondary)',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}>
                        {pattern.difficulty}
                      </span>
                      <span style={{
                        backgroundColor: 'var(--cream)',
                        color: 'var(--text-muted)',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                      }}>
                        {pattern.materials.length} materials
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      color: 'var(--text)',
                      marginBottom: '8px',
                      lineHeight: '1.3',
                    }}>
                      {pattern.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                    }}>
                      {pattern.description.substring(0, 100)}...
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}>
                        by {pattern.creatorName}
                      </p>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.78rem',
                        color: 'var(--teal)',
                        fontWeight: '500',
                      }}>
                        {pattern.totalReviews} reviews
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