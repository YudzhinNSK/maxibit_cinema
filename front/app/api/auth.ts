import type { Error } from '@/types/Error'
import { API_URL } from '@/env.json'
import { apiFetch } from '@/api/fetcher'

interface AuthSuccess {
  token: string
}

export function authApi() {
  async function signUp(
    username: string,
    password: string
  ): Promise<AuthSuccess> {
    try {
      return await apiFetch<AuthSuccess>('/register', {
        method: 'POST',
        body: { username, password },
        skipAuthRedirect: true,
      })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка регистрации' }) as Error
    }
  }

  async function login(username: string, password: string): Promise<AuthSuccess> {
    try {
      return await apiFetch<AuthSuccess>('/login', {
        method: 'POST',
        body: { username, password },
        skipAuthRedirect: true,
      })
    } catch (e: unknown) {
      const err = (e as { data?: Error })?.data
      throw (err ?? { message: 'Ошибка входа' }) as Error
    }
  }

  return { signUp, login }
}
