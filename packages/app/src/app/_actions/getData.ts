// import { getISOWeek, getMonth } from 'date-fns'
import { prisma } from '@/db'

type DataItemRent = {
  district: string,
  rentPricePerMeterUsd: number,
  rentPricePerMeterAmd: number,
}

type DataItemSell = {
  district: string,
  sellPricePerMeterUsd: number
  sellPricePerMeterAmd: number,
}

type DataItem = DataItemRent & DataItemSell

type Data = {
  items: DataItem[]
}

export async function getData() : Promise<Data> {
  'use server';

  // const currentWeek = getISOWeek(new Date())
  const currentMonth = new Date().getMonth()


  // js counts months from 0 to 11
  // mysql counts months from 1 to 12
  // need to increase the js month value by one

  const rentData: DataItemRent[] = await prisma.$queryRaw`
    SELECT
      ListingApartment.district,
      AVG(ListingApartment.statPricePerMeterUsd) as rentPricePerMeterUsd,
      AVG(ListingApartment.statPricePerMeterAmd) as rentPricePerMeterAmd
    FROM
      ListingApartment
    WHERE
      ListingApartment.type= 'RENT' AND
      MONTH(ListingApartment.createdAt) = ${currentMonth + 1}
    GROUP BY
      ListingApartment.district
    `



  const sellData: DataItemSell[] = await prisma.$queryRaw`
    SELECT
      ListingApartment.district,
      AVG(ListingApartment.statPricePerMeterUsd) as sellPricePerMeterUsd,
      AVG(ListingApartment.statPricePerMeterAmd) as sellPricePerMeterAmd
    FROM
      ListingApartment
    WHERE
      ListingApartment.type= 'SELL' AND
      MONTH(ListingApartment.createdAt) = ${currentMonth + 1}
    GROUP BY
      ListingApartment.district
    `

  const rentDataByDistrict = rentData.reduce((agg: { [key: string]: DataItemRent }, item) => {
    agg[item.district] = item

    return agg;
  }, {})

  const sellDataByDistrict = sellData.reduce((agg: { [key: string]: DataItemSell }, item) => {
    agg[item.district] = item

    return agg;
  }, {})


  const items = Object.keys(rentDataByDistrict).map(key => {
    return {
      ...rentDataByDistrict[key],
      ...sellDataByDistrict[key]
    }
  })


  return {
    currentMonth,
    items,
  } as Data
}
