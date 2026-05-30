'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'


function EnrolledCourses() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch('/Student/enrollments'),
      fetch('https://localhost:7167/api/Course').then(r => r.json())
    ])
      .then(([enrollData, coursesData]) => {
        const enrollments = Array.isArray(enrollData) ? enrollData : []
        const courses = Array.isArray(coursesData) ? coursesData : []
        const merged = enrollments.map((e: any) => {
          const full = courses.find((c: any) => c.courseID === e.courseID)
          return { ...e, thumbnailURL: full?.thumbnailURL || '' }
        })
        setEnrollments(merged)
      })
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
  )

  if (enrollments.length === 0) return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    }}>
      {enrollments.map((enrollment: any, i: number) => (
        <a key={i} href={`/courses/${enrollment.courseID}`} style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              height: '140px',
              backgroundImage: enrollment.thumbnailURL
                ? `url(${enrollment.thumbnailURL})`
                : undefined,
              backgroundColor: enrollment.thumbnailURL ? undefined : 'var(--teal)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
            <div style={{ padding: '16px' }}>
              <p style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '4px',
              }}>
                {enrollment.courseTitle || enrollment.courseName || enrollment.title}
              </p>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}>
                {enrollment.difficulty}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

function SavedPatterns() {
  const [patterns, setPatterns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/Favorite')
      .then(data => setPatterns(Array.isArray(data) ? data : []))
      .catch(() => setPatterns([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
  )

  if (patterns.length === 0) return (
    <div style={{ textAlign: 'center', padding: '48px' }}>
      <p style={{
        fontFamily: 'var(--font-inter)',
        color: 'var(--text-muted)',
        marginBottom: '16px',
      }}>
        You haven't saved any patterns yet.
      </p>
      <a href="/patterns" style={{
        display: 'inline-block',
        backgroundColor: 'var(--teal)',
        color: 'white',
        padding: '10px 24px',
        borderRadius: '100px',
        fontFamily: 'var(--font-inter)',
        fontSize: '0.875rem',
        fontWeight: '500',
        textDecoration: 'none',
      }}>
        Browse Patterns
      </a>
    </div>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    }}>
      {patterns.map((pattern: any) => (
        <a key={pattern.patternID} href={`/patterns/${pattern.patternID}`} style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            {pattern.thumbnailURL && (
              <div style={{
                height: '140px',
                backgroundImage: `url(${pattern.thumbnailURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
            )}
            <div style={{ padding: '16px' }}>
              <p style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '4px',
              }}>
                {pattern.title}
              </p>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}>
                {pattern.difficulty} · by {pattern.creatorName}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export default function ProfilePage() {
  const { user, isLoggedIn, token, login, refreshUser, logout } = useAuth()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/')
  }

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [genderID, setGenderID] = useState(1)
  const [experienceYears, setExperienceYears] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')


  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setBio((user as any).bio || '')
      setProfilePicture((user as any).profilePicture || '')

      setExperienceYears((user as any)?.experienceYears || 0)

      setDateOfBirth(
        (user as any).dateOfBirth
          ? (user as any).dateOfBirth.split('T')[0]
          : ''
      )
      // convert gender string to ID
      const genderMap: Record<string, number> = {
        'Male': 1,
        'Female': 2,
      }
      const genderStr = (user as any).gender || ''
      setGenderID(genderMap[genderStr] || 1)
    }
  }, [user, isLoggedIn, router])

  async function handleUpdateProfile() {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (user?.role === 'Instructor') {
        await apiFetch('/Instructor/profile', {
          method: 'PUT',
          body: JSON.stringify({
            firstName,
            lastName,
            bio,
            profilePicture,
            experienceYears,
          }),
        })
      } else {
        await apiFetch('/Auth/update-profile', {
          method: 'PUT',
          body: JSON.stringify({
            firstName,
            lastName,
            bio,
            profilePicture,
            dateOfBirth: dateOfBirth
              ? new Date(dateOfBirth).toISOString()
              : new Date().toISOString(),
            genderID,
          }),
        })
      }

      await refreshUser()
      setSuccess(true)
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tabStyle = (tab: string) => ({
    padding: '10px 24px',
    backgroundColor: activeTab === tab ? '#7C2D3E' : 'transparent',
    color: activeTab === tab ? 'white' : 'var(--text-secondary)',
    border: '1.5px solid',
    borderColor: activeTab === tab ? '#7C2D3E' : 'var(--border)',
    borderRadius: '100px',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
  })

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 48px' }}>

        {/* Profile header */}
        <div style={{
          backgroundColor: 'var(--cream-light)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid var(--border)',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {(user as any)?.profilePicture ? (
              <img
                src={(user as any).profilePicture}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8" fill="none" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '4px',
            }}>
              {user?.firstName} {user?.lastName}
            </h1>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
            }}>
              {user?.email}
            </p>
            <span style={{
              display: 'inline-block',
              marginTop: '8px',
              backgroundColor: 'var(--teal-light)',
              color: 'var(--teal)',
              padding: '3px 12px',
              borderRadius: '100px',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}>
              {user?.role}
            </span>

            {user?.role === 'Instructor' && (
              <div style={{
                display: 'flex',
                gap: '20px',
                marginTop: '12px',
              }}>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '2px',
                  }}>
                    Experience
                  </p>

                  <p style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--text)',
                  }}>
                    {(user as any)?.experienceYears || 0} years
                  </p>
                </div>

                <div>
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '2px',
                  }}>
                    Rating
                  </p>

                  <p style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#7C2D3E',
                  }}>
                    {(user as any)?.overallRating || 0} ★
                  </p>
                </div>
              </div>
            )}

          </div>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                border: '1.5px solid #7C2D3E',
                padding: '10px 24px',
                borderRadius: '100px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#7C2D3E',
                cursor: 'pointer',
                transition: '0.2s',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
        }}>
          <button style={tabStyle('profile')} onClick={() => setActiveTab('profile')}>
            Edit Profile
          </button>
          <button style={tabStyle('password')} onClick={() => setActiveTab('password')}>
            Change Password
          </button>
          {user?.role === 'Student' && (
            <button
              style={tabStyle('courses')}
              onClick={() => setActiveTab('courses')}
            >
              My Courses
            </button>
          )}
          {user?.role === 'Student' && (
            <button style={tabStyle('savedPatterns')} onClick={() => setActiveTab('savedPatterns')}>
              Saved Patterns
            </button>
          )}
        </div>

        {/* Edit Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{
            backgroundColor: 'var(--cream-light)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid var(--border)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.8rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '32px',
            }}>
              Update Profile
            </h2>

            {success && (
              <div style={{
                backgroundColor: '#E8F5F0',
                border: '1px solid #2D6B5E',
                color: '#2D6B5E',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '24px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
              }}>
                Profile updated successfully!
              </div>
            )}

            {error && (
              <div style={{
                backgroundColor: '#FDF0EE',
                border: '1px solid #E8B4A8',
                color: '#C0392B',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '24px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}>
                    First Name
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'white',
                      border: '1.5px solid var(--border)',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}>
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'white',
                      border: '1.5px solid var(--border)',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}>
                  Bio
                </label>

                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'white',
                    border: '1.5px solid var(--border)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    lineHeight: '1.6',
                  }}
                />
              </div>

              {user?.role === 'Instructor' && (
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}>
                    Years of Experience
                  </label>

                  <input
                    type="number"
                    value={experienceYears}
                    onChange={e => setExperienceYears(Number(e.target.value))}
                    min={0}
                    style={{
                      width: '120px',
                      padding: '12px 14px',
                      backgroundColor: 'white',
                      border: '1.5px solid var(--border)',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>
              )}

              {/* Profile Picture URL */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}>
                  Profile Picture URL
                </label>

                <input
                  type="text"
                  value={profilePicture}
                  onChange={e => setProfilePicture(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'white',
                    border: '1.5px solid var(--border)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}>
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'white',
                    border: '1.5px solid var(--border)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Gender */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}>
                  Gender
                </label>

                <select
                  value={genderID}
                  onChange={e => setGenderID(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'white',
                    border: '1.5px solid var(--border)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    color: 'var(--text)',
                  }}
                >
                  <option value={1}>Male</option>
                  <option value={2}>Female</option>
                </select>
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                style={{
                  padding: '14px 32px',
                  backgroundColor: loading ? '#9BA8A3' : '#7C2D3E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>

            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div style={{
            backgroundColor: 'var(--cream-light)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid var(--border)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.8rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '8px',
            }}>
              Change Password
            </h2>

            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              marginBottom: '32px',
            }}>
              Keep your account secure with a strong password
            </p>

            <Link href="/change-password" style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'var(--maroon)',
              color: 'white',
              borderRadius: '12px',
              fontFamily: 'var(--font-inter)',
              fontWeight: '600',
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}>
              Go to Change Password →
            </Link>
          </div>
        )}

        {/* My Courses Tab */}
        {activeTab === 'courses' && (
          <div style={{
            backgroundColor: 'var(--cream-light)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid var(--border)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.8rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '24px',
            }}>
              My Courses
            </h2>
            <EnrolledCourses />
          </div>
        )}
        {activeTab === 'savedPatterns' && (
          <div
            style={{
              backgroundColor: 'var(--cream-light)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid var(--border)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '24px',
              }}
            >
              Saved Patterns
            </h2>

            <SavedPatterns />
          </div>
        )}
      </div>
    </div>
  )
}