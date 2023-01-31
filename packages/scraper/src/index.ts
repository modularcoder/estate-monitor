import { execute as executeSell } from './scraper-listam-sell-batch'
import { execute as executeRent } from './scraper-listam-rent-batch'

// 5 minutes
const SCRAPE_INTERVAL = 1000 * 60 * 5

console.log('Starting scraper process...')

// setInterval(() => {
;(async () => {
  try {
    // Items for sale
    await executeSell()

    // Items for rent
    await executeRent()
  } catch (e) {
    console.log('Error:')
    console.error(e)
  }
})()

// }, SCRAPE_INTERVAL);
