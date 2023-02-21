export interface Branch {
  _id: string
  name: string
  code: string
  address: string
  target?: number
  purchase?: {
    count: number
    value: number
  }
}