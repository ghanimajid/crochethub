import { apiFetch } from './api'

export const authService = {
  async login(email: string, password: string) {
    return apiFetch('/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async register(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    dateOfBirth: string
    genderID: number
    role: string
  }) {
    return apiFetch('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}