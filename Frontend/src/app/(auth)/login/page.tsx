'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

 async function handleLogin() {
  setLoading(true)
  setError('')
  try {
    const data = await authService.login(email, password)
    const user = {
      userId: data.userID,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
    }
    login(data.token, user)
    router.push('/')
  } catch {
    setError('Invalid email or password')
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

      {/* Left side — visual */}
      <div style={{
        backgroundImage: 'url("/images/7.jfif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
         {/* DARK OVERLAY */}
     <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(84, 82, 82, 0.45)',
      }} />
       <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          textDecoration: 'none',
          opacity: 0.9,
          }}>
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
    <g transform="translate(50,52)">
      <line x1="0" y1="-48" x2="0" y2="-40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="-34" y1="-34" x2="-28" y2="-28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="-35" x2="25" y2="-29" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="-48" y1="0" x2="-40" y2="0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="0" cy="4" r="32" stroke="white" strokeWidth="2.5" fill="none"/>
      <path d="M-30 -10 Q0 -20 30 -10" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M-32 4 Q0 -6 32 4" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M-30 18 Q0 8 30 18" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M-16 -28 Q-12 4 -14 34" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M0 -30 Q2 4 0 36" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M16 -28 Q12 4 14 34" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M-24 34 Q-32 40 -34 46 Q-36 50 -32 49" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <line x1="18" y1="-24" x2="30" y2="-46" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="-46" x2="34" y2="-52" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <path d="M34 -52 Q40 -58 41 -50 Q42 -44 36 -42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
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


        <div>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '3rem',
            fontWeight: '700',
            color: 'var(--teal)',
            opacity: 0.9,
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

        {/* Decorative cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.7rem',
              color: 'var(--teal)',
              letterSpacing: '0.1em',
              fontWeight: '600',
              marginBottom: '8px',
              opacity: 0.9,
            }}>
              LATEST LESSON
            </div>
            <div style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--teal)',
              opacity: 0.9,
            }}>
              Perfecting the Magic Ring
            </div>
          </div>
          <div style={{
            backgroundColor: 'var(--teal)',
            borderRadius: '16px',
            padding: '20px',
            opacity: 0.9,
          }}>
            <div style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.1em',
              fontWeight: '600',
              marginBottom: '8px',
              opacity: 0.9,
            }}>
              COMMUNITY
            </div>
            <div style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
            }}>
              1,402 crafters online
            </div>
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
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '2.2rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '8px',
            }}>
              Welcome back
            </h1>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}>
              Login to continue your crochet journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#FDF0EE',
              border: '1px solid #E8B4A8',
              color: '#C0392B',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="hooker@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <label style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                }}>
                  Password
                </label>
                
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
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
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </div>

          <p style={{
            textAlign: 'center',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginTop: '32px',
          }}>
            New to the hub?{' '}
            <Link href="/register" style={{
              color: 'var(--teal)',
              fontWeight: '600',
              textDecoration: 'none',
            }}>
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

