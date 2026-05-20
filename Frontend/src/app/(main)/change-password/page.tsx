'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/services/api'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      await apiFetch('/Auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      })
      setSuccess(true)
      setTimeout(() => router.push('/profile'), 2000)
    } catch {
      setError('Failed to change password. Check your current password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--cream)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        backgroundColor: 'var(--cream-light)',
        borderRadius: '24px',
        border: '1px solid var(--border)',
        padding: '56px 48px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '8px',
          }}>
            Change Password
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}>
            Keep your account secure with a strong password
          </p>
        </div>

        {/* Success message */}
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
            textAlign: 'center',
          }}>
            Password changed successfully! Redirecting...
          </div>
        )}

        {/* Error */}
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
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Current Password */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
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

          {/* New Password */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
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

          {/* Confirm New Password */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
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
            onClick={handleSubmit}
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
            {loading ? 'Updating...' : 'Update Password'}
          </button>

          {/* Back link */}
          <button
            onClick={() => router.back()}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}