import { chromium } from 'playwright'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

import { execute as executeRates } from './_crawlers/cbaRates'
import { execute as executeSell } from './_crawlers/listamSellBatch'
import { execute as executeRent } from './_crawlers/listamRentBatch'

// 60 minutes by default
const CRAWL_INTERVAL = process.env.CRAWL_INTERVAL
  ? parseInt(process.env.CRAWL_INTERVAL) * 1000
  : 30 * 1000 * 60

console.log(`Crawl interval set to ${CRAWL_INTERVAL / 1000} seconds`)

async function start() {
  console.log('Starting chromium browser')

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox'],
  })

  try {
    // Get exchange rates
    const rates = await executeRates({ browser })

    if (!rates) {
      console.error('Rates are not defined, stopping execution process')
      return false
    }

    // Items for sale
    await executeSell({
      browser,
      rates,
      numPages: 10,
    })

    // Items for rent
    await executeRent({
      browser,
      rates,
      numPages: 10,
    })
  } catch (e) {
    console.log('Error:')
    console.error(e)
  }

  console.info(`Closing chromium the browser`)
  await browser.close()
}

start()

setInterval(start, CRAWL_INTERVAL)
