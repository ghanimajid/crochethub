import { apiFetch } from './api'

export const courseService = {
  async getAll() {
    return apiFetch('/courses')
  },

  async getById(id: number) {
    return apiFetch(`/courses/${id}`)
  },

  async enroll(courseId: number) {
    return apiFetch(`/courses/${courseId}/enroll`, {
      method: 'POST',
    })
  },
}