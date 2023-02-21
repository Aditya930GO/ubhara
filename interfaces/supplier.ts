export interface SupplierContact {
  name: string
  email?: string
  phone?: string
  role: string
}

export interface Supplier {
  _id: string
  name: string
  address: string
  contact_person: SupplierContact[]
  email?: string
  phone?: string
  purchase?: {
    count: number
    value: number
  }
  create_date: Date
}

export interface SupplierMin {
  _id: string
  name: string
}

export interface SupplierRequest {
  name: string
  address: string
  contact_person: SupplierContact[]
  email?: string
  phone?: string
}