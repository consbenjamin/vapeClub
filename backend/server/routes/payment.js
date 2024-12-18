const express = require("express");
const { MercadoPagoConfig, Preference } = require('mercadopago');
const router = express.Router();

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Ruta para crear una preferencia de pago
router.post('/create_preference', async (req, res) => {
  try {
    // Recibir los productos del carrito desde el frontend
    const { cart } = req.body;

    // Validar que se reciban los items del carrito
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ 
        error: 'No se recibieron productos en el carrito' 
      });
    }

    // Transformar los items del carrito al formato de Mercado Pago
    const items = cart.map(item => ({
      id: item._id,
      title: item.nombre, 
      quantity: item.quantity, 
      unit_price: Number(item.precio), // Convertir explícitamente a número
      currency_id: 'ARS'
    }));

    // Calcular el total del carrito
    const total = items.reduce((acc, item) => 
      acc + (item.quantity * item.unit_price), 0);

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 3
        },
        items: items,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/success`,
          failure: `${process.env.FRONTEND_URL}/failure`,
          pending: `${process.env.FRONTEND_URL}/pending`
        },
        // auto_return: 'approved',
        external_reference: `cart_${Date.now()}`,
        // notification_url: `${process.env.BACKEND_URL}/webhook/mercadopago`
      }
    });

    res.json({
      id: result.id,
      init_point: result.init_point,
      total: total
    });
  } catch (error) {
    console.error('Error al crear la preferencia:', error.response ? error.response.data : error);
    res.status(500).json({ 
      error: 'No se pudo crear la preferencia de pago',
      details: error.response ? error.response.data : error.message
    });
  }
});



module.exports = router;