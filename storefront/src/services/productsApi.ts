import type { Product } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/novatech-api'
const PRODUCTS_ENDPOINT = `${API_BASE}/products.php`

const normalizeList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean)
  }

  return []
}

const normalizeProduct = (product: Product): Product => ({
  ...product,
  price: Number(product.price),
  rating: Number(product.rating),
  colors: normalizeList(product.colors),
  features: normalizeList(product.features),
})

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String(payload.message)
        : 'Không thể kết nối API sản phẩm.'

    throw new Error(message)
  }

  return payload as T
}

export const fetchProducts = async (): Promise<Product[]> => {
  const products = await parseResponse<Product[]>(
    await fetch(PRODUCTS_ENDPOINT, {
      credentials: 'include',
    }),
  )
  return products.map(normalizeProduct)
}
