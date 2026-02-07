import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { CinemaSession } from '@/types/CinemaSession'
import type { Session } from '~/types/Session'
import { cinemasApi } from '@/api/cinemas'
import { API_URL } from '@/env.json'

export enum CinemaSessionLoadingStatus {
  Loading,
  Success,
  NotFound,
  Error,
}

export function useCinemaSessions(cinemaId: number){
  const status = ref<CinemaSessionLoadingStatus>(CinemaSessionLoadingStatus.Loading)
  const sessions = ref<Session[]>([])
  const cinemaSessionsMap = ref<Record<string, CinemaSession>>({})

  const firstLoad = async () => {
    status.value = CinemaSessionLoadingStatus.Loading
    try {
      await loadCinemaSessions()
      status.value = CinemaSessionLoadingStatus.Success
    } catch (error) {
      console.warn(error)
      status.value = CinemaSessionLoadingStatus.Error
      return
    }

    prepareCinemaSessionsMap()
  }

  const loadCinemaSessions = async () => {
    try {
      const response = await cinemasApi().getCinemaSessions(cinemaId)
      sessions.value = response
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  const prepareCinemaSessionsMap = () => {
    sessions.value.forEach(session => {
      const date = dayjs(session.startTime).format('DD.MM.YYYY')
      const movie = {
        ...session.movie,
        posterImage: `${API_URL}${session.movie.posterImage}`
      }
      
      if(!cinemaSessionsMap.value[date]) {
        cinemaSessionsMap.value[date] = {
          date: date,
          items: [
            {
              id: session.id,
              movie,
              sessions: [session]
            }
          ]
        }
        return
      }

      const item = cinemaSessionsMap.value[date].items.find(item => item.movie.id === movie.id)

      if(!item) {
        cinemaSessionsMap.value[date].items.push({
          id: session.id,
          movie,
          sessions: [session]
        })
        return
      }

      item.sessions.push(session)
      return
    })
  }

  const currentCinema = computed(() => {
    if(status.value !== CinemaSessionLoadingStatus.Success) return null
    
    if(!sessions.value.length) return null
    
    return sessions.value[0]!.cinema
  })

  const cinemaSessions = computed(() => {
    if(status.value !== CinemaSessionLoadingStatus.Success) return []
    
    return Object.values(cinemaSessionsMap.value).sort((a, b) => a.date.localeCompare(b.date))
  })

  onMounted(firstLoad)

  return {
    status,
    cinemaSessions,
    currentCinema,
  }
}