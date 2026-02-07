import type { Column } from '@/components/Table/types'

export function getColumns() {
  const columns: Column[] = [
    {
      id: 'name',
      title: 'Кинотеатр',
    },
    {
      id: 'address',
      title: 'Адрес',
    },
    {
      id: 'action',
      title: '',
    }
  ]
  return columns
}