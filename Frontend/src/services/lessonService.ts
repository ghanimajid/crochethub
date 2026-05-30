import { apiFetch } from './api'

export const lessonService = {
  async getByCourse(courseId: number) {
    return apiFetch(`/Lesson/course/${courseId}`)
  },

  async getById(id: number) {
    return apiFetch(`/Lesson/${id}`)
  },

  async create(data: {
    courseID: number
    title: string
    videoURL: string
    content: string
    sequenceOrder: number
  }) {
    return apiFetch('/Lesson', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: number, data: {
    title: string
    videoURL: string
    content: string
    sequenceOrder: number
  }) {
    return apiFetch(`/Lesson/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: number) {
    return apiFetch(`/Lesson/${id}`, {
      method: 'DELETE',
    })
  },

  async markComplete(id: number, timeSpent: number) {
    return apiFetch(`/Lesson/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ timeSpent }),
    })
  },
}