import { apiFetch } from './api'

export const instructorService = {
  async getProfile() {
    return apiFetch('/Instructor/profile')
  },

  async updateProfile(data: {
    bio: string
    experienceYears: number
    profilePicture: string
    firstName: string
    lastName: string
  }) {
    return apiFetch('/Instructor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async getCourses() {
    return apiFetch('/Instructor/courses')
  },
}