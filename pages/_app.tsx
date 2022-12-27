import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Sidebar from "./components/Sidebar";
import React from "react";
import Footer from "./components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <div className="bg-t-blue-1000 text-white">
          <div className="flex">
              <Sidebar/>
              <main className={"p-5 w-full"}>
                  <Component {...pageProps} />
              </main>
          </div>
          <Footer/>
      </div>
  );
}
export default MyApp