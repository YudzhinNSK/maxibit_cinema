<template>
  <div v-if="status !== CinemaLoadingStatus.Error" class="page">
    <Preloader v-if="status === CinemaLoadingStatus.Loading" />
    <BaseTable
      v-else
      :items="cinemas"
      :columns="columns"
    >
      <template #body-name="item">
        <span>{{ item.name }}</span>
      </template>
      <template #body-address="item">
        <span>{{ item.address }}</span>
      </template>
      <template #body-action="item">
        <NuxtLink :to="`/cinemas/${item.id}/movies`"> Посмотреть сеансы </NuxtLink>
      </template>
    </BaseTable>
  </div>
  <ErrorScreen v-else />
</template>

<script setup lang="ts">
import { getColumns } from '@/data/Cinemas';
import BaseTable from '@/components/Table/BaseTable.vue';
import { useCinemas } from '@/composition/useCinemas';
import Preloader from '@/components/Preloader.vue';
import { CinemaLoadingStatus } from '@/composition/useCinemas';
import ErrorScreen from '@/components/ErrorScreen.vue';


const columns = getColumns();

const {status, cinemas} = useCinemas();
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
}
</style>