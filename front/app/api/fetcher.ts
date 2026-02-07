import { navigateTo } from '#app'
import { API_URL } from '@/env.json'
import { userService } from '@/services/user'

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
}

export interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  skipAuthRedirect?: boolean
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, skipAuthRedirect = false } = options
  const token = userService().token.value
  const url = path.startsWith('http') ? path : `${API_URL}${path}`
  const headers: Record<string, string> = { ...DEFAULT_HEADERS }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return $fetch<T>(url, {
    method,
    ...(body !== undefined && { body: body as Record<string, unknown> }),
    headers,
    async onResponseError({ response }) {
      if (response.status === 401 && !skipAuthRedirect && token) {
        userService().clearToken()
        await navigateTo('/login')
      }
    },
  })
}
