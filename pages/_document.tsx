import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5V3FP1TLB4"></script>
        <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-5V3FP1TLB4');`}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}