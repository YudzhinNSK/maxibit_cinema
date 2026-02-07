<template>
  <div v-if="status !== MovieSessionLoadingStatus.Error" class="page">
    <Preloader v-if="status === MovieSessionLoadingStatus.Loading" />
    <div v-else class="movie-info">
      <FilmPreview :movie="currentMovie!" />
      <div class="movie-info__sessions">
        <div class="session" v-for="session in movieSessions" :key="session.date">
          <BaseTable :items="session.items" :columns="columns">
            <template #head-name>
              <div>
                {{ dayjs(session.date, 'DD.MM.YYYY').format('DD.MM') }}
              </div>
            </template>
            <template #body-name="item">
              <div class="name">{{ item.cinema.name }}</div>
            </template>
            <template #body-sessions="item">
              <div class="sessions-cell">
                <div 
                  class="sessions-cell__item" 
                  v-for="session in item.sessions" 
                  :key="session.id"
                  :class="{ 'sessions-cell__item--disabled': isSessionDisabled(session) }"
                  @click="handleSessionClick(session)"
                >
                  {{ dayjs(session.startTime).format('HH:mm') }}
                </div>
              </div>
            </template>
          </BaseTable>
        </div>
      </div>
    </div>
  </div>
  <ErrorScreen v-else />
</template>

<script setup lang="ts" generic="Item extends BaseItem">
import { useMovieSessions } from '@/composition/useMovieSessions';
import Preloader from '@/components/Preloader.vue';
import { MovieSessionLoadingStatus } from '@/composition/useMovieSessions';
import BaseTable from '@/components/Table/BaseTable.vue';
import { useRoute } from 'vue-router';
import { getColumns } from '@/data/MovieSessions';
import type { Item as BaseItem } from '@/components/Table/types';
import FilmPreview from '@/components/FilmPreview.vue';
import type { Session } from '~/types/Session';
import { useRouter } from 'vue-router';
import ErrorScreen from '@/components/ErrorScreen.vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const router = useRouter();
const columns = getColumns();
const { movieId } = useRoute().params;

const { status, movieSessions, currentMovie } = useMovieSessions(Number(movieId));
const handleSessionClick = (session: Session) => {
  if (isSessionDisabled(session)) return
  router.push(`/movies/${movieId}/cinemas/${session.cinema.id}/session/${session.id}`);
}

const isSessionDisabled = (session: Session) => {
  return dayjs(session.startTime).isBefore(dayjs())
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
  min-height: 0;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  position: relative;

  &__name {
    font-size: 48px;
    font-weight: 600;
    text-align: center;
    padding: 16px 0;
    border-bottom: 1px solid #000;
  }

  &__sessions {
    display: flex;
    flex-direction: column;
    gap: 38px;
  }
}

.sessions-cell {
  display: grid;
  grid-template-columns: repeat(10, auto);
  padding: 8px 0px;
  gap: 8px 16px;

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    border: 1px solid #000;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
  }
}
</style>