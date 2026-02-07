<template>
  <button
    type="button"
    class="btn"
    :class="{ 'btn--disabled': disabled }"
    :disabled="disabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function onClick(event: MouseEvent) {
  if (props.disabled) return
  emit('click', event)
}
</script>

<style lang="scss" scoped>
.btn {
  padding: 10px 20px;
  font: inherit;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    background: #16213e;
  }

  &:disabled,
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
