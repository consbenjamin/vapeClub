import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Failure() {
  const router = useRouter();
  const { payment_id } = router.query;

  return (
    <>
      <Head>
        <title>Pago no completado – VapeClub</title>
        <meta name="description" content="El pago no pudo completarse." />
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-background px-4">
        <div className="text-center max-w-md bg-surface rounded-2xl shadow-lg border border-border p-6 sm:p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Pago no completado</h1>
          <p className="mt-4 text-foreground/80">
            El pago no fue completado. Podés intentar de nuevo cuando quieras.
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
