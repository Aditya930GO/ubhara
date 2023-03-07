import { Product, ProductMin, ProductRequest, ProductQuery } from "~~/interfaces/product"
import { ProductStockRequest } from "~~/interfaces/product-stock"

export default () => {
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const products = useState<Product[]>('products', () => null)
  const categories = useState<string[]>('products-categories', () => null)
  const skus = useState<ProductMin[]>('products-skus', () => null)
  const loading = useState<boolean>('products-loading', () => false)
  const query = useState<ProductQuery>('products-query', () => {
    return {
      sort: 'name-ascending',
      skip: 0,
      limit: 0
    }
  })

  const addProduct = async (payload: ProductRequest): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/products`, 'post', JSON.stringify({
        name: payload.name,
        price: payload.price,
        sku: payload.sku,
        category: payload.category,
      }))
      if (response.status !== 201) throw new Error('')

      const result: string = await response.text()
      if (result && payload.file.length) {
        const data: FormData = new FormData()
        for (let i: number = 0; i < payload.file.length; i++) {
          data.append('image', payload.file[i])
        }
        await $fetch(`${config.public.apiBase}/products/image/${result}`, 'put', data)
      }

      return result
    } catch (e) {
      return null
    }
  }

  const updateProduct = async (payload: ProductRequest, dataUpdate: boolean, imageUpdate: boolean): Promise<string> => {
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
      if (imageUpdate) {
        const data: FormData = new FormData()
        for (let i: number = 0; i < payload.file.length; i++) {
          data.append('image', payload.file[i])
        }
        data.append('file_delete', JSON.stringify(payload.file_delete))
        await $fetch(`${config.public.apiBase}/products/image/${payload._id}`, 'put', data)
      }

      return payload._id
    } catch (e) {
      return null
    }
  }

  const getProductDetails = async (id: string): Promise<Product> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/classes/${id}`, 'get')
      if (response.status !== 200) throw new Error('')

      const result: Product = await response.json()
      return result
    } catch (e) {
      return null
    }
  }

  const getProducts = async (loadCategories: boolean = false, text?: string): Promise<Product[]> => {
    try {
      const urlString: string = `${config.public.apiBase}/products?${text ? `text=${text}&` : ''}${query.value.sort ? `sort=${query.value.sort}&` : ''}${query.value.skip ? `skip=${query.value.skip}&` : ''}${query.value.limit ? `limit=${query.value.limit}&` : ''}`
      const response: Response = await $fetch(urlString, 'get')
      if (response.status !== 200) throw new Error('')

      if (loadCategories) {
        const response: Response = await $fetch(`${config.public.apiBase}/products/categories`, 'get')
        if (response.status === 200) categories.value = await response.json()
      }

      const result: Product[] = await response.json()

      return products.value = result
    } catch (e) {
      return null
    }
  }

  const getProductsSkus = async (): Promise<ProductMin[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/products/skus`, 'get')
      if (response.status !== 200) throw new Error('')

      const result = await response.json()
      skus.value = result

      return result
    } catch (e) {
      return null
    }
  }

  const addProductStock = async (payload: ProductStockRequest): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/product-stocks/${payload.product_id}`, 'post', JSON.stringify({
        branch_id: payload.branch_id,
        quantity: payload.quantity,
        price: payload.price
      }))
      if (response.status !== 201) throw new Error('')

      const result: string = await response.text()
      return result
    } catch (e) {
      return null
    }
  }

  const updateProductStock = async (payload: ProductStockRequest): Promise<string[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/product-stocks/${payload.product_id}`, 'put', JSON.stringify({
        branch_id: payload.branch_id,
        quantity: payload.quantity,
      }))
      if (response.status !== 200) throw new Error('')

      const result: string[] = await response.json()
      return result
    } catch (e) {
      return null
    }
  }

  return { products, categories, skus, loading, query, addProduct, updateProduct, getProductDetails, getProducts, getProductsSkus, addProductStock, updateProductStock }
}