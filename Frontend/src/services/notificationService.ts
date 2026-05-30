import { apiFetch } from './api'

export const notificationService = {
  async getAll() {
    return apiFetch('/Notification')
  },

  async getUnreadCount() {
    return apiFetch('/Notification/unread-count')
  },

  async markAsRead(id: number) {
    return apiFetch(`/Notification/${id}/read`, { method: 'PUT' })
  },

  async markAllAsRead() {
    return apiFetch('/Notification/read-all', { method: 'PUT' })
  },

  async delete(id: number) {
    return apiFetch(`/Notification/${id}`, { method: 'DELETE' })
  },
}