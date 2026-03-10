const jwt = require("jsonwebtoken");
const { securityLog } = require("./securityLogger");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Error de configuración del servidor" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    securityLog("INVALID_TOKEN", { path: req.path });
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};

module.exports = authenticateToken;
