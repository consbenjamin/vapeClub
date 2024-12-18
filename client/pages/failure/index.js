// pages/failure.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Failure = () => {
  const router = useRouter();

  useEffect(() => {
    // Obtener parámetros de la URL
    const { payment_id } = router.query;

    if (payment_id) {
      console.log('El pago falló con ID:', payment_id);
    }
  }, [router.query]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-red-600">Pago Fallido</h1>
        <p className="mt-4 text-lg text-gray-700">El pago no fue completado. Por favor, intenta de nuevo.</p>
      </div>
    </div>
  );
};

export default Failure;
