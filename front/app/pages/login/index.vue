<template>
  <div class="login-page">
    <h1 class="login-page__title">Вход</h1>
    <form class="form" @submit.prevent="onSubmit">
      <div class="form__field">
        <label class="form__label" for="username">Логин</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="form__input"
          autocomplete="username"
          placeholder="Введите логин"
        />
      </div>
      <div class="form__field">
        <label class="form__label" for="password">Пароль</label>
        <div class="form__input-wrap">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="form__input"
            autocomplete="current-password"
            placeholder="Введите пароль"
          />
          <button
            type="button"
            class="form__toggle-password"
            :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
            @click="showPassword = !showPassword"
          >
            <svg v-if="showPassword" class="form__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <svg v-else class="form__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
      <p v-if="serverError" class="form__server-error">{{ serverError }}</p>
      <button type="submit" class="form__submit" :disabled="isLoading">
        {{ isLoading ? 'Вход…' : 'Войти' }}
      </button>
      <p class="form__link">
        <NuxtLink to="/signUp">Нет аккаунта? Регистрация</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLogin } from '@/composition/useLogin'
import { userService } from '@/services/user'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()
const { username, password, serverError, isLoading, submit } = useLogin()
const showPassword = ref(false)

async function onSubmit() {
  const result = await submit()
  if (result?.token) {
    userService().setToken(result.token)
    router.push('/movies')
  }
}

watch(
  () => userService().isInitialized.value,
  (initialized) => {
    if (!initialized) return
    if (userService().isLoggedIn.value) {
      router.push('/movies')
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 32px 0;
}

.login-page__title {
  font-size: 28px;
  margin-bottom: 24px;
  color: #1a1a2e;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form__server-error {
  padding: 12px;
  background: #fee;
  color: #c00;
  border-radius: 8px;
  font-size: 14px;
}

.form__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form__label {
  font-weight: 500;
  color: #333;
}

.form__input-wrap {
  position: relative;
  display: block;

  .form__input {
    width: 100%;
    padding: 12px 44px 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
  }

  &:focus-within .form__input {
    border-color: #1a1a2e;
    outline: none;
  }
}

.form__toggle-password {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
}

.form__toggle-icon {
  width: 22px;
  height: 22px;
}

.form__toggle-password:hover {
  color: #1a1a2e;
  background: rgba(0, 0, 0, 0.04);
}

.form__input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;

  &::placeholder {
    color: #999;
  }
}

.form__submit {
  margin-top: 8px;
  padding: 12px 24px;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.form__submit:hover:not(:disabled) {
  background: #16213e;
}

.form__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form__link {
  text-align: center;
  font-size: 14px;
}

.form__link a {
  color: #1a1a2e;
  text-decoration: none;
}

.form__link a:hover {
  text-decoration: underline;
}
</style>
