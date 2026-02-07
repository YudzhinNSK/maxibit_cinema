<template>
  <div class="table-body">
    <template v-for="item in items" :key="item.id">
      <div
        class="table-body__row"
      >
        <div
          v-for="column in columns"
          :key="column.id"
          class="table-body__cell"
        >
          <slot :name="`body-${column.id}`" v-bind="item"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts" generic="Item extends BaseItem">
import { reactive } from 'vue'
import type { Item as BaseItem, Column, ItemId } from './types'

const props = defineProps({
  items: {
    type: Array<Item>,
    required: true,
  },
  columns: {
    type: Array<Column>,
    required: true,
  },
})


type BodyColumnId = `body-${string}`

defineSlots<{
  [columnId: BodyColumnId]: (item: Item) => any
}>()
</script>

<style lang="scss" scoped>

.table-body {
  display: contents;

  &__row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / span v-bind('columns.length');
    min-height: 60px;
    border: 2px solid black;
    border-radius: 8px;
  }

  &__cell {
    display: flex;
    align-items: center;
    min-width: 48px;
    padding: 0 12px;
  }
}
</style>
