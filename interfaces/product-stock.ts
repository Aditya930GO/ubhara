export interface ProductStockRequest {
  branch_id: string
  product_id: string
  quantity: number
  price?: number
}