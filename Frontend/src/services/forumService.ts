import { apiFetch } from './api'

export const forumService = {
  async getAllThreads() {
    return apiFetch('/forum/threads')
  },

  async getThread(id: number) {
    return apiFetch(`/forum/threads/${id}`)
  },

  async createThread(data: {
    title: string
    content: string
    category: string
  }) {
    return apiFetch('/forum/threads', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async createReply(threadId: number, content: string) {
    return apiFetch(`/forum/threads/${threadId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  },
}