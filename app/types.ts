import postgres from 'postgres';

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface JSONObject {
  [k: string]: JSONValue
}

export interface Variation {
  price: number
  data: JSONObject
}

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  categories: Category[]
  variations: Variation[]
}

export interface Data {
  products: Product[]
  results: number
}

export interface Table {
  table: string
  data: postgres.RowList<postgres.Row[]>
}
