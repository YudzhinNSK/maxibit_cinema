<template>
  <div class="app">
    <Sidebar />
    <div class="content">
      <header class="header">
        <span class="header-title">Maxibit Cinema</span>
      </header>
      <main class="main">
        <NuxtPage />
      </main>
    </div>
    <NuxtRouteAnnouncer />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  font-family: system-ui, -apple-system, sans-serif;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header {
  background: #1a1a2e;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
}

.header-title {
  color: #eee;
  font-size: 1.25rem;
}

.main {
  flex: 1;
  width: 100%;
  max-height: calc(100vh - 72px);
}
</style>
