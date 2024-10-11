import { chromium, Page, Browser } from 'playwright'
import { subDays } from 'date-fns'
import { Rates } from '../_types'
import dbService from '../_services/dbServie'
import { getEstateListItemData } from '../_services/listamService'

// import { getRandomProxyServer } from './_services/proxyServersService'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const NAME = 'list.am SELL batch crawler'

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

  console.log(`${NAME} starting `)

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()
  // Set custom headers
  await page.setExtraHTTPHeaders({
    // accept:
    //   'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    // 'accept-encoding': 'gzip, deflate, br, zstd',
    // 'accept-language': 'en-US,en;q=0.9,hy;q=0.8,ru;q=0.7',
    // 'cache-control': 'max-age=0',
    // 'User-Agent:':
    //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    // priority: 'u=0, i',
    // 'sec-ch-ua':
    //   '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
    // 'sec-ch-ua-mobile': '?0',
    // 'sec-ch-ua-platform': 'macOS',
    // 'sec-fetch-dest': 'document',
    // 'sec-fetch-mode': 'navigate',
    // 'sec-fetch-site': 'none',
    // 'sec-fetch-user': '?1',
    // 'upgrade-insecure-requests': '1',
    // 'User-Agent':
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    // 'Accept-Language': 'en-US,en;q=0.9',
    // Accept:
    //   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    // Referrer:
    //   'https://www.zenrows.com/blog/playwright-cloudflare-bypass#go-around-playwright-limitations',
  })
  const pagesArray = Array.from({ length: numPages }, (v, i) => i + 1)
  const pagesResults = []

  // await page.goto(`https://www.list.am/category/60?type=1&n=1&crc=-1`)

  // // Add a random delay of 1 to 5 seconds to simulate human behavior
  // await new Promise((resolve) =>
  //   setTimeout(resolve, Math.floor(Math.random() * 4000 + 1000)),
  // )

  // // Scroll the pageination
  // await page.evaluate(() =>
  //   // @ts-ignore
  //   window.scrollBy(0, window.innerHeight - 50 * Math.random()),
  // )

  // const pageResult = await executePage({ page, pageNum: 1, rates })
  // pagesResults.push(pageResult)

  // // Add another random delay of 1 to 5 seconds
  // await new Promise((resolve) =>
  //   setTimeout(resolve, Math.floor(Math.random() * 4000 + 1000)),
  // )

  // // const pagination = await page.$$('.dlf')
  // const paginationLinks = await page.$$('.dlf .pp a')
  // const paginationLinkNext = paginationLinks[paginationLinks.length - 1]

  // await paginationLinkNext.hover({
  //   timeout: 244,
  //   position: {
  //     x: 10,
  //     y: 13,
  //   },
  // })

  // const currentPageUrl = page.url()

  // go to next page
  // await paginationLinkNext.click()

  // await page.waitForTimeout(500 + 300 * Math.random())

  for (const pageNum of pagesArray) {
    // Add a random delay of 1 to 5 seconds to simulate human behavior
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 4000 + 1000)),
    )

    // Scroll the pageination
    await page.evaluate(() =>
      // @ts-expect-error window is valid
      window.scrollBy(0, window.innerHeight - 50 * Math.random()),
    )

    const pageResult = await executePage({ page, pageNum, rates })
    pagesResults.push(pageResult)

    // Add another random delay of 1 to 5 seconds
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 4000 + 1000)),
    )

    // const pagination = await page.$$('.dlf')
    const paginationLinks = await page.$$('.dlf .pp a')
    const paginationLinkNext = paginationLinks[paginationLinks.length - 1]

    await paginationLinkNext.hover()

    // const currentPageUrl = page.url()

    // // go to next page
    // await paginationLinkNext.click()

    // await page.waitForTimeout(500 + 300 * Math.random())
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
  // const prevUrl = `https://www.list.am/category/60${
  //   pageNum > 2 ? `/${pageNum - 1}` : ''
  // }?type=1&n=1&crc=-1`

  const url = `https://www.list.am/category/60${
    pageNum > 1 ? `/${pageNum}` : ''
  }?type=1&n=1&crc=-1`

  // console.info(`${NAME} Page ${pageNum} URL: ${url}`)

  // if (pageNum > 1) {
  //   page.setExtraHTTPHeaders({
  //     Referer: prevUrl,
  //   })
  // }
  await page.goto(url)

  await page.screenshot({ path: `screenshot-${pageNum}.png`, fullPage: true })
  await page.waitForSelector('.dl')

  const itemElements = await page.$$('.gl a')
  const items = []

  // Process items from DOM
  for (const element of itemElements) {
    const dataItem = await getEstateListItemData({
      element,
      rates,
      type: 'SELL',
    })

    if (!dataItem) {
      continue
    }

    items.push(dataItem)
  }

  console.info(
    `${NAME} Page ${pageNum}: Found ${items.length} valid items for sell`,
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
