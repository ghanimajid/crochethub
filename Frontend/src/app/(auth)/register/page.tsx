'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/authService'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [genderID, setGenderID] = useState(1)
  const [role, setRole] = useState('Student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length

  async function handleRegister() {
    if (!firstName || !lastName || !email || !password || !dateOfBirth) {
      setError('Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    // Check all password requirements
    if (!passwordChecks.length || !passwordChecks.uppercase ||
      !passwordChecks.lowercase || !passwordChecks.number ||
      !passwordChecks.special) {
      setError('Password does not meet all requirements')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        dateOfBirth,
        genderID,
        role,
      })
      router.push('/login')
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '100vh',
      backgroundColor: 'var(--cream)',
    }}>

      {/* Left side */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
      }}>
        {/* Background image */}
        <img
          src="/images/05.jfif"
          alt="background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(62, 63, 63, 0.65)',
          zIndex: 1,
        }} />

        {/* All content sits above overlay */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}>
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <g transform="translate(50,52)">
                <line x1="0" y1="-48" x2="0" y2="-40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-34" y1="-34" x2="-28" y2="-28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="30" y1="-35" x2="25" y2="-29" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-48" y1="0" x2="-40" y2="0" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="0" cy="4" r="32" stroke="white" strokeWidth="2.5" fill="none" />
                <path d="M-30 -10 Q0 -20 30 -10" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M-32 4 Q0 -6 32 4" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M-30 18 Q0 8 30 18" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M-16 -28 Q-12 4 -14 34" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M0 -30 Q2 4 0 36" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M16 -28 Q12 4 14 34" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M-24 34 Q-32 40 -34 46 Q-36 50 -32 49" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <line x1="18" y1="-24" x2="30" y2="-46" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <line x1="30" y1="-46" x2="34" y2="-52" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path d="M34 -52 Q40 -58 41 -50 Q42 -44 36 -42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            </svg>
            <span style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'white',
              opacity: 0.9,
            }}>
              CrochetHub
            </span>
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 2, marginTop: '-120px' }}>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '3rem',
            fontWeight: '700',
            color: 'white',
            lineHeight: '1.2',
            marginBottom: '20px',
          }}>
            Craft your<br />
            sanctuary,<br />
            <span style={{ fontStyle: 'italic' }}>stitch by stitch.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.95rem',
            color: 'white',
            lineHeight: '1.7',
            opacity: 0.9,
            maxWidth: '360px',
          }}>
            Join a global community of makers where every hook, yarn, and pattern tells a story of patience and creativity.
          </p>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          <div style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.7rem',
            color: 'white',
            letterSpacing: '0.1em',
            fontWeight: '600',
            marginBottom: '8px',
            opacity: 0.8,
          }}>
            JOIN OUR COMMUNITY
          </div>
          <div style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: 'white',
          }}>
            12,000+ crafters already stitching
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        backgroundColor: 'var(--cream-light)',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '2.2rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '8px',
            }}>
              Create Account
            </h1>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}>
              Pick up your hook and start your journey
            </p>
          </div>

          {/* Role toggle */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--border)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
          }}>
            <button
              onClick={() => setRole('Student')}
              style={{
                padding: '10px',
                backgroundColor: role === 'Student' ? 'var(--teal)' : 'transparent',
                color: role === 'Student' ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Student
            </button>
            <button
              onClick={() => setRole('Instructor')}
              style={{
                padding: '10px',
                backgroundColor: role === 'Instructor' ? 'var(--teal)' : 'transparent',
                color: role === 'Instructor' ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Instructor
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#FDF0EE',
              border: '1px solid #E8B4A8',
              color: '#C0392B',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Jane"
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
                  marginBottom: '6px',
                }}>
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Stitcher"
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

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="jane@crochethub.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
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

            {/* Date of birth */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
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
                marginBottom: '6px',
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

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
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

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div style={{ marginTop: '-8px' }}>
                {/* Strength bar */}
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '8px',
                }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: i <= passwordStrength
                        ? passwordStrength <= 2 ? '#E8B4A8'
                          : passwordStrength <= 3 ? '#E8C84B'
                            : '#2D6B5E'
                        : 'var(--border)',
                      transition: 'background-color 0.2s',
                    }} />
                  ))}
                </div>

                {/* Requirement checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { check: passwordChecks.length, label: 'At least 8 characters' },
                    { check: passwordChecks.uppercase, label: 'One uppercase letter (A-Z)' },
                    { check: passwordChecks.lowercase, label: 'One lowercase letter (a-z)' },
                    { check: passwordChecks.number, label: 'One number (0-9)' },
                    { check: passwordChecks.special, label: 'One special character (!@#$...)' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: item.check ? '#2D6B5E' : '#FDF0EE',
                        border: item.check ? 'none' : '1.5px solid #E8B4A8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}>
                        {item.check ? (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                            <path d="M1 1L5 5M5 1L1 5" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.75rem',
                        color: item.check ? '#2D6B5E' : '#C0392B',
                        transition: 'color 0.2s',
                      }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Confirm Password */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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

            {/* Terms */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                style={{ marginTop: '3px', accentColor: 'var(--teal)' }}
              />
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: '1.5',
              }}>
                I agree to the Community Guidelines and understand how my yarn collection data is used.
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: loading ? '#9BA8A3' : 'var(--teal)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
              }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </div>

          <p style={{
            textAlign: 'center',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginTop: '24px',
          }}>
            Already have an account?{' '}
            <Link href="/login" style={{
              color: 'var(--teal)',
              fontWeight: '600',
              textDecoration: 'none',
            }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}