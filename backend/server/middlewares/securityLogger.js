/**
 * OWASP A09 - Registro de eventos de seguridad (fallos de auth, accesos denegados).
 * En producción conectar a SIEM o servicio de logging.
 */
const securityLog = (event, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...meta,
  };
  if (process.env.NODE_ENV !== "test") {
    console.warn("[SECURITY]", JSON.stringify(entry));
  }
};

module.exports = { securityLog };
