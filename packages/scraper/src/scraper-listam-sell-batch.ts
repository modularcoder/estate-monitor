import playwright from 'playwright'

// const playwright = require('playwright');
const data: any[] = []

export const execute = async (options = { numPages: 5 }) => {
  console.log('Starting list sell executor')

  const browser = await playwright['chromium'].launch({
    headless: true,
    args: ['--no-sandbox'],
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('https://www.list.am/category/60?type=1&n=1&crc=-1')

  console.log('waiting...')

  await page.waitForSelector('.dlf')

  const items = await page.$$('.gl a')

  console.info(`Found ${items.length} items for sell`)

  // items.forEach((item) => {

  // })

  for (const item of items) {
    try {
      const href = await item.getAttribute('href')
      const extId = href?.split('/')[2]
      const extUrl = `https://list.am${href}`
      const titleContent = await item.$eval('.l', (el) => el.textContent)
      const priceContent = await item.$eval('.p', (el) => el.textContent)
      const metaContent = await item.$eval('.at', (el) => el.textContent)

      const dataItem = {
        extId,
        extUrl,
        titleContent,
        priceContent,
        metaContent,
      }

      console.log('Sell data item:', dataItem)
    } catch (e) {
      // Bad item, skip
      continue
    }
  }

  //   for (const post of posts) {
  //     const title = await post.$eval('.title a', (el) => el.textContent);
  //     const url = await post.$eval('.title a', (el) => el.href);
  //     const upvotes = await post.$eval('.score.unvoted', (el) => el.textContent);
  //     const comments = await post.$eval('.comments', (el) => el.textContent);
  //     const time = await post.$eval('.tagline time', (el) => el.textContent);
  //     data.push({ title, url, upvotes, comments, time });
  //   }
  //   console.log(data);
  //   console.log(data.length);

  console.info('Closing the browser')
  await browser.close()
}

// const executePage = async (url) => {

// }
