'use client'
import { useState } from 'react'
import Link from 'next/link'

const mockCourses = [
  {
    courseId: 1,
    title: 'Crochet Fundamentals 101',
    difficulty: 'Beginner',
    instructorName: 'Sarah Hook',
    lessonCount: 8,
    description: 'Master the slip knot, chain stitch, and single crochet in this calming introduction.',
    img: '/images/course1.jfif',
    tags: ['Basics', 'Beginner Friendly'],
  },
  {
    courseId: 2,
    title: 'Texture & Colorwork',
    difficulty: 'Intermediate',
    instructorName: 'Marco Silk',
    lessonCount: 12,
    description: 'Learn to combine different yarn weights and stitch heights to create dimensional fabrics.',
    img: '/images/course2.jfif',
    tags: ['Colorwork', 'Texture'],
  },
  {
    courseId: 3,
    title: 'The Perfect Finishing',
    difficulty: 'Advanced',
    instructorName: 'Elena Croft',
    lessonCount: 5,
    description: 'Professional secrets for blocking, seaming, and weaving in ends for a flawless look.',
    img: '/images/course3.jfif',
    tags: ['Finishing', 'Professional'],
  },
  {
    courseId: 4,
    title: 'Amigurumi Magic',
    difficulty: 'Beginner',
    instructorName: 'Yuki Tanaka',
    lessonCount: 10,
    description: 'Create adorable stuffed animals and characters using basic crochet techniques.',
    img: '/images/course4.jfif',
    tags: ['Amigurumi', 'Fun'],
  },
  {
    courseId: 5,
    title: 'Granny Squares Mastery',
    difficulty: 'Intermediate',
    instructorName: 'Rose Patel',
    lessonCount: 9,
    description: 'From classic to modern — learn every variation of the iconic granny square.',
    img: '/images/course5.jfif',
    tags: ['Granny Square', 'Classic'],
  },
  {
    courseId: 6,
    title: 'Wearable Crochet',
    difficulty: 'Advanced',
    instructorName: 'Diana Weave',
    lessonCount: 15,
    description: 'Design and crochet stunning garments — cardigans, tops, and accessories.',
    img: '/images/course6.jfif',
    tags: ['Fashion', 'Wearable'],
  },
]

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

const difficultyColors: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: '#E8F5F0', color: '#2D7A5E' },
  Intermediate: { bg: '#FEF3E2', color: '#B45309' },
  Advanced: { bg: '#FEE8E8', color: '#9B2C2C' },
}

export default function CoursesPage() {
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = mockCourses.filter(c => {
    const matchesDiff = selected === 'All' || c.difficulty === selected
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(search.toLowerCase())
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
            ✦ New Masterclass Series
          </p>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '3.5rem',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '8px',
          }}>
            All Courses
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter)',
            color: 'var(--text-muted)',
            fontSize: '1rem',
            marginBottom: '32px',
          }}>
            Step-by-step guidance for every skill level
          </p>

          {/* Search */}
          <input
            type="text"
            placeholder="Search courses or instructors..."
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

          {/* Filter tabs */}
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
                  transition: 'all 0.2s',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px',
            fontFamily: 'var(--font-inter)',
            color: 'var(--text-muted)',
          }}>
            No courses found
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {filtered.map(course => (
              <Link
                key={course.courseId}
                href={`/courses/${course.courseId}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img
                      src={course.img}
                      alt={course.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: 'var(--text)',
                    }}>
                      {course.lessonCount} Lessons
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: difficultyColors[course.difficulty]?.bg,
                        color: difficultyColors[course.difficulty]?.color,
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}>
                        {course.difficulty}
                      </span>
                      {course.tags.slice(0, 1).map(tag => (
                        <span key={tag} style={{
                          backgroundColor: 'var(--cream)',
                          color: 'var(--text-muted)',
                          padding: '3px 10px',
                          borderRadius: '100px',
                          fontFamily: 'var(--font-inter)',
                          fontSize: '0.7rem',
                          fontWeight: '500',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      color: 'var(--text)',
                      marginBottom: '8px',
                      lineHeight: '1.3',
                    }}>
                      {course.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                    }}>
                      {course.description}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}>
                      by {course.instructorName}
                    </p>
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