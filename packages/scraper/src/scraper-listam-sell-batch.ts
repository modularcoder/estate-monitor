import playwright, { ElementHandle } from 'playwright'
import { subDays } from 'date-fns'
import { Rates } from './_types'
import dbService, { type Prisma } from './_services/dbServie'
import { districtCodesByName } from './_services/districtsService'
// import { getRandomProxyServer } from './_services/proxyServersService'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const NAME = 'list.am SELL batch extractor'

type ExecuteOptions = {
  rates: Rates
  numPages?: number
}

type Execute = (options: ExecuteOptions) => Promise<void>

export const execute: Execute = async ({ rates, numPages = 1 }) => {
  if (!rates) {
    console.log(`Rates are not provided for ${NAME}, exiting process`)
    return
  }

  console.log(`Starting ${NAME}`)

  const browser = await playwright['chromium'].launch({
    headless: true,
    args: ['--no-sandbox'],
    // proxy: {
    //   // server: 'proxy.zenrows.com:8001',
    //   // username: 'a2feb822f2d3fb0fffca6bf974440245ecf9bbb8',
    //   // password: '',
    //   // server:
    //   // 'http://a2feb822f2d3fb0fffca6bf974440245ecf9bbb8:@proxy.zenrows.com:8001', //getRandomProxyServer(),
    // },
  })
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()
  const pagesArray = Array.from({ length: numPages }, (v, i) => i + 1)

  console.log('waiting...')

  const pagesResults = []
  for (const pageNum of pagesArray) {
    pagesResults.push(await executePage({ page, pageNum, rates }))
  }

  // console.log('Pages results', JSON.stringify(pagesResults, null, 2))

  console.info('Closing the browser')
  await browser.close()
}

const executePage = async ({
  pageNum,
  page,
  rates,
}: {
  pageNum: number
  page: playwright.Page
  rates: Rates
}) => {
  const url = `https://www.list.am/category/60${
    pageNum > 1 ? `/${pageNum}` : ''
  }?type=1&n=1&crc=-1`

  await page.goto(url)
  await page.waitForSelector('.dlf')

  const itemElements = await page.$$('.gl a')
  const items = []

  // Process items from DOM
  for (const element of itemElements) {
    const dataItem = await getListDataItem({ element, rates })

    if (!dataItem) {
      continue
    }

    items.push(dataItem)
  }

  console.info(`Page ${pageNum}: Found ${items.length} valid items for sell`)

  // We want to exclude items which were already injected during last 2 weeks
  const existingItems = await dbService.listingApartment.findMany({
    select: {
      extId: true,
    },
    where: {
      extId: {
        in: items.map((item) => item.extId),
      },
      createdAt: {
        gte: subDays(new Date(), 14),
      },
    },
  })

  const existingItemsIds = existingItems.map(({ extId }) => extId)

  console.info(
    `Page ${pageNum}: Skip ${existingItems.length} items, which were already injected during last 2 weeks`,
  )

  const itemsNew = items.filter(
    (item) => !existingItemsIds.includes(item.extId),
  )

  const createMany = await dbService.listingApartment.createMany({
    data: itemsNew,
  })

  console.info(`Page ${pageNum}: ${createMany.count} items injected`)

  return items
}

async function getListDataItem({
  element,
  rates,
}: {
  element: ElementHandle
  rates: Rates
}) {
  try {
    const href = await element.getAttribute('href')
    const extId = href?.split('/')[2]
    const extUrl = `https://list.am${href}`
    const rawTitle = await element.$eval('.l', (el) => el.textContent)
    const rawPrice = await element.$eval('.p', (el) => el.textContent)
    const rawMeta = await element.$eval('.at', (el) => el.textContent)

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
      type: 'SELL',
      source: 'LISTAM',
      extId,
      extUrl,
      rawTitle,
      rawPrice,
      rawMeta,
      city: 'YEREVAN',
      district,
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
    // console.log('Sell data item:', dataItem)
  } catch (e) {
    // Bad item, skip
    // console.error(e)

    return null
  }
}
