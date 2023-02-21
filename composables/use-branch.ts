import { Branch } from "~~/interfaces/branch";

export default () => {
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const branches = useState<Branch[]>('branches', () => null)

  const getBranches = async (): Promise<Branch[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/branches`, 'get')
      if (response.status !== 200) throw new Error('')

      const result = await response.json()
      branches.value = result

      return result
    } catch (e) {
      return null
    }
  }

  return { branches, getBranches }
}