import type { Error } from '@/types/Error'
import type { SessionDetails } from '@/types/SessionDetails'
import type { Seat } from '@/types/Seat'
import { apiFetch } from '@/api/fetcher'

export function movieSessionApi() {
  async function getMovieSession(id: number): Promise<SessionDetails> {
    try {
      return await apiFetch<SessionDetails>(`/movieSessions/${id}`, {
        method: 'GET',
      })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения детальной информации о сеансе' }) as Error
    }
  }

  async function bookSeats(id: number, seats: Seat[]): Promise<void> {
    try {
      return await apiFetch<void>(`/movieSessions/${id}/bookings`, {
        method: 'POST',
        body: { seats },
      })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка бронирования мест' }) as Error
    }
  }

  return { getMovieSession, bookSeats }
}
