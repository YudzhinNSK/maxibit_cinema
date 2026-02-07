import type { Error } from '@/types/Error'
import type { UserBooking } from '@/types/UserBooking'
import { apiFetch } from '@/api/fetcher'

export function userApi() {
  async function getUserBookings(): Promise<UserBooking[]> {
    try {
      return await apiFetch<UserBooking[]>('/me/bookings', {
        method: 'GET',
      })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения списка бронирований пользователя' }) as Error
    }
  }

  return { getUserBookings }
}
