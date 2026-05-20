'use client'
import { useState } from 'react'

const mockPatterns = [
  {
    patternId: 1,
    title: 'Berry Bliss Sweater',
    difficulty: 'Intermediate',
    description: 'A cozy oversized sweater with beautiful berry tones and textured stitches.',
    materialsCount: 4,
    timeEstimate: '15-20 hours',
    img: '/images/1.jfif',
    tags: ['Wearable', 'Winter'],
    price: '$12.00',
  },
  {
    patternId: 2,
    title: 'Forest Friends Amigurumi',
    difficulty: 'Beginner',
    description: 'A set of adorable woodland creatures — fox, rabbit, and bear — perfect for gifting.',
    materialsCount: 3,
    timeEstimate: '6 hours',
    img: '/images/amigurumi.jpg',
    tags: ['Amigurumi', 'Gift'],
    price: 'Free',
  },
  {
    patternId: 3,
    title: 'Rose Garden Throw',
    difficulty: 'Advanced',
    description: 'An heirloom-quality blanket featuring intricate rose motifs in aran weight yarn.',
    materialsCount: 5,
    timeEstimate: '40+ hours',
    img: '/images/rosegarden.jpg',
    tags: ['Home Decor', 'Blanket'],
    price: '$24.00',
  },
  {
    patternId: 4,
    title: 'Sunday Market Tote',
    difficulty: 'Beginner',
    description: 'A sturdy and stylish market bag worked in cotton yarn — practical and beautiful.',
    materialsCount: 2,
    timeEstimate: '4 hours',
    img: '/images/tote1.jpg',
    tags: ['Bag', 'Summer'],
    price: '$8.00',
  },
  {
    patternId: 5,
    title: 'Ombre Ridge Beanie',
    difficulty: 'Intermediate',
    description: 'A modern beanie featuring a stunning ombre color transition and ridge texture.',
    materialsCount: 3,
    timeEstimate: '3 hours',
    img: '/images/beanie.jpg',
    tags: ['Hat', 'Winter'],
    price: '$5.99',
  },
  {
    patternId: 6,
    title: 'Boho Wall Hanging',
    difficulty: 'Beginner',
    description: 'A beautiful geometric wall hanging that combines crochet and macrame elements.',
    materialsCount: 4,
    timeEstimate: '5 hours',
    img: '/images/6.jfif',
    tags: ['Home Decor', 'Boho'],
    price: 'Free',
  },
]

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

const difficultyColors: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: '#E8F5F0', color: '#2D7A5E' },
  Intermediate: { bg: '#FEF3E2', color: '#B45309' },
  Advanced: { bg: '#FEE8E8', color: '#9B2C2C' },
}

export default function PatternsPage() {
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = mockPatterns.filter(p => {
    const matchesDiff = selected === 'All' || p.difficulty === selected
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
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
            1,400+ Patterns Available
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

          {/* Search */}
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
            }}
          />

          {/* Filters */}
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}>
          {filtered.map(pattern => (
            <div key={pattern.patternId} style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}>
              {/* Image */}
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img
                  src={pattern.img}
                  alt={pattern.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Price badge */}
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: pattern.price === 'Free' ? 'var(--teal)' : 'var(--maroon)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}>
                  {pattern.price}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{
                    backgroundColor: difficultyColors[pattern.difficulty]?.bg,
                    color: difficultyColors[pattern.difficulty]?.color,
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
                    {pattern.timeEstimate}
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
                  marginBottom: '20px',
                }}>
                  {pattern.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}>
                    {pattern.materialsCount} materials needed
                  </span>
                  <button style={{
                    backgroundColor: 'var(--teal)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.82rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}>
                    View Pattern
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}