import '../src/app/css/main.css'
import '../src/app/css/Hero.css'
import Topbar from '../src/app/tsx/Topbar'
import type { AppProps } from 'next/app'
import { GoogleAnalytics } from '@next/third-parties/google';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics gaId="G-5V3FP1TLB4" />
      <Topbar />
      <Component {...pageProps} />
    </>
  )
}