export type ItemId = string | number

export interface BaseItem {
  [key: string]: any
}

export interface Item {
  id: ItemId;
  [x: string]: unknown;
}

export interface Column {
  id: string;
  title?: string;
}