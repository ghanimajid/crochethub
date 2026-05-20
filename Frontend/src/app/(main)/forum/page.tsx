'use client'
import { useState } from 'react'
import Link from 'next/link'

const categories = ['All', 'Beginner Help', 'Pattern Sharing', 'Tools & Materials', 'General']

const mockThreads = [
  {
    threadId: 1,
    title: 'How do I fix tension issues in my first blanket?',
    content: 'I have been working on my first blanket for 2 weeks and noticed the tension is uneven...',
    category: 'Beginner Help',
    userName: 'YarnLover22',
    createdAt: '2 hours ago',
    replyCount: 14,
    upvotes: 23,
  },
  {
    threadId: 2,
    title: 'Sharing my finished Ocean Amigurumi — so happy with how it turned out!',
    content: 'After 3 weeks of work, I finally finished the Ocean Friend Amigurumi from the course...',
    category: 'Pattern Sharing',
    userName: 'CrochetQueen',
    createdAt: '5 hours ago',
    replyCount: 32,
    upvotes: 87,
  },
  {
    threadId: 3,
    title: 'Best hooks for beginners — Clover vs Tulip?',
    content: 'I am just starting out and cannot decide between Clover Amour and Tulip Etimo hooks...',
    category: 'Tools & Materials',
    userName: 'NewHooker',
    createdAt: '1 day ago',
    replyCount: 19,
    upvotes: 41,
  },
  {
    threadId: 4,
    title: 'Weekly stitch-along — Week 4 check in!',
    content: 'How is everyone doing with the Granny Square Stitch-Along? Post your progress here...',
    category: 'General',
    userName: 'StitchAlongHost',
    createdAt: '1 day ago',
    replyCount: 56,
    upvotes: 102,
  },
  {
    threadId: 5,
    title: 'Help with the magic ring — keeps coming undone',
    content: 'Every time I try to close the magic ring it unravels. I have watched 5 videos but...',
    category: 'Beginner Help',
    userName: 'FrustratedCrafter',
    createdAt: '2 days ago',
    replyCount: 28,
    upvotes: 34,
  },
  {
    threadId: 6,
    title: 'My version of the Berry Bliss Sweater in sage green',
    content: 'I modified the Berry Bliss pattern to use Paintbox DK in sage green. Here are my notes...',
    category: 'Pattern Sharing',
    userName: 'ColorCrafter',
    createdAt: '3 days ago',
    replyCount: 45,
    upvotes: 93,
  },
]

const categoryColors: Record<string, { bg: string; color: string }> = {
  'Beginner Help': { bg: '#E8F5F0', color: '#2D7A5E' },
  'Pattern Sharing': { bg: '#FEE8E8', color: '#9B2C2C' },
  'Tools & Materials': { bg: '#FEF3E2', color: '#B45309' },
  'General': { bg: '#EEF0FE', color: '#4338CA' },
}

export default function ForumPage() {
  const [selected, setSelected] = useState('All')

  const filtered = mockThreads.filter(t =>
    selected === 'All' || t.category === selected
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        backgroundColor: 'var(--cream-light)',
        borderBottom: '1px solid var(--border)',
        padding: '48px',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              color: 'var(--teal)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              Community
            </p>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '3.5rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '8px',
            }}>
              Forum
            </h1>
            <p style={{
              fontFamily: 'var(--font-inter)',
              color: 'var(--text-muted)',
              fontSize: '1rem',
            }}>
              Ask questions, share your work, connect with fellow crafters
            </p>
          </div>
          <Link href="/forum/new" style={{
            backgroundColor: 'var(--maroon)',
            color: 'white',
            padding: '14px 28px',
            borderRadius: '100px',
            fontFamily: 'var(--font-inter)',
            fontWeight: '500',
            fontSize: '0.9rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            + New Thread
          </Link>
        </div>

        {/* Category tabs */}
        <div style={{
          maxWidth: '1000px',
          margin: '32px auto 0',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                border: '1.5px solid',
                borderColor: selected === cat ? 'var(--teal)' : 'var(--border)',
                backgroundColor: selected === cat ? 'var(--teal)' : 'white',
                color: selected === cat ? 'white' : 'var(--text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Thread List */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(thread => (
            <Link
              key={thread.threadId}
              href={`/forum/${thread.threadId}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
              }}>

                {/* Upvote */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '48px',
                }}>
                  <button style={{
                    backgroundColor: 'var(--cream)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}>
                    ▲
                  </button>
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text)',
                  }}>
                    {thread.upvotes}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: categoryColors[thread.category]?.bg,
                      color: categoryColors[thread.category]?.color,
                      padding: '3px 10px',
                      borderRadius: '100px',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                    }}>
                      {thread.category}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text)',
                    marginBottom: '8px',
                    lineHeight: '1.3',
                  }}>
                    {thread.title}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                  }}>
                    {thread.content.substring(0, 120)}...
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}>
                      by {thread.userName}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}>
                      {thread.createdAt}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.8rem',
                      color: 'var(--teal)',
                      fontWeight: '500',
                    }}>
                      {thread.replyCount} replies
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}