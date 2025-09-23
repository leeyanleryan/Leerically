import '../src/app/css/main.css'
import '../src/app/css/Hero.css'
import Topbar from '../src/app/tsx/Topbar'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Topbar />
      <Component {...pageProps} />
    </>
  )
}