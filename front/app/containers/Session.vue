<template>
  <div class="page">
    <h1 class="page__title">Выбрать места</h1>
    <Preloader v-if="status === SessionLoadingStatus.Loading" />
    <div v-else class="session">
      <div class="session__info">
        <div class="session__name">Фильм: {{ movie?.title }}</div>
        <div class="session__cinema">Кинотеатр: {{ cinema?.name }}</div>
        <div class="session__time">Время: {{ sessionTime }}</div>
      </div>
      <div class="session__hall">
        <div class="hall-grid">
          <div class="hall-col-labels">
            <div class="hall-row hall-row--header">
              <div class="row-name"></div>
            </div>
            <div
              v-for="rowIndex in rowsCount"
              :key="rowIndex"
              class="hall-row hall-row--label"
            >
              <div class="row-name">Ряд {{ rowIndex }}</div>
            </div>
          </div>
          <div class="hall-col-seats">
            <div class="hall-row hall-row--header">
              <div class="row-seats">
                <span v-for="col in colsCount" :key="col" class="seat-number">{{ col }}</span>
              </div>
            </div>
            <div
              v-for="rowIndex in rowsCount"
              :key="rowIndex"
              class="hall-row"
            >
              <div class="row-seats">
                <div
                  v-for="seatIndex in colsCount"
                  :key="seatIndex"
                  class="seat"
                  :class="getSeatClass(rowIndex, seatIndex)"
                  @click="toggleSeat(rowIndex, seatIndex)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="session__action">
        <Button :disabled="selectedSeats.length === 0" @click="handleBookSeats">Забронировать</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSessions } from '@/composition/useSessions'
import { SessionLoadingStatus } from '@/composition/useSessions'
import Preloader from '@/components/Preloader.vue'
import dayjs from 'dayjs'
import type { Seat } from '@/types/Seat'
import { userService } from '@/services/user'
import { useRoute } from 'vue-router'

const { isLoggedIn } = userService()

const { sessionId, movieId, cinemaId } = useRoute().params
const router = useRouter()

const sessionTime = computed(() => {
  if (!session.value) return ''
  return dayjs(session.value.startTime).format('HH:mm')
})

const { status, session, movie, cinema, bookSeats } = useSessions(Number(sessionId), Number(movieId), Number(cinemaId))

const seatsConfig = computed(() => session.value?.seats as { rows?: number; seatsPerRow?: number; seatPerRow?: number } | undefined)
const rowsCount = computed(() => seatsConfig.value?.rows ?? 0)
const colsCount = computed(() => seatsConfig.value?.seatsPerRow ?? 0)

const selectedSeats = ref<Seat[]>([])

const isBooked = (rowNumber: number, seatNumber: number) =>
  session.value?.bookedSeats?.some(
    (s) => s.rowNumber === rowNumber && s.seatNumber === seatNumber
  ) ?? false

const isSelected = (rowNumber: number, seatNumber: number) =>
  selectedSeats.value.some(
    (s) => s.rowNumber === rowNumber && s.seatNumber === seatNumber
  )

const getSeatClass = (rowNumber: number, seatNumber: number) => {
  if (isBooked(rowNumber, seatNumber)) return 'seat--occupied'
  if (isSelected(rowNumber, seatNumber)) return 'seat--selected'
  return ''
}

const toggleSeat = (rowNumber: number, seatNumber: number) => {
  if (isBooked(rowNumber, seatNumber)) return
  const idx = selectedSeats.value.findIndex(
    (s) => s.rowNumber === rowNumber && s.seatNumber === seatNumber
  )
  if (idx >= 0) {
    selectedSeats.value = selectedSeats.value.filter((_, i) => i !== idx)
  } else {
    selectedSeats.value = [...selectedSeats.value, { rowNumber, seatNumber }]
  }
}

const handleBookSeats = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  if (selectedSeats.value.length === 0) return
  try {
    await bookSeats(Number(sessionId), selectedSeats.value)
    router.push(`/bookings`)
  } catch (error) {
    console.warn(error)
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
  min-height: 0;

  &__title {
    margin-bottom: 24px;
    width: 100%;
    text-align: center;
    font-size: 24px;
  }
}

.session {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

.session__info {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.session__hall {
  overflow: auto;
  min-height: 0;
}

.session__action {
  width: 100%;
  display: flex;
  justify-content: center;
}

.hall-grid {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  width: max-content;
  min-width: 100%;
}

.hall-col-labels {
  position: sticky;
  left: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  background: #fff;
  padding-right: 4px;

  .hall-row--header .row-name {
    background: #fff;
  }
}

.hall-col-seats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 0 0 auto;
}

.hall-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 36px;

  &--header {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #fff;

    .row-seats {
      align-items: center;
    }
  }

  &--label .row-name {
    background: transparent;
  }
}

.row-name {
  min-width: 52px;
  min-height: 36px;
  font-size: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.row-seats {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.seat-number {
  width: 36px;
  flex-shrink: 0;
  text-align: center;
  font-size: 14px;
}

.seat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid black;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;

  &--selected {
    background: #1e3a5f;
    border-color: #2d5a8a;
    color: #fff;
  }

  &--occupied {
    background: #6b2d2d;
    border-color: #8b3d3d;
    color: rgba(255, 255, 255, 0.8);
    cursor: not-allowed;
  }
}
</style>