import {onMounted, ref} from "vue";
import type { Cinema } from "@/types/Cinema";
import { cinemasApi } from "@/api/cinemas";

export enum CinemaLoadingStatus {
  Loading,
  Success,
  NotFound,
  Error,
}

export function useCinemas(){
  const status = ref<CinemaLoadingStatus>(CinemaLoadingStatus.Loading)
  const cinemas = ref<Cinema[]>([])
  const cinemasMap = ref<Record<number, Cinema>>({})

  const firstLoad = async () => {
    await loadMovies()
  }

  const loadMovies = async () => {
    status.value = CinemaLoadingStatus.Loading
    try {
      const response = await cinemasApi().getCinemas()
      cinemas.value = response
      response.forEach(cinema => {
        cinemasMap.value[cinema.id] = cinema
      })
      status.value = CinemaLoadingStatus.Success
    } catch (error) {
      status.value = CinemaLoadingStatus.Error
    }
  }

  const getCinema = (id: number) => {
    if(status.value !== CinemaLoadingStatus.Success) return null
    
    return cinemasMap.value[id]
  }

  onMounted(firstLoad)

  return {
    status,
    cinemas,
    getCinema,
  }
}