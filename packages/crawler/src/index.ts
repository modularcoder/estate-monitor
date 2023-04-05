import { execute as executeRates } from './_crawlers/cbaRates'
import { execute as executeSell } from './_crawlers/listamSellBatch'
import { execute as executeRent } from './_crawlers/listamRentBatch'

import db from './_services/dbServie'

// 5 minutes
const SCRAPE_INTERVAL = 1000 * 60 * 5

console.log('Starting scraper process...')

// setInterval(() => {
;(async () => {
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
})()

// }, SCRAPE_INTERVAL);
