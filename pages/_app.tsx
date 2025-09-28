import type { AppProps } from 'next/app';
import '../src/app/css/main.css';
import '../src/app/css/Topbar.css';
import '../src/app/css/Hero.css';
import '../src/app/css/Song.css';
import '../src/app/css/Search.css';
import '../src/app/css/Filter.css';
import Topbar from '../src/app/tsx/Topbar';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Topbar />
      <Component {...pageProps} />
    </>
  )
}