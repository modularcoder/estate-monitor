import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";

const Home: NextPage = () => {
  // const greetingQuery = api.example.hello.useQuery({ text: "from tRPC" });
  const sellStatsQuery = api.stat.getByWeek.useQuery({ type: 'SELL' })


  return (
    <>
      <Head>
        <title>Estate Monitor - Երևանում անշարժ գույքի գների մոնիթորինգ</title>
        <meta name="description" content="Անշարժ գույքի գներ Երևանում" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="container mx-auto px-4 py-16 ">
            <header className="text-white mb-10">
              <h1 className="text-4xl leading-10 tracking-tight font-extrabold text-white">
                Բնակարանների վաճառքի և վարձակալության միջին գները <span className="text-primary">Երևանում</span>
              </h1>
            </header>
            <section className="text-white w-full">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>
                      Վարչական շրջան
                    </th>
                    <th className="text-right">
                      <div>Վաճառք</div>
                      Դրամ, 1քմ
                    </th>
                    <th className="text-right">
                      <div>Վաճառք</div>
                      $, 1քմ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  { sellStatsQuery?.data?.length && sellStatsQuery.data.map(((item, index) => (
                    <tr key={index}>
                      <td>
                        { item.district}
                      </td>
                      <td className="text-right">
                        { Math.round(item.statPricePerMeterAmd)} AMD
                      </td>
                      <td className="text-right">
                        { Math.round(item.statPricePerMeterUsd)} $
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </section>
          </div>
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div> */}
          {/* <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
          </div> */}

      </main>
    </>
  );
};

export default Home;

