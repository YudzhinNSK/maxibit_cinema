<template>
  <div v-if="status !== CinemaSessionLoadingStatus.Error" class="page">
    <Preloader v-if="status === CinemaSessionLoadingStatus.Loading" />
    <div v-else class="cinema-info">
      <div class="cinema-info__name">{{ currentCinema?.name }}</div>
      <div class="cinema-info__sessions">
        <div class="session" v-for="session in cinemaSessions" :key="session.date">
          <BaseTable :items="session.items" :columns="columns">
            <template #head-icon>
              <div>
                {{ dayjs(session.date, 'DD.MM.YYYY').format('DD.MM') }}
              </div>
            </template>
            <template #body-icon="item">
              <div class="poster-cell">
                <img :src="item.movie.posterImage" alt="poster">
              </div>
            </template>
            <template #body-name="item">
              <div class="name">{{ item.movie.title }}</div>
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
import { useCinemaSessions } from '@/composition/useCinemaSessions';
import Preloader from '@/components/Preloader.vue';
import { CinemaSessionLoadingStatus } from '@/composition/useCinemaSessions';
import BaseTable from '@/components/Table/BaseTable.vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getColumns } from '@/data/CinemaSessions';
import type { Item as BaseItem } from '@/components/Table/types';
import type { Session } from '~/types/Session';
import { useRouter } from 'vue-router';

dayjs.extend(customParseFormat);

const router = useRouter();
const columns = getColumns();
const { cinemaId } = useRoute().params;

const { status, cinemaSessions, currentCinema } = useCinemaSessions(Number(cinemaId));
const handleSessionClick = (session: Session) => {
  if (isSessionDisabled(session)) return
  router.push(`/cinemas/${cinemaId}/movies/${session.movie.id}/session/${session.id}`);
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

.cinema-info {
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

.poster-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>