<template>
  <div class="film-preview">
    <div class="film-preview__title">
      {{ movie.title }}
    </div>
    <div class="film-preview__info">
      <img :src="movie.posterImage" alt="poster">
      <div class="film-preview__description">
        <span>{{ movie.description }}</span>
        <div class="film-preview__additional-info">
          <span>Год: {{ movie.year }}</span>
          <span>Продолжительность: {{ fromMinutesToHours(movie.lengthMinutes) }}</span>
          <span>Рейтинг: {{ movie.rating }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '@/types/Movie';
import { fromMinutesToHours } from '@/helpers/time';

const props = defineProps({
  movie: {
    type: Object as PropType<Movie>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>  
.film-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__title {
    font-size: 24px;
    width: 100%;
    text-align: center;
  }

  &__info {
    display: flex;
    flex-direction: row;
    gap: 32px;
  }

  &__description {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__additional-info {
    display: flex;
    flex-direction: column;
  }
}
</style>