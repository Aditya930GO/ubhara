import { ChartCashflow } from './general'

interface ProductStockActivityUser {
  _id: string
  name: string
}

interface ProductStockActivityTransaction {
  _id: string
  document: {
    _id: string
    number: string
  }
}

interface ProductStockBranch {
  _id: string
  name: string
  code: string
}

export interface ProductStock {
  _id: string
  quantity: number
  remaining: number
  price?: number
}

export interface ProductStockMin {
  _id: string
  remaining: number
  demand: number
}

export interface ProductMin {
  _id: string
  sku: string
  name: string
  price: number
  quantity?: number
  discount?: number
}

export interface ProductStockActivity {
  _id: string
  type: 'sale' | 'purchase' | 'replenishment' | 'reduction'
  quantity: number
  date: Date
  transaction?: ProductStockActivityTransaction
  user?: ProductStockActivityUser
}

export interface Product {
  _id: string
  name: string
  price: number
  category?: string
  sku?: string
  image_url?: string[]
  stock: {
    remaining: {
      branch: ProductStockBranch
      value: number
    }[]
    available?: {
      branch: ProductStockBranch
      datas: ProductStock[]
    }[]
    activity?: {
      branch: ProductStockBranch
      datas: ProductStockActivity[]
    }[]
  }
  purchase?: {
    count: number
    value: number
  }
  datas?: ChartCashflow[][]
}

export interface ProductRequest {
  sku: string
  name: string
  price: number
  category: string
  file?: File[]
  file_delete?: string[]
  _id?: string
}

export interface ProductQuery {
  sort: 'name-ascending' | 'name-descending' | 'stock-ascending' | 'stock-descending'
  limit?: number
  skip?: number
}