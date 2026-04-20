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
  const products = await parseResponse<Product[]>(await fetch(PRODUCTS_ENDPOINT))
  return products.map(normalizeProduct)
}

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const created = await parseResponse<Product>(
    await fetch(PRODUCTS_ENDPOINT, {
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }),
  )

  return normalizeProduct(created)
}

export const updateProduct = async (product: Product): Promise<Product> => {
  const updated = await parseResponse<Product>(
    await fetch(`${PRODUCTS_ENDPOINT}?id=${product.id}`, {
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    }),
  )

  return normalizeProduct(updated)
}

export const deleteProduct = async (productId: number): Promise<void> => {
  await parseResponse<{ ok: boolean }>(
    await fetch(`${PRODUCTS_ENDPOINT}?id=${productId}`, {
      method: 'DELETE',
    }),
  )
}
