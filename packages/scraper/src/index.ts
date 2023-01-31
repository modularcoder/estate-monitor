import { execute as executeRates } from './scraper-rates'
import { execute as executeSell } from './scraper-listam-sell-batch'
import { execute as executeRent } from './scraper-listam-rent-batch'

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

    // // Items for sale
    // await executeSell({
    //   rates,
    // })

    // // Items for rent
    // await executeRent({
    //   rates,
    // })
  } catch (e) {
    console.log('Error:')
    console.error(e)
  }
})()

// }, SCRAPE_INTERVAL);
