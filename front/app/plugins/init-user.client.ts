import { userService } from '@/services/user'

export default defineNuxtPlugin((nuxtApp) => {
  const user = userService()
  user.init()
  nuxtApp.vueApp.provide('user', user)
})
