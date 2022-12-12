import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps}></Component>
  //return <div id={"body-wrapper"} className={"bg-dark-blue"}><Component {...pageProps} /></div>
}

export default MyApp