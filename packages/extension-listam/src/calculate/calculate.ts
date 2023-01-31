const listings = document.querySelectorAll('.gl a')
const exchangeRage = 400

listings.forEach(item => {

    const priceEl = item.querySelector('.p')
    const descriptionEl = item.querySelector('.at')

    if (!priceEl || !descriptionEl) {
        item.remove()
        return false
    }

    const currency = priceEl.innerHTML.indexOf('֏') > -1 ? 'amd' : 'usd'

    const priceStr = priceEl.innerHTML.replace(/[^a-z0-9]/gi, '')
    const areaStr = descriptionEl.innerHTML.split(',')[2].replace(/[^a-z0-9]/gi, '')

    if (!priceStr || !areaStr) {
        item.remove()
        return false
    }

    const price = currency === 'amd' ? parseInt(priceStr, 10) / exchangeRage : parseInt(priceStr, 10)
    const area = parseInt(areaStr)

    const pricePerMeter = Math.round(price / area)

    // Unrealistic listing
    if (pricePerMeter < 100) {
        item.remove()
        return false
    }

    const pricePerMeterEl = document.createElement("span")

    pricePerMeterEl.innerHTML = ` - $${pricePerMeter}/m2`

    priceEl.appendChild(pricePerMeterEl)


    console.log('item', item)
    console.log('price', price)
    console.log('area', area)
})