import { ref } from 'vue'
import { authApi } from '@/api/auth'
import type { Error as ApiError } from '@/types/Error'

export function useLogin() {
  const username = ref('')
  const password = ref('')
  const serverError = ref<string | null>(null)
  const isLoading = ref(false)

  const submit = async (): Promise<{ token: string } | null> => {
    serverError.value = null
    isLoading.value = true
    try {
      const { login } = authApi()
      return await login(username.value, password.value)
    } catch (e) {
      const err = e as ApiError
      serverError.value = err.message ?? 'Ошибка входа'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    username,
    password,
    serverError,
    isLoading,
    submit,
  }
}
