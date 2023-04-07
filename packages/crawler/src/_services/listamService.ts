import { ElementHandle } from 'playwright'
import { Rates } from '../_types'
import { type Prisma } from './dbServie'
import { districtCodesByName } from './districtsService'

export const getEstateListItemData = async ({
  element,
  rates,
  type,
}: {
  element: ElementHandle
  rates: Rates
  type: Prisma.ListingApartmentCreateInput['type']
}) => {
  try {
    const href = await element.getAttribute('href')
    const extId = href?.split('/')[2]
    const extUrl = `https://list.am${href}`
    const rawTitle: string | undefined = await element.$eval(
      '.l',
      (el) => el.textContent,
    )
    const rawPrice: string | undefined = await element.$eval(
      '.p',
      (el) => el.textContent,
    )
    const rawMeta: string | undefined = await element.$eval(
      '.at',
      (el) => el.textContent,
    )

    if (!rawTitle || !rawPrice || !rawMeta) {
      return null
    }

    let listingCurrency
    if (rawPrice.includes('$')) {
      listingCurrency = 'USD'
    } else if (rawPrice.includes('֏')) {
      listingCurrency = 'AMD'
    }

    if (!listingCurrency) {
      return null
    }

    const priceStr = rawPrice.replace(/[^a-z0-9]/gi, '')

    const metaParts = rawMeta.split(',')
    const metaPartsDistrict = metaParts[0]
    const metaPartsNoRooms = metaParts[1].replace(/[^a-z0-9]/gi, '')
    const metaPartsArea = metaParts[2].replace(/[^a-z0-9]/gi, '')
    const metaPartsFloors = metaParts[3]
    const metaPartsFloor = metaPartsFloors.split('/')
    const metaPartsFloorListing = metaPartsFloor[0]
    const metaPartsFloorBuilding = metaPartsFloor[1]

    const district = districtCodesByName[metaPartsDistrict]

    const isNewDevelopment = rawTitle.toLowerCase().includes('նորակառույց')

    const statArea = parseInt(metaPartsArea)
    const statNoRooms = parseInt(metaPartsNoRooms)

    const statPriceUsd =
      listingCurrency === 'USD'
        ? parseInt(priceStr, 10)
        : listingCurrency === 'AMD'
        ? parseInt(priceStr, 10) / rates.USD
        : null
    const statPriceAmd =
      listingCurrency === 'AMD'
        ? parseInt(priceStr, 10)
        : listingCurrency === 'USD'
        ? parseInt(priceStr, 10) * rates.USD
        : null

    if (!statPriceAmd || !statPriceUsd) {
      return null
    }

    const statPricePerMeterAmd = statPriceAmd / statArea
    const statPricePerMeterUsd = statPriceUsd / statArea

    const statExchangeRate = rates.USD

    const statFloor = parseInt(metaPartsFloorListing)
    const statBuildingFloors = parseInt(metaPartsFloorBuilding)
    const statFloorIsFirst = statFloor === 1
    const statFloorIsLast = statFloor === statBuildingFloors

    // Valudate
    if (!extId) {
      return null
    }

    const dataItem: Prisma.ListingApartmentCreateInput = {
      type,
      source: 'LISTAM',
      extId,
      extUrl,
      rawTitle,
      rawPrice,
      rawMeta,
      city: 'YEREVAN',
      district,
      isNewDevelopment,
      statNoRooms,
      statArea,
      statPriceAmd,
      statPriceUsd,
      statPricePerMeterAmd,
      statPricePerMeterUsd,
      statExchangeRate,
      statBuildingFloors,
      statFloor,
      statFloorIsLast,
      statFloorIsFirst,
    }

    return dataItem
    // console.log('rent data item:', dataItem)
  } catch (e) {
    // Bad item, skip
    // console.error(e)

    return null
  }
}
