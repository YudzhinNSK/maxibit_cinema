import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { MovieSession } from '@/types/MovieSession'
import type { Session } from '~/types/Session'
import { moviesApi } from '@/api/movies'
import { API_URL } from '@/env.json'

export enum MovieSessionLoadingStatus {
  Loading,
  Success,
  NotFound,
  Error,
}

export function useMovieSessions(movieId: number){
  const status = ref<MovieSessionLoadingStatus>(MovieSessionLoadingStatus.Loading)
  const sessions = ref<Session[]>([])
  const movieSessionsMap = ref<Record<string, MovieSession>>({})

  const firstLoad = async () => {
    status.value = MovieSessionLoadingStatus.Loading
    try {
      await loadMovieSessions()
      status.value = MovieSessionLoadingStatus.Success
    } catch (error) {
      console.warn(error)
      status.value = MovieSessionLoadingStatus.Error
      return
    }

    prepareMovieSessionsMap()
  }

  const loadMovieSessions = async () => {
    try {
      const response = await moviesApi().getMovieSessions(movieId)
      sessions.value = response
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  const prepareMovieSessionsMap = () => {
    sessions.value.forEach(session => {
      const date = dayjs(session.startTime).format('DD.MM.YYYY')
      const cinema = session.cinema
      
      if(!movieSessionsMap.value[date]) {
        movieSessionsMap.value[date] = {
          date: date,
          items: [
            {
              id: session.id,
              cinema,
              sessions: [session]
            }
          ]
        }
        return
      }

      const item = movieSessionsMap.value[date].items.find(item => item.cinema.id === cinema.id)

      if(!item) {
        movieSessionsMap.value[date].items.push({
          id: session.id,
          cinema,
          sessions: [session]
        })
        return
      }

      item.sessions.push(session)
      return
    })
  }

  const currentMovie = computed(() => {
    if(status.value !== MovieSessionLoadingStatus.Success) return null

    if(!sessions.value.length) return null
    
    const movie ={
      ...sessions.value[0]!.movie,
      posterImage: `${API_URL}${sessions.value[0]!.movie.posterImage}`
    }

    return movie
  })

  const movieSessions = computed(() => {
    if(status.value !== MovieSessionLoadingStatus.Success) return []
    
    return Object.values(movieSessionsMap.value).sort((a, b) => a.date.localeCompare(b.date))
  })

  onMounted(firstLoad)

  return {
    status,
    movieSessions,
    currentMovie,
  }
}