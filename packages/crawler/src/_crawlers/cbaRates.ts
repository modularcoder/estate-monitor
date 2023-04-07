import { chromium } from 'playwright'
import { Rates } from '../_types'
import dbService from '../_services/dbServie'

type Execute = () => Promise<Rates | undefined>

// RSS feed
// https://www.cba.am/_layouts/rssreader.aspx?rss=280F57B8-763C-4EE4-90E0-8136C13E47DA

export const execute: Execute = async () => {
  // Trying to get the last data point, if it's today, then return it as a value
  const foundRate = await dbService.rate.findUnique({
    where: {
      date: new Date(),
    },
  })

  if (foundRate) {
    return {
      USD: foundRate.usd,
    }
  }

  console.log('Starting CBA exchange rates extractor')

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox'],
  })

  try {
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(
      'https://www.cba.am/_layouts/rssreader.aspx?rss=280F57B8-763C-4EE4-90E0-8136C13E47DA',
    )

    const usdRow = await page.$eval(
      'xpath=/html/body/rss/channel/item[1]/title',
      (el) => el.textContent,
    )

    const usdRowParts = usdRow.split('-')
    const usdValue = parseFloat(usdRowParts[2])

    if (!usdValue) {
      return
    }

    const rates = {
      USD: usdValue,
    }

    console.log('Rates extracted: ', rates)
    // console.log('Store the rates in the DB')

    await dbService.rate.create({
      data: {
        date: new Date(),
        usd: usdValue,
      },
    })

    return rates
  } catch (err) {
    console.error('Could not extrate rates', err)
  }

  console.info('Closing the browser')
  await browser.close()
}
