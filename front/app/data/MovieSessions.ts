import type { Column } from '@/components/Table/types'

export function getColumns() {
  const columns: Column[] = [
    {
      id: 'name',
      title: '',
    },
    {
      id: 'sessions',
      title: '',
    }
  ]
  return columns
}