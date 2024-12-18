import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Success = () => {
  const router = useRouter();

  useEffect(() => {
    // Obtener parámetros de la URL
    const { payment_id} = router.query;

    // Llamada a tu backend para verificar el estado del pago (opcional)
    if (payment_id) {
      console.log('Pago aprobado con ID:', payment_id);
      // Lógica para verificar el pago o mostrar detalles adicionales
    }
  }, [router.query]);

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-green-600">¡Pago Aprobado!</h1>
        <p className="mt-4 text-lg text-gray-700">Gracias por tu compra. El pago ha sido aprobado exitosamente.</p>
        <button
          onClick={goToHome}
          className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Volver al Inicio
        </button>
      </div>
    </div> 
  );
};

export default Success;
