'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { instructorService } from '@/services/instructorService'
import config from '@/config'

interface Course {
    courseID: number
    title: string
    difficulty?: string
    thumbnailURL?: string
    totalEnrolled: number
    avgCompletion: number | null
    avgRating: number | null
    createdAt: string
}

export default function InstructorDashboard() {
    const { user, isLoggedIn } = useAuth()
    const router = useRouter()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isLoggedIn) { router.push('/login'); return }
        if (user?.role !== 'Instructor') { router.push('/'); return }

        Promise.all([
            instructorService.getCourses(),
            fetch(`${config.API_BASE_URL}/Course`).then(r => r.json())
        ])
            .then(([instructorData, allCourses]) => {
                console.log('Instructor courses data:', JSON.stringify(instructorData))
                const instructorArray = Array.isArray(instructorData) ? instructorData : []
                const allCoursesArray = Array.isArray(allCourses) ? allCourses : []

                // merge thumbnailURL and totalLessons from full course data
                const merged = instructorArray.map((ic: any) => {
                    const full = allCoursesArray.find((c: any) => c.courseID === ic.courseID)
                    return {
                        ...ic,
                        thumbnailURL: full?.thumbnailURL || '',
                        totalLessons: full?.totalLessons || 0,
                    }
                })
                setCourses(merged)
            })
            .catch(() => setCourses([]))
            .finally(() => setLoading(false))
    }, [isLoggedIn, user, router])

    return (
        <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
                
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '40px',
                }}>
                    <div>
                        <p style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '0.8rem',
                            color: 'var(--teal)',
                            fontWeight: '500',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}>
                            Instructor Dashboard
                        </p>
                        <h1 style={{
                            fontFamily: 'var(--font-cormorant)',
                            fontSize: '2.8rem',
                            fontWeight: '700',
                            color: 'var(--text)',
                        }}>
                            My Courses
                        </h1>
                    </div>
                    <Link href="/instructor/courses/new" style={{
                        backgroundColor: '#7C2D3E',
                        color: 'white',
                        padding: '14px 28px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        + Create New Course
                    </Link>
                </div>

                {/* Stats row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginBottom: '40px',
                }}>
                    {[
                        { label: 'Total Courses', value: Array.isArray(courses) ? courses.length : 0 },
                        { label: 'Total Students', value: Array.isArray(courses) ? courses.reduce((a, c) => a + (c.totalEnrolled || 0), 0) : 0 },
                        { label: 'Total Lessons', value: Array.isArray(courses) ? courses.reduce((a: number, c: any) => a + (c.totalLessons || 0), 0) : 0 },].map((stat, i) => (
                            <div key={i} style={{
                                backgroundColor: 'var(--cream-light)',
                                borderRadius: '16px',
                                border: '1px solid var(--border)',
                                padding: '24px',
                            }}>
                                <p style={{
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '8px',
                                }}>
                                    {stat.label}
                                </p>
                                <p style={{
                                    fontFamily: 'var(--font-cormorant)',
                                    fontSize: '2.5rem',
                                    fontWeight: '700',
                                    color: '#7C2D3E',
                                }}>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                </div>

                {/* Courses list */}
                {loading ? (
                    <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
                ) : courses.length === 0 ? (
                    <div style={{
                        backgroundColor: 'var(--cream-light)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        padding: '60px',
                        textAlign: 'center',
                    }}>
                        <p style={{
                            fontFamily: 'var(--font-inter)',
                            color: 'var(--text-muted)',
                            marginBottom: '20px',
                        }}>
                            You haven't created any courses yet.
                        </p>
                        <Link href="/instructor/courses/new" style={{
                            backgroundColor: '#7C2D3E',
                            color: 'white',
                            padding: '12px 28px',
                            borderRadius: '100px',
                            fontFamily: 'var(--font-inter)',
                            fontWeight: '500',
                            textDecoration: 'none',
                        }}>
                            Create Your First Course
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {courses.map(course => (
                            <div key={course.courseID} style={{
                                backgroundColor: 'var(--cream-light)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                padding: '24px',
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'center',
                            }}>
                                {/* Thumbnail */}
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '12px',
                                    backgroundColor: 'var(--teal)',
                                    flexShrink: 0,
                                    backgroundImage: course.thumbnailURL ? `url(${course.thumbnailURL})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }} />

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontFamily: 'var(--font-cormorant)',
                                        fontSize: '1.3rem',
                                        fontWeight: '600',
                                        color: 'var(--text)',
                                        marginBottom: '6px',
                                    }}>
                                        {course.title}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <span style={{
                                            fontFamily: 'var(--font-inter)',
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                        }}>
                                            {course.difficulty}
                                        </span>
                                        <span style={{
                                            fontFamily: 'var(--font-inter)',
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                        }}>
                                            {(course as any).totalLessons || 0} lessons
                                        </span>
                                        <span style={{
                                            fontFamily: 'var(--font-inter)',
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                        }}>
                                            {course.totalEnrolled || 0} students
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                < div style={{ display: 'flex', gap: '10px' }}>
                                    <Link href={`/instructor/courses/${course.courseID}/lesson/new`} style={{
                                        backgroundColor: 'var(--teal)',
                                        color: 'white',
                                        padding: '8px 18px',
                                        borderRadius: '100px',
                                        fontFamily: 'var(--font-inter)',
                                        fontSize: '0.82rem',
                                        fontWeight: '500',
                                        textDecoration: 'none',
                                    }}>
                                        + Add Lesson
                                    </Link>
                                    <Link href={`/instructor/courses/${course.courseID}/edit`} style={{
                                        backgroundColor: 'transparent',
                                        color: 'var(--text-secondary)',
                                        padding: '8px 18px',
                                        borderRadius: '100px',
                                        fontFamily: 'var(--font-inter)',
                                        fontSize: '0.82rem',
                                        fontWeight: '500',
                                        textDecoration: 'none',
                                        border: '1.5px solid var(--border)',
                                    }}>
                                        Edit
                                    </Link>

                                </div>
                            </div>
                        ))}
                    </div>
                )
                }
            </div >
        </div >
    )
}