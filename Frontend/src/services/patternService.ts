import { apiFetch } from './api'

export const patternService = {
  async getAll() {
    return apiFetch('/patterns')
  },

  async getById(id: number) {
    return apiFetch(`/patterns/${id}`)
  },
}