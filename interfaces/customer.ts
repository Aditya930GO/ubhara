import { UserRecord } from "./general"

export interface CustomerContact {
  name: string
  email?: string
  phone?: string
  role: string
}

export interface CustomerNote {
  title: string
  message: string
  user?: UserRecord
}

export interface Customer {
  _id: string
  name: string
  address: string
  contact_person: CustomerContact[]
  email?: string
  phone?: string
  note?: CustomerNote[]
  purchase?: {
    count: number
    value: number
  }
  create_date: Date
}

export interface CustomerMin {
  _id: string
  name: string
}

export interface CustomerRequest {
  name: string
  address: string
  contact_person: CustomerContact[]
  email?: string
  phone?: string
}