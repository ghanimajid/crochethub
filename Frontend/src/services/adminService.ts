import { apiFetch } from './api'

export const adminService = {
  async getDashboard() {
    return apiFetch('/Admin/dashboard')
  },

  async getUsers() {
    return apiFetch('/Admin/users')
  },

  async deleteUser(id: number) {
    return apiFetch(`/Admin/users/${id}`, {
      method: 'DELETE',
    })
  },

  async changeUserRole(id: number, roleID: number) {
    return apiFetch(`/Admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ roleID }),
    })
  },

  async getCourses() {
    return apiFetch('/Admin/courses')
  },

  async getForum() {
    return apiFetch('/Admin/forum')
  },

  async deleteThread(id: number) {
    return apiFetch(`/Admin/forum/${id}`, {
      method: 'DELETE',
    })
  },

  async getStats() {
    const [forum, patterns] = await Promise.all([
      apiFetch('/Admin/stats/forum'),
      apiFetch('/Admin/stats/patterns'),
    ])
    return { forum, patterns }
  },
}