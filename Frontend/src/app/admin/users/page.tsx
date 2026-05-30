'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface User {
  userID: number
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

const roleColors: Record<string, { bg: string; color: string }> = {
  Admin: { bg: '#FEE8E8', color: '#9B2C2C' },
  Instructor: { bg: '#E8F5F0', color: '#2D7A5E' },
  Student: { bg: '#EEF0FE', color: '#4338CA' },
}

export default function AdminUsersPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [changingRole, setChangingRole] = useState<number | null>(null)
  const [deletingUser, setDeletingUser] = useState<number | null>(null)

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user?.role !== 'Admin') { router.push('/'); return }

    apiFetch('/Admin/users')
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn, user, router])

  async function handleChangeRole(userID: number, newRoleID: number) {
    setChangingRole(userID)
    try {
      await apiFetch(`/Admin/users/${userID}/role`, {
        method: 'PUT',
        body: JSON.stringify({ roleID: newRoleID }),
      })
      const roleMap: Record<number, string> = { 6: 'Student', 7: 'Instructor', 8: 'Admin' }
      setUsers(prev => prev.map(u =>
        u.userID === userID ? { ...u, role: roleMap[newRoleID] } : u
      ))
    } catch {
      alert('Failed to change role.')
    } finally {
      setChangingRole(null)
    }
  }

  async function handleDelete(userID: number) {
    if (!confirm('Delete this user? This cannot be undone.')) return
    setDeletingUser(userID)
    try {
      await apiFetch(`/Admin/users/${userID}`, { method: 'DELETE' })
      setUsers(prev => prev.filter(u => u.userID !== userID))
    } catch {
      alert('Failed to delete user.')
    } finally {
      setDeletingUser(null)
    }
  }

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>

        <a href="/admin/dashboard" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>
          ← Back to Dashboard
        </a>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
            fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
          }}>
            Manage Users
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
            {users.length} total users
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '480px', padding: '14px 20px',
            backgroundColor: 'white', border: '1.5px solid var(--border)',
            borderRadius: '100px', fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem', color: 'var(--text)', outline: 'none',
            display: 'block', marginBottom: '24px', boxSizing: 'border-box',
          }}
        />

        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(u => (
              <div key={u.userID} style={{
                backgroundColor: 'var(--cream-light)',
                border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                {/* Avatar */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  backgroundColor: 'var(--teal)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-cormorant)', fontSize: '1.2rem',
                  fontWeight: '700', flexShrink: 0,
                }}>
                  {u.firstName?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem',
                    fontWeight: '600', color: 'var(--text)', marginBottom: '2px',
                  }}>
                    {u.firstName} {u.lastName}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.82rem', color: 'var(--text-muted)',
                  }}>
                    {u.email}
                  </p>
                </div>

                {/* Role badge */}
                <span style={{
                  backgroundColor: roleColors[u.role]?.bg || 'var(--cream)',
                  color: roleColors[u.role]?.color || 'var(--text-muted)',
                  padding: '4px 12px', borderRadius: '100px',
                  fontFamily: 'var(--font-inter)', fontSize: '0.78rem', fontWeight: '600',
                }}>
                  {u.role}
                </span>

                {/* Change role */}
                {u.role !== 'Admin' && (
                  <select
                    value=""
                    onChange={e => {
                      if (e.target.value) handleChangeRole(u.userID, Number(e.target.value))
                    }}
                    disabled={changingRole === u.userID}
                    style={{
                      padding: '8px 12px', backgroundColor: 'white',
                      border: '1.5px solid var(--border)', borderRadius: '8px',
                      fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                      color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none',
                    }}
                  >
                    <option value="">Change role...</option>
                    <option value="6">Student</option>
                    <option value="7">Instructor</option>
                    <option value="8">Admin</option>
                  </select>
                )}

                {/* Delete */}
                {u.role !== 'Admin' && (
                  <button
                    onClick={() => handleDelete(u.userID)}
                    disabled={deletingUser === u.userID}
                    style={{
                      backgroundColor: 'transparent', border: '1.5px solid #E8B4A8',
                      color: '#C0392B', padding: '8px 16px', borderRadius: '100px',
                      fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                      fontWeight: '500', cursor: 'pointer',
                    }}
                  >
                    {deletingUser === u.userID ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}