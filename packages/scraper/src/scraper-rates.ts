import playwright from 'playwright'
import { Rates } from './_types'

type Execute = () => Promise<Rates | undefined>

export const execute: Execute = async () => {
  console.log('Starting CBA exchange rates extractor')

  const browser = await playwright['chromium'].launch({
    headless: true,
    args: ['--no-sandbox'],
  })

  try {
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('https://www.cba.am/AM/SitePages/Default.aspx')
    await page.waitForSelector('#ExchangePanelC1')

    const usdLabel = await page.$('#ExchangePanelC1 + div b:text("USD")')
    const usdRow = await usdLabel?.$('xpath=../..')
    const usdValue = await usdRow?.$eval('xpath=em[3]', (el) =>
      parseFloat(el.textContent),
    )

    if (!usdValue) {
      return
    }

    const rates = {
      usd: usdValue,
    }

    console.log('Rates extracted: ', rates)

    return rates
  } catch (err) {
    console.error('Could not extrate rates', err)
  }

  console.info('Closing the browser')
  await browser.close()
}
