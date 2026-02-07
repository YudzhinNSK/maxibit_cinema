import {onMounted, ref} from "vue";
import type { Movie } from "@/types/Movie";
import { moviesApi } from "@/api/movies";
import { API_URL } from "@/env.json";

export enum MovieLoadingStatus {
  Loading,
  Success,
  NotFound,
  Error,
}

export function useMovies(){
  const status = ref<MovieLoadingStatus>(MovieLoadingStatus.Loading)
  const movies = ref<Movie[]>([])
  const moviesMap = ref<Record<number, Movie>>({})

  const firstLoad = async () => {
    await loadMovies()
  }

  const loadMovies = async () => {
    status.value = MovieLoadingStatus.Loading
    try {
      const response = await moviesApi().getMovies()
      movies.value = response
      response.forEach(movie => {
        moviesMap.value[movie.id] = movie
      })
      status.value = MovieLoadingStatus.Success
    } catch (error) {
      status.value = MovieLoadingStatus.Error
    }
  }

  const getMovie = (id: number) => {
    if(status.value !== MovieLoadingStatus.Success) return null
    
    return moviesMap.value[id]
  }

  onMounted(firstLoad)

  return {
    status,
    movies,
    getMovie,
  }
}