import type { Column } from '@/components/Table/types'

export function getColumns() {
  const columns: Column[] = [ 
    { 
      id: 'film', 
      title: '',
    },
    { 
      id: 'seats', 
      title: '',
    },
    { 
      id: 'action', 
      title: '',
    },
  ]
  return columns
}const unpaidColumns = [
]