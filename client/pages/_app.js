import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import useStore from "@/store/store";
import { initMercadoPago } from "@mercadopago/sdk-react";

export default function App({ Component, pageProps }) {
  const hydrateCart = useStore((state) => state.hydrateCart);
  const hydrateWishlist = useStore((state) => state.hydrateWishlist);
  const hydrateTheme = useStore((state) => state.hydrateTheme);

  useEffect(() => {
    hydrateCart();
    hydrateWishlist();
    hydrateTheme();
  }, [hydrateCart, hydrateWishlist, hydrateTheme]);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (publicKey) initMercadoPago(publicKey);
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Toaster />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
        <Analytics />
      </div>
    </SessionProvider>
  );
}
