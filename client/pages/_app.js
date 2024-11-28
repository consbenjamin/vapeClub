import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div>
        <Toaster />
        <Component {...pageProps} />
      </div>
  </SessionProvider>
  )
}
