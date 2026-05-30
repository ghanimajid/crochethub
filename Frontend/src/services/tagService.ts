import { apiFetch } from './api'

export const tagService = {
  async getAll() {
    return apiFetch('/Tag')
  },

  async create(name: string) {
    return apiFetch('/Tag', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  },

  async delete(id: number) {
    return apiFetch(`/Tag/${id}`, {
      method: 'DELETE',
    })
  },
}