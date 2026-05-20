'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

export default function ProfilePage() {
  const { user, isLoggedIn, login, token } = useAuth()
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [genderID, setGenderID] = useState(1)
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
    }
  }, [user, isLoggedIn, router])

  async function handleUpdateProfile() {
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      await apiFetch('/Auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          profilePicture,
          dateOfBirth: dateOfBirth || new Date().toISOString(),
          genderID,
        }),
      })
      // Update local user state
      if (token && user) {
        login(token, {
          ...user,
          firstName,
          lastName,
        })
      }
      setSuccess(true)
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tabStyle = (tab: string) => ({
    padding: '10px 24px',
    backgroundColor: activeTab === tab ? 'var(--teal)' : 'transparent',
    color: activeTab === tab ? 'white' : 'var(--text-secondary)',
    border: '1.5px solid',
    borderColor: activeTab === tab ? 'var(--teal)' : 'var(--border)',
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
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2rem',
            color: 'white',
            fontWeight: '700',
            flexShrink: 0,
          }}>
            {user?.firstName?.charAt(0).toUpperCase()}
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
          <button style={tabStyle('courses')} onClick={() => setActiveTab('courses')}>
            My Courses
          </button>
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
                  <option value={1}>Female</option>
                  <option value={2}>Male</option>
                  <option value={3}>Prefer not to say</option>
                </select>
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                style={{
                  padding: '14px 32px',
                  backgroundColor: loading ? '#9BA8A3' : 'var(--teal)',
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
            <div style={{
              textAlign: 'center',
              padding: '48px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-inter)',
            }}>
              <p style={{ fontSize: '2rem', marginBottom: '16px' }}>🧶</p>
              <p style={{ marginBottom: '16px' }}>
                You have not enrolled in any courses yet.
              </p>
              <Link href="/courses" style={{
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
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}