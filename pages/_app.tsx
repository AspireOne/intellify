import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Sidebar from "./components/Sidebar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <div id={"body-wrapper"} className="bg-dark-blue text-white">
          <div className="flex">
              <Sidebar/>
              <main>
                  <Component {...pageProps} />
              </main>
          </div>
      </div>
  );
}
export default MyApp