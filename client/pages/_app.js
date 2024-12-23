import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className="flex flex-col min-h-screen">
        <Toaster />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  )
}
