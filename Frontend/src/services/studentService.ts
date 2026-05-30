import { apiFetch } from './api'

export const studentService = {
  async getDashboard() {
    return apiFetch('/Student/dashboard')
  },

  async getProfile() {
    return apiFetch('/Student/profile')
  },

  async updateProfile(data: {
    firstName: string
    lastName: string
    bio: string
    profilePicture: string
    dateOfBirth: string
    genderID: number
  }) {
    return apiFetch('/Student/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async getEnrollments() {
    return apiFetch('/Student/enrollments')
  },
}