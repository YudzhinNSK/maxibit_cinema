import type { Error } from '@/types/Error'
import type { Movie } from '@/types/Movie'
import type { Session } from '~/types/Session'
import { API_URL } from '@/env.json'
import { apiFetch } from '@/api/fetcher'

export function moviesApi() {
  async function getMovies(): Promise<Movie[]> {
    try {
      const response = await apiFetch<Movie[]>('/movies', { method: 'GET' })
      return response.map((item) => ({ ...item, posterImage: `${API_URL}${item.posterImage}` }))
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения списка фильмов' }) as Error
    }
  }

  async function getMovie(id: number): Promise<Movie> {
    try {
      const response = await apiFetch<Movie>(`/movies/${id}`, { method: 'GET' })
      return { ...response, posterImage: `${API_URL}${response.posterImage}` }
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения фильма' }) as Error
    }
  }

  async function getMovieSessions(id: number): Promise<Session[]> {
    try {
      return await apiFetch<Session[]>(`/movies/${id}/sessions`, { method: 'GET' })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения списка сеансов фильма' }) as Error
    }
  }

  return { getMovies, getMovieSessions, getMovie }
}
