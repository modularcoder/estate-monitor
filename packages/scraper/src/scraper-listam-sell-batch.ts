import playwright from 'playwright'
import { Rates } from './_types'
import dbService from './_services/dbServie'
import { getRandomProxyServer } from './_services/proxyServersService'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const NAME = 'list.am SELL batch extractor'

type ExecuteOptions = {
  rates: Rates
  numPages?: number
}

type Execute = (options: ExecuteOptions) => Promise<void>

// const playwright = require('playwright');
const data: any[] = []

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
  const pagesArray = Array.from({ length: numPages }, (v, i) => i)

  console.log('waiting...')

  const pagesResults = []
  for (const pageNum of pagesArray) {
    pagesResults.push(await executePage({ page, pageNum }))
  }

  console.log('Pages results', JSON.stringify(pagesResults, null, 2))

  console.info('Closing the browser')
  await browser.close()
}

const executePage = async ({
  pageNum,
  page,
}: {
  pageNum: number
  page: playwright.Page
}) => {
  const url = `https://www.list.am/category/60${
    pageNum > 1 ? `/${pageNum}` : ''
  }?type=1&n=1&crc=-1`

  await page.goto(url)
  await page.waitForSelector('.dlf')

  const itemElements = await page.$$('.gl a')
  const items = []

  console.info(`Page ${pageNum}: Found ${itemElements.length} items for sell`)

  // Process items from DOM
  for (const element of itemElements) {
    try {
      const href = await element.getAttribute('href')
      const extId = href?.split('/')[2]
      const extUrl = `https://list.am${href}`
      const titleContent = await element.$eval('.l', (el) => el.textContent)
      const priceContent = await element.$eval('.p', (el) => el.textContent)
      const metaContent = await element.$eval('.at', (el) => el.textContent)

      const dataItem = {
        extId,
        extUrl,
        titleContent,
        priceContent,
        metaContent,
      }

      items.push(dataItem)

      // console.log('Sell data item:', dataItem)
    } catch (e) {
      // Bad item, skip
      continue
    }
  }

  return items
}
