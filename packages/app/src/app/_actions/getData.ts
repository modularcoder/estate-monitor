import { getISOWeek, getMonth, startOfMonth, endOfMonth, sub, subMonths, format } from 'date-fns'
import { type District } from '@/_types'
import { prisma } from '@/db'

type DataItemRent = {
  district: District,
  rentPricePerMeterUsd: number,
  rentPricePerMeterAmd: number,
}

type DataItemSell = {
  district: District,
  sellPricePerMeterUsd: number
  sellPricePerMeterAmd: number,
}

type DataItem = DataItemRent & DataItemSell

type Data = {
  startDate: Date,
  endDate: Date,
  items: DataItem[]
}

export async function getData() : Promise<Data> {
  'use server';

  const todayDate = new Date().getDate()

  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());

  // Month just started, show previous months
  if (todayDate < 4) {
    startDate = subMonths(startDate, 1)
    endDate = subMonths(endDate, 1)
  }

  const rentData: DataItemRent[] = await prisma.$queryRaw`
    SELECT
      ListingApartment.district,
      AVG(ListingApartment.statPricePerMeterUsd) as rentPricePerMeterUsd,
      AVG(ListingApartment.statPricePerMeterAmd) as rentPricePerMeterAmd
    FROM
      ListingApartment
    WHERE
      ListingApartment.type= 'RENT' AND
      ListingApartment.createdAt >= ${startDate} AND
      ListingApartment.createdAt <= ${endDate}
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
      ListingApartment.createdAt >= ${startDate} AND
      ListingApartment.createdAt <= ${endDate}
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
    startDate,
    endDate,
    items,
  } as Data
}
