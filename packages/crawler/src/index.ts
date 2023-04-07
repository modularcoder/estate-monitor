import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

import { execute as executeRates } from './_crawlers/cbaRates'
import { execute as executeSell } from './_crawlers/listamSellBatch'
import { execute as executeRent } from './_crawlers/listamRentBatch'

// 60 minutes by default
const CRAWL_INTERVAL = process.env.CRAWL_INTERVAL
  ? parseInt(process.env.CRAWL_INTERVAL)
  : 30 * 1000 * 60

console.log(`Crawl interval set to ${CRAWL_INTERVAL}`)

async function start() {
  try {
    // Get exchange rates
    const rates = await executeRates()

    if (!rates) {
      console.error('Rates are not defined, stopping execution process')
      return false
    }

    // Items for sale
    await executeSell({
      rates,
      numPages: 10,
    })

    // Items for rent
    await executeRent({
      rates,
      numPages: 10,
    })
  } catch (e) {
    console.log('Error:')
    console.error(e)
  }
}

start()

setInterval(start, CRAWL_INTERVAL)
