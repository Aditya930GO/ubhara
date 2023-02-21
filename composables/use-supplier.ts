import { Supplier, SupplierMin, SupplierRequest } from "~~/interfaces/supplier"

export default () => {
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const names = useState<SupplierMin[]>('suppliers-names', () => null)
  const suppliers = useState<Supplier[]>('suppliers', () => null)

  const getSuppliers = async (): Promise<Supplier[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/suppliers`, 'get')
      if (response.status !== 200) throw new Error('')

      const result = await response.json()
      suppliers.value = result

      return result
    } catch (e) {
      return null
    }
  }

  const getSuppliersNames = async (): Promise<SupplierMin[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/suppliers/names`, 'get')
      if (response.status !== 200) throw new Error('')

      const result = await response.json()
      names.value = result

      return result
    } catch (e) {
      return null
    }
  }

  const addSupplier = async (payload: SupplierRequest): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/suppliers`, 'post', JSON.stringify({
        name: payload.name,
        address: payload.address,
        email: payload.email,
        phone: payload.phone,
        contact_person: payload.contact_person,
      }))
      if (response.status !== 201) throw new Error('')

      const result = await response.text()

      return result
    } catch (e) {
      return null
    }
  }

  return { names, suppliers, getSuppliers, getSuppliersNames, addSupplier }
}