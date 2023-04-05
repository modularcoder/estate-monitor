import { execute as executeRates } from './scraper-rates'
import { execute as executeSell } from './scraper-listam-sell-batch'
import { execute as executeRent } from './scraper-listam-rent-batch'

import db from './_services/dbServie'

// 5 minutes
const SCRAPE_INTERVAL = 1000 * 60 * 5

console.log('Starting scraper process...')

// setInterval(() => {
;(async () => {
  try {
    // // Create listing record
    // await db.listing.create({
    //   data: {
    //     title: `Hello ${Math.random()}`,
    //     tagline: 'World',
    //     extId: 'string',
    //     extUrl: 'string',
    //     source: 'string',
    //     type: 'string',
    //     category: 'string',
    //     isProcessed: false,
    //     isUnavailable: false,
    //     extCreatedAt: new Date(),
    //     extUpdatedAt: new Date(),
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     processedAt: new Date(),
    //     meta: {},
    //   },
    // })

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

    // // Items for rent
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
