import type { Column } from '@/components/Table/types'
type TranslatorFn = (key: string) => string

export function getColumns(t: TranslatorFn) {
  const columns: Column[] = [
    {
      id: 'posterImage',
      title: '',
    },
    {
      id: 'title',
      title: 'Название',
    },
    {
      id: 'lengthMinutes',
      title: 'Продолжительность',
    },
    {
      id: 'rating',
      title: 'Рейтинг',
    },
    {
      id: 'action',
      title: '',
    }
  ]
  return columns
}