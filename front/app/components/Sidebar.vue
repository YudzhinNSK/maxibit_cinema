<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <button
      type="button"
      class="sidebar-toggle"
      aria-label="Меню"
      @click="toggle"
    >
      <span class="toggle-icon">{{ isCollapsed ? '☰' : '←' }}</span>
    </button>
    <nav class="sidebar-nav">
      <NuxtLink 
        to="/movies" 
        class="sidebar-link" 
        :class="{ 'is-active': isActive('/movies') }"
      >
        <span class="link-icon">🎬</span>
        <span class="link-text">Фильмы</span>
      </NuxtLink>
      <NuxtLink 
        to="/cinemas" 
        class="sidebar-link" 
        :class="{ 'is-active': isActive('/cinemas') }"
      >
        <span class="link-icon">🎭</span>
        <span class="link-text">Кинотеатры</span>
      </NuxtLink>
      <NuxtLink 
        to="/bookings" 
        class="sidebar-link" 
        :class="{ 'is-active': isActive('/bookings') }"
      >
        <span class="link-icon">🎫</span>
        <span class="link-text">Мои билеты</span>
      </NuxtLink>
      <NuxtLink 
        v-if="isLoginShown" 
        to="/login" 
        class="sidebar-link" 
        :class="{ 'is-active': isActive('/login') }"
      >
        <span class="link-icon">👤</span>
        <span class="link-text">Вход</span>
      </NuxtLink>
      <button
        v-else
        type="button"
        class="sidebar-link sidebar-link--button"
        @click="onTokenClear"
      >
        <span class="link-icon">👤</span>
        <span class="link-text">Выход</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { userService } from '@/services/user'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, clearToken } = userService()
const isCollapsed = ref(false)

function toggle() {
  isCollapsed.value = !isCollapsed.value
}

function isActive(path: string): boolean {
  const current = route.path
  return current === path || current.startsWith(path + '/')
}

const isLoginShown = computed(() => !isLoggedIn.value)

function onTokenClear() {
  clearToken()
  router.push('/movies')
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: #1a1a2e;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: width 0.3s ease, min-width 0.3s ease;
  flex-shrink: 0;

  &.collapsed {
    width: 64px;
    min-width: 64px;
    
    .sidebar-link {
      padding: 0.75rem;
      justify-content: center;
    }

    .link-text {
      display: none;
    }
  }
}

.sidebar-toggle {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #eee;
  width: 40px;
  height: 40px;
  margin: 0 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #16213e;
  }
}

.toggle-icon {
  font-size: 1.25rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #eee;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: #16213e;
  }

  &.is-active {
    background: #16213e;
    color: #e94560;
  }

  &--button {
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font: inherit;
  }
}

.link-icon {
  font-size: 1.25rem;
}
</style>
