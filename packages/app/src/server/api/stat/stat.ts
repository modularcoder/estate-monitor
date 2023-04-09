import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const statRouter = createTRPCRouter({
  getByWeek: publicProcedure
    .input(z.object({
      type: z.enum(['SELL', 'RENT']),
      // weeknumber: z.number()
    }))
    .query<{
      weeknumber: number,
      district: string
      statPricePerMeterUsd: number
      statPricePerMeterAmd: number
    }[]>(({ ctx, input }) => {

      return ctx.prisma.$queryRaw`
        SELECT
          WEEK(ListingApartment.createdAt) as weeknumber,
          ListingApartment.district,
          AVG(ListingApartment.statPricePerMeterUsd) as statPricePerMeterUsd,
          AVG(ListingApartment.statPricePerMeterAmd) as statPricePerMeterAmd
        FROM
          ListingApartment
        WHERE
          ListingApartment.type= ${input.type}
        GROUP BY
          WEEK(ListingApartment.createdAt), ListingApartment.district
      `

      // return ctx.prisma.$queryRaw`
      //   SELECT
      //     WEEK('ListingApartment'.'createdAt') as week,
      //     'ListingApartment'.'district',
      //     AVG('ListingApartment'.'statPricePerMeterUsd') as 'statPricePerMeterUsd',
      //     AVG('ListingApartment'.'statPricePerMeterAmd') as 'statPricePerMeterAmd'
      //   FROM
      //     'ListingApartment'
      //   WHERE
      //     'ListingApartment'.'type'= '${input.type}'
      //   GROUP BY
      //     WEEK('ListingApartment'.'createdAt'), 'ListingApartment'.'district'
      // `

      // return ctx.prisma.listingApartment.groupBy({
      //   by: ['district'],
      //   _avg: {
      //     statPricePerMeterAmd: true,
      //     statPricePerMeterUsd: true,
      //   }
      // })

      // return {
      //   greeting: `Hello ${input.type}`,
      // };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    // return ctx.prisma

    return {}
  }),
});
