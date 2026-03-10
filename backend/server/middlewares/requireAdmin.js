/**
 * OWASP A01 - Control de acceso: solo usuarios con role 'admin' pueden continuar.
 * Debe usarse después de authenticateToken para que req.user exista.
 */
const { securityLog } = require("./securityLogger");

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  if (req.user.role !== "admin") {
    securityLog("ACCESS_DENIED", { userId: req.user.id, path: req.path, method: req.method });
    return res.status(403).json({ error: "Acceso denegado: se requiere rol de administrador" });
  }
  next();
};

module.exports = requireAdmin;
