// pages/pending.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Pending = () => {
  const router = useRouter();

  useEffect(() => {
    // Obtener parámetros de la URL
    const { payment_id } = router.query;

    if (payment_id) {
      console.log('El pago está pendiente con ID:', payment_id);
    }
  }, [router.query]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-50">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-yellow-600">Pago Pendiente</h1>
        <p className="mt-4 text-lg text-gray-700">Tu pago está pendiente. Te notificaremos cuando se complete.</p>
      </div>
    </div>
  );
};

export default Pending;
