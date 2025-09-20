import '../src/app/css/main.css'
import '../src/app/css/Hero.css'
import Topbar from '../src/app/tsx/Topbar'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Leerically</title>
        <meta name="description" content="A platform for understanding song lyrics." />
      </Head>
      <Topbar />
      <Component {...pageProps} />
    </>
  )
}