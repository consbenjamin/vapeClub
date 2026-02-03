import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  const { payment_id } = router.query;

  return (
    <>
      <Head>
        <title>Pago aprobado – VapeClub</title>
        <meta name="description" content="Tu pago fue aprobado correctamente." />
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-background px-4">
        <div className="text-center max-w-md bg-surface rounded-2xl shadow-lg border border-border p-6 sm:p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand/20 dark:bg-brand/30 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">¡Pago aprobado!</h1>
          <p className="mt-4 text-foreground/80">
            Gracias por tu compra. El pago ha sido aprobado exitosamente.
          </p>
          {payment_id && (
            <p className="mt-2 text-sm text-foreground/60">ID: {payment_id}</p>
          )}
          <Link
            href="/"
            className="mt-8 inline-flex px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark dark:hover:bg-brand-light transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
}
