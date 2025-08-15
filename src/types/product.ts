export interface Product {
  id: number
  name: string
  image: string
  specs: Record<string, string | number>
}