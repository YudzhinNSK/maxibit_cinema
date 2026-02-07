<template>
  <div v-if="status !== BookingLoadingStatus.Error" class="page">
    <h1 class="page__title">Мои билеты</h1>
    <Preloader v-if="status === BookingLoadingStatus.Loading" />
    <div v-else class="bookings">
      <div v-if="unpaidBookings.length" class="bookings-section">
        <div class="bookings-section__title">Не оплаченные</div>
        <BaseTable :items="unpaidBookings" :columns="columns" :hideHead="true" class="bookings-table">
          <template #body-film="item">
            <div class="booking-info">
              <div class="booking-info__movie">{{ item.movie?.title }}</div>
              <div class="booking-info__cinema">{{ item.cinema?.name }}</div>
              <div class="booking-info__time">{{ formatSessionTime(item.session?.startTime) }}</div>
            </div>
          </template>
          <template #body-seats="item">
            <div class="booking-seats">
              <div
                v-for="(seat, idx) in item.seats"
                :key="idx"
                class="booking-seats__item"
              >
                Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
              </div>
            </div>
          </template>
          <template #body-action="item">
            <div class="booking-action">
              <Button class="booking-action__btn" @click="onPay(item)">Оплатить</Button>
              <span v-if="paymentDeadline(item)" class="booking-action__timer">
                Осталось {{ paymentDeadline(item) }}
              </span>
            </div>
          </template>
        </BaseTable>
      </div>

      <div v-if="sesionNotEndedBookings.length" class="bookings-section">
        <div class="bookings-section__title">Будущие</div>
        <BaseTable :items="sesionNotEndedBookings" :columns="columns" :hideHead="true" class="bookings-table">
          <template #body-film="item">
            <div class="booking-info">
              <div class="booking-info__movie">{{ item.movie?.title }}</div>
              <div class="booking-info__cinema">{{ item.cinema?.name }}</div>
              <div class="booking-info__time">{{ formatSessionTime(item.session?.startTime) }}</div>
            </div>
          </template>
          <template #body-seats="item">
            <div class="booking-seats">
              <div
                v-for="(seat, idx) in item.seats"
                :key="idx"
                class="booking-seats__item"
              >
                Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
              </div>
            </div>
          </template>
          <template #body-action>
            <div class="booking-action booking-action--empty" aria-hidden="true" />
          </template>
        </BaseTable>
      </div>

      <div v-if="sessionEndedBookings.length" class="bookings-section">
        <div class="bookings-section__title">Прошедшие</div>
        <BaseTable :items="sessionEndedBookings" :columns="columns" :hideHead="true" class="bookings-table">
          <template #body-film="item">
            <div class="booking-info">
              <div class="booking-info__movie">{{ item.movie?.title }}</div>
              <div class="booking-info__cinema">{{ item.cinema?.name }}</div>
              <div class="booking-info__time">{{ formatSessionTime(item.session?.startTime) }}</div>
            </div>
          </template>
          <template #body-seats="item">
            <div class="booking-seats">
              <div
                v-for="(seat, idx) in item.seats"
                :key="idx"
                class="booking-seats__item"
              >
                Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
              </div>
            </div>
          </template>
          <template #body-action>
            <div class="booking-action booking-action--empty" aria-hidden="true" />
          </template>
        </BaseTable>
      </div>
    </div>
  </div>
  <ErrorScreen v-else />
</template>

<script setup lang="ts">
import { watch, ref, onMounted, onUnmounted } from 'vue'
import { userService } from '@/services/user'
import { useRouter } from 'vue-router'
import { useBookings, BookingLoadingStatus } from '@/composition/useBookings'
import BaseTable from '@/components/Table/BaseTable.vue'
import Button from '@/components/Button.vue'
import Preloader from '@/components/Preloader.vue'
import dayjs from 'dayjs'
import type { UserBooking } from '@/types/UserBooking'
import { getColumns } from '@/data/Bookings'

const columns = getColumns()

const router = useRouter()
const user = userService()
const {
  status,
  unpaidBookings,
  sesionNotEndedBookings,
  sessionEndedBookings,
  loadUserBookings,
  payBooking,
  removeUnpaidBooking,
} = useBookings()

const nowRef = ref(Date.now())
let timerId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timerId = setInterval(() => {
    nowRef.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})


const formatSessionTime = (startTime: string | undefined): string => {
  if (!startTime) return ''
  return dayjs(startTime).format('DD.MM HH:mm')
}

const paymentDeadline = (booking: UserBooking): string | null => {
  if (!booking.bookedAt) return null

  const settings = { bookingPaymentTimeSeconds: 180 }
  const deadline = dayjs(booking.bookedAt).add(settings.bookingPaymentTimeSeconds, 'second')
  const now = dayjs(nowRef.value)

  if (now.isAfter(deadline) || now.isSame(deadline)) {
    removeUnpaidBooking(booking.id)
    return null
  }

  const sec = deadline.diff(now, 'second')
  const m = Math.floor(sec / 60)
  const s = sec % 60

  return `${m}:${s.toString().padStart(2, '0')}`
}

const onPay = async (booking: UserBooking) => {
  await payBooking(booking.id)
}

watch(
  () => user.isInitialized.value,
  (initialized) => {
    if (!initialized) return
    if (!user.isLoggedIn.value) {
      router.push('/login')
    } else {
      loadUserBookings()
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.page {
  padding: 32px;
  min-height: 0;
  height: 100%;
  overflow: auto;

  &__title {
    margin: 0 0 24px;
    font-size: 24px;
    text-align: center;
  }
}

.bookings {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.bookings-section {
  &__title {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
  }

  &__line {
    height: 1px;
    background: black;
    margin-bottom: 16px;
  }
}

.booking-action--empty {
  width: 280px;
  min-height: 44px;
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__movie {
    font-weight: 500;
  }

  &__cinema,
  &__time {
    font-size: 14px;
  }
}

.booking-seats {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__item {
    font-size: 14px;
  }
}

.booking-action {
  width: 220px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  &__timer {
    font-size: 14px;
  }
}
</style>
