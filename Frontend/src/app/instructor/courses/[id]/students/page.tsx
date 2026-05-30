'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/services/api'

interface Student {
  studentID: number
  firstName: string
  lastName: string
  email: string
  completionPercentage: number
  enrollmentDate: string
}

export default function StudentsPage() {
  const { id } = useParams()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    apiFetch(`/Instructor/courses/${id}/students`)
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [id])

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 48px' }}>

        <Link href="/instructor/dashboard" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
          fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
        }}>
          Enrolled Students
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)', color: 'var(--text-muted)', marginBottom: '32px',
        }}>
          {students.length} student{students.length !== 1 ? 's' : ''} enrolled
        </p>

        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 20px', backgroundColor: 'white',
            border: '1.5px solid var(--border)', borderRadius: '100px',
            fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
            color: 'var(--text)', outline: 'none',
            display: 'block', marginBottom: '24px', boxSizing: 'border-box',
          }}
        />

        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '48px', textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
              No students enrolled yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(student => (
              <div key={student.studentID} style={{
                backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  backgroundColor: 'var(--teal)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-cormorant)', fontSize: '1.2rem',
                  fontWeight: '700', flexShrink: 0,
                }}>
                  {student.firstName?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem',
                    fontWeight: '600', color: 'var(--text)', marginBottom: '2px',
                  }}>
                    {student.firstName} {student.lastName}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                  }}>
                    {student.email}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem',
                    fontWeight: '700', color: '#7C2D3E',
                  }}>
                    {student.completionPercentage || 0}%
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}>
                    complete
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}