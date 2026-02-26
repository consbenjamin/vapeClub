const express = require("express");
const { MercadoPagoConfig, Preference } = require('mercadopago');
const router = express.Router();

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN?.trim();

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN,
});

// Ruta de diagnóstico: verificar que el token esté cargado (sin exponer el valor completo)
router.get('/status', (req, res) => {
  const set = !!MP_ACCESS_TOKEN;
  const prefix = set ? MP_ACCESS_TOKEN.slice(0, 12) + '...' + MP_ACCESS_TOKEN.slice(-4) : null;
  res.json({
    ok: set,
    mpTokenSet: set,
    mpTokenPrefix: prefix,
    hint: set && MP_ACCESS_TOKEN.includes('TEST') ? 'Estás usando token de PRUEBAS. Para producción usa el Access Token de la pestaña Producción.' : (set ? 'Token cargado (revisa que sea el de Producción en el panel MP).' : 'MP_ACCESS_TOKEN no está definido.'),
  });
});

// Ruta para crear una preferencia de pago
router.post('/create_preference', async (req, res) => {
  try {
    if (!MP_ACCESS_TOKEN) {
      return res.status(500).json({
        error: 'No se pudo crear la preferencia de pago',
        details: 'MP_ACCESS_TOKEN no está configurado en el servidor.',
      });
    }

    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ 
        error: 'No se recibieron productos en el carrito' 
      });
    }

    const items = cart.map(item => ({
      id: String(item._id).slice(0, 256),
      title: String(item.nombre || 'Producto').slice(0, 256), 
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1), 
      unit_price: Number(item.precio),
      currency_id: 'ARS'
    }));

    const total = items.reduce((acc, item) => 
      acc + (item.quantity * item.unit_price), 0);

    const frontendUrl = process.env.FRONTEND_URL || '';
    const body = {
      items,
      back_urls: frontendUrl ? {
        success: `${frontendUrl}/success`,
        failure: `${frontendUrl}/failure`,
        pending: `${frontendUrl}/pending`
      } : undefined,
      external_reference: `cart_${Date.now()}`,
    };
    // Evitar enviar payment_methods/installments si tu cuenta no tiene esa política habilitada
    // Descomenta el bloque siguiente si MP te pide más opciones:
    // body.auto_return = 'approved';
    // body.payment_methods = { excluded_payment_methods: [], excluded_payment_types: [], installments: 3 };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
      init_point: result.init_point,
      total: total
    });
  } catch (error) {
    const mpError = error.response?.data;
    console.error('Error al crear la preferencia:', mpError || error.message, error);
    const message = mpError?.message || (Array.isArray(mpError?.cause) ? mpError.cause.map(c => c.description).join('; ') : null) || error.message;
    res.status(500).json({
      error: 'No se pudo crear la preferencia de pago',
      details: message,
      mpError: mpError
    });
  }
});



module.exports = router;