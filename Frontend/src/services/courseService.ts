import { apiFetch } from './api'

export const courseService = {
  async getAll() {
    return apiFetch('/Course')
  },

  async getById(id: number) {
    return apiFetch(`/Course/${id}`)
  },

  async enroll(courseId: number) {
    return apiFetch(`/Course/${courseId}/enroll`, {
      method: 'POST',
    })
  },

  async getProgress(courseId: number) {
    return apiFetch(`/Course/${courseId}/progress`)
  },

  async create(data: {
    title: string
    description: string
    difficultyID: number
    thumbnailURL: string
    tagIDs: number[]
    prerequisiteIDs: number[]
  }) {
    return apiFetch('/Course', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: number, data: {
    title: string
    description: string
    difficultyID: number
    thumbnailURL: string
    tagIDs: number[]
    prerequisiteIDs: number[]
  }) {
    return apiFetch(`/Course/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async delete(id: number) {
    return apiFetch(`/Course/${id}`, {
      method: 'DELETE',
    })
  },
}