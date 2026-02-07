<template>
  <div v-if="status !== MovieLoadingStatus.Error" class="page">
    <Preloader v-if="status === MovieLoadingStatus.Loading" />
    <BaseTable
      v-else
      :items="movies"
      :columns="columns"
    >
      <template #body-posterImage="item">
        <div class="poster-cell">  
          <img :src="item.posterImage" alt="poster">
        </div>
      </template>
      <template #body-title="item">
        <span>{{ item.title }}</span>
      </template>
      <template #body-lengthMinutes="item">
        <span>{{ item.lengthMinutes }}</span>
      </template>
      <template #body-rating="item">
        <span>{{ item.rating }}</span>
      </template>
      <template #body-action="item">
        <NuxtLink :to="`/movies/${item.id}/cinemas`"> Посмотреть сеансы </NuxtLink>
      </template>
    </BaseTable>
  </div>
  <ErrorScreen v-else />
</template>

<script setup lang="ts">
import { getColumns } from '@/data/Movies';
import BaseTable from '@/components/Table/BaseTable.vue';
import { useMovies } from '@/composition/useMovies';
import Preloader from '@/components/Preloader.vue';
import { MovieLoadingStatus } from '@/composition/useMovies';
import ErrorScreen from '@/components/ErrorScreen.vue';

const { status, movies } = useMovies();
const columns = getColumns((key) => key);

</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
}

.poster-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>