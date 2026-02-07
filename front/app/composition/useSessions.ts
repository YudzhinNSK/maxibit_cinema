import {onMounted, ref} from "vue";
import type { SessionDetails } from "@/types/SessionDetails";
import type { Seat } from "@/types/Seat";
import { movieSessionApi } from "@/api/movieSession";
import { moviesApi } from "@/api/movies";
import { cinemasApi } from "@/api/cinemas";
import type { Movie } from "@/types/Movie";
import type { Cinema } from "@/types/Cinema";

export enum SessionLoadingStatus {
  Loading,
  Success,
  NotFound,
  Error,
}

export function useSessions(id: number, movieId: number, cinemaId: number){
  const status = ref<SessionLoadingStatus>(SessionLoadingStatus.Loading)
  const session = ref<SessionDetails | null>(null)
  const movie = ref<Movie | null>(null)
  const cinema = ref<Cinema | null>(null)

  const firstLoad = async () => {
    status.value = SessionLoadingStatus.Loading
    try {
      await Promise.allSettled([
        loadMovie(movieId),
        loadCinema(cinemaId),
        loadSession(id),
      ])
      status.value = SessionLoadingStatus.Success
    } catch (error) {
      console.warn(error)
      status.value = SessionLoadingStatus.Error
      return
    }
  }

  const loadSession = async (id: number) => {
    try {
      const response = await movieSessionApi().getMovieSession(id)
      session.value = response
      status.value = SessionLoadingStatus.Success
    } catch (error) {
      throw error
    }
  }

  const loadMovie = async (id: number) => {
    const response = await moviesApi().getMovie(id)
    movie.value = response
  }

  const loadCinema = async (id: number) => {
    const response = await cinemasApi().getCinema(id)
    cinema.value = response
  }
  const bookSeats = async (id: number, seats: Seat[]) => {
    try {
      await movieSessionApi().bookSeats(id, seats)
    } catch (error) {
      console.warn(error)
      throw error
    }
  }


  onMounted(firstLoad)

  return {
    status,
    session,
    movie,
    cinema,
    bookSeats,
  }
}