import type { Error } from '@/types/Error'
import type { Cinema } from '@/types/Cinema'
import type { Session } from '~/types/Session'
import { apiFetch } from '@/api/fetcher'

export function cinemasApi() {
  async function getCinemas(): Promise<Cinema[]> {
    try {
      return await apiFetch<Cinema[]>('/cinemas', { method: 'GET' })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения списка кинотеатров' }) as Error
    }
  }

  async function getCinema(id: number): Promise<Cinema> {
    try {
      return await apiFetch<Cinema>(`/cinemas/${id}`, { method: 'GET' })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения кинотеатра' }) as Error
    }
  }

  async function getCinemaSessions(id: number): Promise<Session[]> {
    try {
      return await apiFetch<Session[]>(`/cinemas/${id}/sessions`, { method: 'GET' })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения списка сеансов' }) as Error
    }
  }

  return { getCinemas, getCinemaSessions, getCinema }
}
