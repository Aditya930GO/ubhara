import { Product, ProductMin, ProductRequest, ProductQuery } from "~~/interfaces/product"
import { ProductStockRequest } from "~~/interfaces/product-stock"

export default () => {
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const classes = useState<Product[]>('classes', () => null)
 
  const loading = useState<boolean>('products-loading', () => false)
  const query = useState<ProductQuery>('products-query', () => {
    return {
      sort: 'name-ascending',
      skip: 0,
      limit: 0
    }
  })

  const addClass = async (payload ): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/classes`, 'post', JSON.stringify({
        name: payload.name,
        schedule: payload.schedule,
        tags: payload.tags,
        notes: payload.notes ? payload.notes : "-",
      }))
      if (response.status !== 201) throw new Error('')

      const result: string = await response.text()
      console.log(result)
      return result
    } catch (e) {
      return null
    }
  }

  const updateClass = async (payload, dataUpdate: boolean): Promise<string> => {
    try {
      if (dataUpdate) {
        const response: Response = await $fetch(`${config.public.apiBase}/products/${payload._id}`, 'put', JSON.stringify({
          name: payload.name,
          price: payload.price,
          sku: payload.sku,
          category: payload.category,
        }))
        if (response.status !== 200) throw new Error('')
      }
      return payload._id
    } catch (e) {
      return null
    }
  }


  const getClasses = async ( text?: string): Promise<Product[]> => {
    try {
      const urlString: string = `${config.public.apiBase}/classes?${text ? `text=${text}&` : ''}${query.value.sort ? `sort=${query.value.sort}&` : ''}${query.value.skip ? `skip=${query.value.skip}&` : ''}${query.value.limit ? `limit=${query.value.limit}&` : ''}`
      const response: Response = await $fetch(urlString, 'get')
      if (response.status !== 200) throw new Error('')
      const result: [] = await response.json()
      return classes.value = result
    } catch (e) {
      return null
    }
  }

  const getClassDetails = async (id: string): Promise<Product> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/products/${id}`, 'get')
      if (response.status !== 200) throw new Error('')

      const result: Product = await response.json()
      return result
    } catch (e) {
      return null
    }
  }
  // const getProductsSkus = async (): Promise<ProductMin[]> => {
  //   try {
  //     const response: Response = await $fetch(`${config.public.apiBase}/products/skus`, 'get')
  //     if (response.status !== 200) throw new Error('')

  //     const result = await response.json()
  //     skus.value = result

  //     return result
  //   } catch (e) {
  //     return null
  //   }
  // }

  // const addProductStock = async (payload: ProductStockRequest): Promise<string> => {
  //   try {
  //     const response: Response = await $fetch(`${config.public.apiBase}/product-stocks/${payload.product_id}`, 'post', JSON.stringify({
  //       branch_id: payload.branch_id,
  //       quantity: payload.quantity,
  //       price: payload.price
  //     }))
  //     if (response.status !== 201) throw new Error('')

  //     const result: string = await response.text()
  //     return result
  //   } catch (e) {
  //     return null
  //   }
  // }

  // const updateProductStock = async (payload: ProductStockRequest): Promise<string[]> => {
  //   try {
  //     const response: Response = await $fetch(`${config.public.apiBase}/product-stocks/${payload.product_id}`, 'put', JSON.stringify({
  //       branch_id: payload.branch_id,
  //       quantity: payload.quantity,
  //     }))
  //     if (response.status !== 200) throw new Error('')

  //     const result: string[] = await response.json()
  //     return result
  //   } catch (e) {
  //     return null
  //   }
  // }

  return { classes,  loading, query, addClass, updateClass, getClasses, getClassDetails }
  //categories, skus, getProductDetails,getProductsSkus, addProductStock, updateProductStock
  
}