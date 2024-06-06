// https://www.list.am/category/56?type=1&n=1&crc=-1
//
import { chromium, Page, Browser } from 'playwright'
import { subDays } from 'date-fns'
import { Rates } from '../_types'
import dbService from '../_services/dbServie'
import { getEstateListItemData } from '../_services/listamService'
// import { getRandomProxyServer } from './_services/proxyServersService'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const NAME = 'list.am RENT batch crawler'

type ExecuteOptions = {
  rates: Rates
  numPages?: number
  browser: Browser
}

type Execute = (options: ExecuteOptions) => Promise<void>

export const execute: Execute = async ({ rates, numPages = 1, browser }) => {
  if (!rates) {
    console.log(`${NAME}: Rates are not provided exiting process`)
    return
  }

  console.log(`${NAME} starting`)

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()
  await page.setExtraHTTPHeaders({
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  })
  const pagesArray = Array.from({ length: numPages }, (v, i) => i + 1)

  const pagesResults = []
  for (const pageNum of pagesArray) {
    pagesResults.push(await executePage({ page, pageNum, rates }))
  }
}

const executePage = async ({
  pageNum,
  page,
  rates,
}: {
  pageNum: number
  page: Page
  rates: Rates
}) => {
  const url = `https://www.list.am/category/56${
    pageNum > 1 ? `/${pageNum}` : ''
  }?type=1&n=1&crc=-1`

  await page.goto(url)
  await page.waitForSelector('.dlf')

  const itemElements = await page.$$('.dl a')
  const items = []

  // Process items from DOM
  for (const element of itemElements) {
    const dataItem = await getEstateListItemData({
      element,
      rates,
      type: 'RENT',
    })

    if (!dataItem) {
      continue
    }

    items.push(dataItem)
  }

  console.info(
    `${NAME} Page ${pageNum}: Found ${items.length} valid items for rent`,
  )

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
    `${NAME} Page ${pageNum}: Skip ${existingItems.length} items, which were already injected during last 2 weeks`,
  )

  const itemsNew = items.filter(
    (item) => !existingItemsIds.includes(item.extId),
  )

  try {
    const createMany = await dbService.listingApartment.createMany({
      data: itemsNew,
    })

    console.info(`${NAME} Page ${pageNum}: ${createMany.count} items injected`)
  } catch (err) {
    console.warn('Warning', err)
  }

  return items
}
