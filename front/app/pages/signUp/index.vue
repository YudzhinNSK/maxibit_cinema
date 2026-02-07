<template>
  <div class="register-page">
    <h1 class="register-page__title">Регистрация</h1>
    <form class="form" @submit.prevent="onSubmit">
      <div class="form__field">
        <label class="form__label" for="username">Логин</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="form__input"
          :class="{ 'form__input--error': errors.username }"
          autocomplete="username"
          placeholder="Введите логин"
          @input="onUsernameInput"
        />
        <p v-if="errors.username" class="form__error">{{ errors.username }}</p>
      </div>
      <div class="form__field">
        <label class="form__label" for="password">Пароль</label>
        <div class="form__input-wrap">
          <input
            id="password"
            :value="password"
            :type="showPassword ? 'text' : 'password'"
            class="form__input"
            :class="{ 'form__input--error': errors.password }"
            autocomplete="new-password"
            placeholder="Введите пароль"
            @input="onPasswordInput"
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
        <p v-if="errors.password" class="form__error">{{ errors.password }}</p>
      </div>
      <div class="form__field">
        <label class="form__label" for="passwordRepeat">Повтор пароля</label>
        <div class="form__input-wrap">
          <input
            id="passwordRepeat"
            :value="passwordRepeat"
            :type="showPasswordRepeat ? 'text' : 'password'"
            class="form__input"
            :class="{ 'form__input--error': errors.passwordRepeat }"
            autocomplete="new-password"
            placeholder="Повторите пароль"
            @input="onPasswordRepeatInput"
          />
          <button
            type="button"
            class="form__toggle-password"
            :aria-label="showPasswordRepeat ? 'Скрыть пароль' : 'Показать пароль'"
            @click="showPasswordRepeat = !showPasswordRepeat"
          >
            <svg v-if="showPasswordRepeat" class="form__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <svg v-else class="form__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
        <p v-if="errors.passwordRepeat" class="form__error">{{ errors.passwordRepeat }}</p>
      </div>
      <p v-if="serverError" class="form__server-error">{{ serverError }}</p>
      <button type="submit" class="form__submit" :disabled="isLoading">
        {{ isLoading ? 'Регистрация…' : 'Зарегистрироваться' }}
      </button>
      <p class="form__link">
        <NuxtLink to="/login">Уже есть аккаунт? Вход</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSignUp } from '@/composition/useSignUp'
import { userService } from '@/services/user'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()
const {
  username,
  password,
  passwordRepeat,
  errors,
  serverError,
  isLoading,
  submit,
  onUsernameInput,
  onPasswordInput,
  onPasswordRepeatInput,
} = useSignUp()

const showPassword = ref(false)
const showPasswordRepeat = ref(false)

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
.register-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 32px 0;
}

.register-page__title {
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
    box-sizing: border-box;
  }

  &:focus-within .form__input {
    border-color: #1a1a2e;
    outline: none;
  }

  .form__input--error {
    border-color: #c00;
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

  &--error {
    border-color: #c00;
  }

  &::placeholder {
    color: #999;
  }
}

.form__error {
  font-size: 14px;
  color: #c00;
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

  &:hover:not(:disabled) {
    background: #16213e;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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
