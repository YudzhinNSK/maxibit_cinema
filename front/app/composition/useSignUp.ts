import { ref, reactive } from 'vue'
import { authApi } from '@/api/auth'
import type { Error as ApiError } from '@/types/Error'

const LOGIN_MIN_LENGTH = 8
const PASSWORD_MIN_LENGTH = 8
const withoutCyrillic = (v: string) => v.replace(/[а-яА-ЯёЁ]/g, '')

export function useSignUp() {
  const username = ref('')
  const password = ref('')
  const passwordRepeat = ref('')

  const errors = reactive<{
    username: string | null
    password: string | null
    passwordRepeat: string | null
  }>({
    username: null,
    password: null,
    passwordRepeat: null,
  })

  const serverError = ref<string | null>(null)
  const isLoading = ref(false)


  const onUsernameInput = (e: Event) => {
    const el = e.target as HTMLInputElement
    const sanitized = withoutCyrillic(el.value)
    el.value = sanitized
    username.value = sanitized
  }

  const onPasswordInput = (e: Event) => {
    const el = e.target as HTMLInputElement
    const sanitized = withoutCyrillic(el.value)
    el.value = sanitized
    password.value = sanitized
  }

  const onPasswordRepeatInput = (e: Event) => {
    const el = e.target as HTMLInputElement
    const sanitized = withoutCyrillic(el.value)
    el.value = sanitized
    passwordRepeat.value = sanitized
  }

  const validate = (): boolean => {
    serverError.value = null
    errors.username = validateLogin(username.value)
    errors.password = validatePassword(password.value)
    errors.passwordRepeat =
      password.value !== passwordRepeat.value ? 'Пароли не совпадают' : null
    return !errors.username && !errors.password && !errors.passwordRepeat
  }

  const validateLogin = (value: string): string | null => {
    if (value.length < LOGIN_MIN_LENGTH) return `Минимум ${LOGIN_MIN_LENGTH} символов`
    return null
  }

  const validatePassword = (value: string): string | null => {
    if (value.length < PASSWORD_MIN_LENGTH) return `Минимум ${PASSWORD_MIN_LENGTH} символов`
    if (!/[A-Z]/.test(value)) return 'Нужна минимум 1 заглавная буква'
    if (!/\d/.test(value)) return 'Нужна минимум 1 цифра'
    return null
  }

  const submit = async (): Promise<{ token: string } | null> => {
    if (!validate()) return null
    isLoading.value = true
    serverError.value = null
    try {
      const { signUp } = authApi()
      return await signUp(username.value, password.value)
    } catch (e) {
      const err = e as ApiError
      serverError.value = err.message ?? 'Ошибка регистрации'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    username,
    password,
    passwordRepeat,
    errors,
    serverError,
    isLoading,
    onUsernameInput,
    onPasswordInput,
    onPasswordRepeatInput,
    validate,
    submit,
  }
}
