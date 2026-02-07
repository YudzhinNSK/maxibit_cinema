import { ref, computed } from 'vue'

const STORAGE_KEY = 'auth_token'

const token = ref('')
const isInitialized = ref(false)

export function userService() {
  const isLoggedIn = computed(() => !!token.value)

  function init() {
    if (!import.meta.client) return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) token.value = stored
    isInitialized.value = true
  }

  function setToken(value: string) {
    if (!import.meta.client) return
    token.value = value 
    localStorage.setItem(STORAGE_KEY, value)
  }

  function clearToken() {
    if (!import.meta.client) return
    token.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    token,
    isLoggedIn,
    isInitialized,
    init,
    setToken,
    clearToken,
  }
}
