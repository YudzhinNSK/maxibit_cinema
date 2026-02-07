<template>
  <div class="preloader">
    <div class="preloader__spinner" />
  </div>
</template>

<style lang="scss" scoped>
.preloader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.preloader__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top-color: #1a1a2e;
  border-radius: 50%;
  animation: preloader-spin 0.8s linear infinite;
}

@keyframes preloader-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
