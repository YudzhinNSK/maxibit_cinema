import type { Error } from '@/types/Error'
import type { ApplicationSettings } from '@/types/ApplicationSettings'
import { apiFetch } from '@/api/fetcher'

export function settingsApi() {
  async function getSettings(): Promise<ApplicationSettings> {
    try {
      return await apiFetch<ApplicationSettings>('/settings', { method: 'GET' })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка получения настроек приложения' }) as Error
    }
  }

  return { getSettings }
}
