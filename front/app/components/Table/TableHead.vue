<template>
  <div class="table-head">
    <div
      v-for="column in columns"
      :key="column.id"
      class="table-head__column"
      :class="`table-head__column--${column.id}`"
    >
      <slot :name="`head-${column.id}`" v-bind="column">
        <span class="table-head__title">
          {{ column.title }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" >
import type { Column } from '@/components/Table/types'

const props = defineProps({
  columns: {
    type: Array<Column>,
    required: true,
  },
})

type HeadColumnId = `head-${string}`

defineSlots<{
  [columnId: HeadColumnId]: (item: Column) => any;
}>()
</script>

<style lang="scss" scoped>
.table-head {
  position: sticky;
  top: -1px;
  z-index: 100;
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / span v-bind('columns.length');
  grid-row: 1;
  min-height: 60px;
  background-color: white;
  border: 2px solid black;
  

  &__column {
    display: flex;
    align-items: center;
    min-width: 48px;
    padding: 0 12px;
    gap: 8px;
  }

  &__title {
    font-weight: 500;
    margin-right: auto;
  }
}
</style>
