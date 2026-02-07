<template>
  <div class="base-table-wrapper">
    <div
      class="base-table"
    >
      <div class="base-table__table">
        <TableHead
          v-if="!hideHead"
          :columns="columns"
        >
          <template v-for="column in columns" #[`head-${column.id}`]="columnItem">
            <slot :name="`head-${column.id}`" v-bind="columnItem"></slot>
          </template>
        </TableHead>
        <TableBody
          :items="items"
          :columns="columns"
        >
          <template v-for="column in columns" #[`body-${column.id}`]="item">
            <slot :name="`body-${column.id}`" v-bind="item"></slot>
          </template>
        </TableBody>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Item extends BaseItem">
import type { Column, Item as BaseItem } from './types'
import TableHead from './TableHead.vue'
import TableBody from './TableBody.vue'

const props = defineProps<{
  items: Array<Item>
  columns: Column[]
  hideHead?: boolean
}>()

type HeadColumnId = `head-${string}`
type BodyColumnId = `body-${string}`

defineSlots<{
  [columnId: HeadColumnId]: (item: Column) => any;
  [columnId: BodyColumnId]: (item: Item) => any;
}>()
</script>

<style lang="scss" scoped>

.base-table-wrapper {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
}

.base-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: min-content;
  gap: 16px;

  &__table {
    display: grid;
    grid-template-columns: repeat(v-bind('columns.length')) 1fr;
    // grid-template-columns: v-bind('gridTemplateColumns');
    row-gap: 4px;
    width: max-content;
    min-width: 100%;
  }
}
</style>
