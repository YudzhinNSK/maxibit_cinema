import { ref } from "vue";
import dayjs from "dayjs";
import type { UserBooking } from "@/types/UserBooking";
import { userApi } from "@/api/user";
import { bokingsApi } from "@/api/bokings";

export enum BookingLoadingStatus {
  Loading,
  Success,
  NotFound,
  Error,
}

export function useBookings(){
  const status = ref<BookingLoadingStatus>(BookingLoadingStatus.Loading)
  const unpaidBookings = ref<UserBooking[]>([])
  const sesionNotEndedBookings = ref<UserBooking[]>([])
  const sessionEndedBookings = ref<UserBooking[]>([])

  const loadUserBookings = async () => {
    try {
      unpaidBookings.value = []
      sesionNotEndedBookings.value = []
      sessionEndedBookings.value = []
      
      const response = await userApi().getUserBookings()
      response.forEach((booking) => {
        if (!booking.isPaid) {
          unpaidBookings.value.push(booking)
          return
        }
        dayjs(booking.session.startTime).isAfter(dayjs()) ? sesionNotEndedBookings.value.push(booking) : sessionEndedBookings.value.push(booking)    
      }) 
      status.value = BookingLoadingStatus.Success
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  const removeUnpaidBooking = (id: number) => {
    unpaidBookings.value = unpaidBookings.value.filter((booking) => booking.id !== id)
  }

  const payBooking = async (id: number) => {
    try {
      await bokingsApi().payBooking(id)
      await loadUserBookings()
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  return {
    status,
    unpaidBookings,
    sesionNotEndedBookings,
    sessionEndedBookings,
    loadUserBookings,
    payBooking,
    removeUnpaidBooking,
  }
}