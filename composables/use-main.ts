import { Branch } from "~~/interfaces/branch"
import { ChartCashflow } from "~~/interfaces/general"

export default function () {
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const viewMode = useState<'desktop' | 'mobile'>('view-mode', () => null)

  const getOverview = async (): Promise<{
    branches: Branch[]
    cashflow: ChartCashflow[]
    processingCount: number
    saleCount: number
    averageSales: number
    totalSales: number
  }> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}`, 'get')
      if (response.status !== 200) throw new Error('')

      const result = await response.json()

      return result
    } catch (e) {
      return null
    }
  }

  return { viewMode, getOverview }
}