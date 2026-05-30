'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/services/api'

interface Material {
  materialID?: number
  materialName: string
  quantity: string
}

export default function EditPatternPage() {
  const { id } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficultyID, setDifficultyID] = useState(3)
  const [materials, setMaterials] = useState<Material[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [thumbnailURL, setThumbnailURL] = useState('')

  useEffect(() => {
    apiFetch(`/Pattern/${id}`)
      .then(data => {
        setTitle(data.title || '')
        setDescription(data.description || '')
        const diffMap: Record<string, number> = {
          'Beginner': 3, 'Intermediate': 4, 'Advanced': 5,
        }
        setDifficultyID(diffMap[data.difficulty] || 3)
        setMaterials(data.materials || [])
        setThumbnailURL(data.thumbnailURL || '')
      })
      .catch(() => setError('Failed to load pattern'))
      .finally(() => setFetching(false))
  }, [id])

  function addMaterial() {
    setMaterials(prev => [...prev, { materialName: '', quantity: '' }])
  }

  function removeMaterial(index: number) {
    setMaterials(prev => prev.filter((_, i) => i !== index))
  }

  function updateMaterial(index: number, field: 'materialName' | 'quantity', value: string) {
    setMaterials(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m))
  }

  async function handleUpdate() {
    if (!title) { setError('Title is required'); return }
    setLoading(true)
    setError('')
    try {
      await apiFetch(`/Pattern/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          description,
          thumbnailURL,
          difficultyID,
          courseID: null,
          tagIDs: [],
          materials: materials.filter(m => m.materialName.trim()),
        }),
      })
      setSuccess(true)
      setTimeout(() => router.push('/instructor/patterns'), 1500)
    } catch {
      setError('Failed to update pattern.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '400px', fontFamily: 'var(--font-inter)', color: 'var(--text-muted)',
    }}>
      Loading...
    </div>
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 48px' }}>

        <Link href="/instructor/patterns" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>
          ← Back to My Patterns
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
          fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
        }}>
          Edit Pattern
        </h1>

        {success && (
          <div style={{
            backgroundColor: '#E8F5F0', border: '1px solid #2D6B5E', color: '#2D6B5E',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
            fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          }}>
            Pattern updated! Redirecting...
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#FDF0EE', border: '1px solid #E8B4A8', color: '#C0392B',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
            fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '40px',
          display: 'flex', flexDirection: 'column', gap: '24px',
        }}>
          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px',
            }}>Pattern Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'white',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px',
            }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              rows={4} style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'white',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6',
              }}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Thumbnail URL
            </label>

            <input
              type="text"
              value={thumbnailURL}
              onChange={e => setThumbnailURL(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'white',
                border: '1.5px solid var(--border)',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {thumbnailURL && (
              <img
                src={thumbnailURL}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginTop: '10px',
                }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            )}

            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginTop: '6px',
            }}>
              Tip: upload your image to imgbb.com and paste the direct link here
            </p>
          </div>

          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px',
            }}>Difficulty Level</label>
            <select value={difficultyID} onChange={e => setDifficultyID(Number(e.target.value))}
              style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'white',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box', color: 'var(--text)',
              }}
            >
              <option value={3}>Beginner</option>
              <option value={4}>Intermediate</option>
              <option value={5}>Advanced</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
              fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '12px',
            }}>Materials Needed</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {materials.map((mat, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 36px', gap: '8px' }}>
                  <input type="text" placeholder="Material name" value={mat.materialName}
                    onChange={e => updateMaterial(i, 'materialName', e.target.value)}
                    style={{
                      padding: '10px 14px', backgroundColor: 'white',
                      border: '1.5px solid var(--border)', borderRadius: '10px',
                      fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <input type="text" placeholder="Quantity" value={mat.quantity}
                    onChange={e => updateMaterial(i, 'quantity', e.target.value)}
                    style={{
                      padding: '10px 14px', backgroundColor: 'white',
                      border: '1.5px solid var(--border)', borderRadius: '10px',
                      fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <button onClick={() => removeMaterial(i)} style={{
                    backgroundColor: 'transparent', border: '1.5px solid #E8B4A8',
                    borderRadius: '10px', cursor: 'pointer', color: '#C0392B', fontSize: '1rem',
                  }}>×</button>
                </div>
              ))}
              <button onClick={addMaterial} style={{
                backgroundColor: 'transparent', border: '1.5px dashed var(--border)',
                borderRadius: '10px', padding: '10px', cursor: 'pointer',
                fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
                color: 'var(--text-muted)', textAlign: 'center',
              }}>
                + Add Material
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleUpdate} disabled={loading} style={{
              padding: '14px 32px',
              backgroundColor: loading ? '#9BA8A3' : '#7C2D3E',
              color: 'white', border: 'none', borderRadius: '12px',
              fontFamily: 'var(--font-inter)', fontWeight: '600',
              fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Saving...' : 'Save Changes →'}
            </button>
            <Link href="/instructor/patterns" style={{
              padding: '14px 24px', backgroundColor: 'transparent',
              color: 'var(--text-secondary)', border: '1.5px solid var(--border)',
              borderRadius: '12px', fontFamily: 'var(--font-inter)',
              fontSize: '0.95rem', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}