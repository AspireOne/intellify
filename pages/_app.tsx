import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Sidebar from "../components/Sidebar";
import React from "react";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <div className="bg-[linear-gradient(180deg,rgba(47,29,101,0.8)_0%,rgba(14,20,35,1)_10%)] text-white">
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