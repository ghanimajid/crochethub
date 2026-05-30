'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { courseService } from '@/services/courseService'

interface Course {
  courseID: number
  title: string
  description: string
  difficulty: string
  instructorID: number
  instructorName: string
  thumbnailURL?: string
  totalLessons: number
  averageRating: number
  totalEnrollments: number
  tags: string[]
  prerequisites: string[]
}

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

const difficultyColors: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: '#E8F5F0', color: '#2D7A5E' },
  Intermediate: { bg: '#FEF3E2', color: '#B45309' },
  Advanced: { bg: '#FEE8E8', color: '#9B2C2C' },
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await courseService.getAll()
        setCourses(data)
      } catch (err) {
        console.error('Failed to load courses', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = courses.filter(c => {
    const matchesDiff = selected === 'All' || c.difficulty === selected
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructorName?.toLowerCase().includes(search.toLowerCase())
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

      {/* Course Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '80px',
            fontFamily: 'var(--font-inter)',
            color: 'var(--text-muted)',
          }}>
            Loading courses...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px',
            fontFamily: 'var(--font-inter)',
            color: 'var(--text-muted)',
          }}>
            <p style={{ fontSize: '2rem', marginBottom: '16px' }}>🧶</p>
            <p>No courses found</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {filtered.map(course => (
              <Link
                key={course.courseID}
                href={`/courses/${course.courseID}`}
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
                  <div style={{
                    height: '200px',
                    backgroundColor: '#8FA89C',
                    backgroundImage: course.thumbnailURL ? `url(${course.thumbnailURL})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    padding: '16px',
                  }}>
                    {course.totalLessons > 0 && (
                      <span style={{
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: 'var(--text)',
                      }}>
                        {course.totalLessons} Lessons
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span style={{
                        backgroundColor: difficultyColors[course.difficulty]?.bg || 'var(--cream)',
                        color: difficultyColors[course.difficulty]?.color || 'var(--text-secondary)',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}>
                        {course.difficulty || 'General'}
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
                      {course.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      marginBottom: '12px',
                    }}>
                      {course.description}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}>
                      by {course.instructorName || 'Instructor'}
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