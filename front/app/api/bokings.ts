import type { Error } from '@/types/Error'
import { apiFetch } from '@/api/fetcher'

interface BookingSuccess {
  message: string
}

export function bokingsApi() {
  async function payBooking(id: number): Promise<BookingSuccess> {
    try {
      return await apiFetch<BookingSuccess>(`/bookings/${id}/payments`, {
        method: 'POST',
      })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка оплаты бронирования' }) as Error
    }
  }

  return { payBooking }
}