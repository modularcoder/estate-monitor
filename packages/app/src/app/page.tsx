
import Head from "next/head";
import { format } from 'date-fns'
import { getData } from './_actions/getData'
import { getDistrictName } from '@/_services/localeService'

const formatPrice = (price: number) => {
  const divider = price >= 100000
    ? 1000
    : 100;

  const priceRounded = Math.round(price / divider) * divider;

  return priceRounded
}


export default async function Home() {

  const data = await getData();

  return (
    <>
      <Head>
        <title>Estate Monitor - Երևանում անշարժ գույքի գների մոնիթորինգ</title>
        <meta name="description" content="Անշարժ գույքի գներ Երևանում" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="container mx-auto px-4 py-16 ">
            <header className="text-white mb-8">
              <h1 className="text-4xl leading-10 tracking-tight text-white mb-8">
                Բնակարանների վաճառքի և վարձակալության միջին գները <span className="text-primary">Երևանում</span>
              </h1>
              <h2 className="text-xl">
                {format(data.startDate, 'dd.MM.yyyy')} - {format(data.endDate, 'dd.MM.yyyy')}
              </h2>
            </header>
            <section className="text-white w-full">
              <div className="rounded shadow-md bg-white text-gray-600 overflow-hidden">
                <table className="w-full text-left divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">
                        Վարչական շրջան
                      </th>
                      <th className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900">
                        <div>Վաճառք</div>
                        Դրամ/1քմ
                      </th>
                      <th className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900">
                        <div>Վարձակալություն</div>
                        Դրամ/1քմ
                      </th>
                      <th className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900">
                        <div>Եկամտաբերության ինդեքս</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" bg-white">
                    { data.items.map(((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? undefined : 'bg-gray-100'}>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                          { getDistrictName(item.district)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">
                          { formatPrice(item.sellPricePerMeterAmd)} AMD
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">
                          { formatPrice(item.rentPricePerMeterAmd)} AMD
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">
                          { Math.round(10000 * (item.rentPricePerMeterAmd / item.sellPricePerMeterAmd)) / 10000}
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
      </main>
    </>
  )
}
