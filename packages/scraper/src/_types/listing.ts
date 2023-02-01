import { CURRENCIES } from '../_constants'

export type ListingSource = 'listam'

export interface ListingMeta {
  area: number
  price: number
  currency: `${CURRENCIES}`
  numRooms?: number
  city?: string
  district?: string
  calculatedPriceAMD: number
  calculatedPricePerMeterAMD: number
  calculatedPriceUSD: number
  calculatedPricePerMeterUSD: number
}

export interface Listing {
  id: string
  extId: string
  extUrl: string
  source: ListingSource
  type: 'rent' | 'sell'
  category: 'apartment' | 'land' | 'commercial'
  postedAt: string
  updatedAt: string
  processedAt?: string
  meta: ListingMeta
}
