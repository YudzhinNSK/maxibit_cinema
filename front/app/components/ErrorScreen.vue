<template>
  <div class="error-screen">
    <div class="error-screen__content">
      <p class="error-screen__title">Упс!</p>
      <p class="error-screen__message">
        Что-то пошло не так. Перезагрузите страницу или попробуйте позже.
      </p>
      <Button class="error-screen__btn" @click="reload">Перезагрузить</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue'

const reload = () => {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.error-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.error-screen__content {
  text-align: center;
  padding: 32px;
  max-width: 400px;
}

.error-screen__title {
  margin: 0 0 16px;
  font-size: 32px;
  font-weight: 700;
  color: #e94560;
}

.error-screen__message {
  margin: 0 0 24px;
  font-size: 24px;
}

.error-screen__btn {
  min-width: 160px;
}
</style>
