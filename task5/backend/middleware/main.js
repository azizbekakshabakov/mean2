const jwt = require('jsonwebtoken');
const crypto = require('crypto');

authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).json({ message: "нету токена" });
  try {
    const decoded = jwt.verify(token, "qwerty");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ message: "неверный токен" });
  }
};

createdTimeMiddleware = (req, res, next) => {
  const date = new Date().toLocaleDateString('kz-KZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  console.log(date);
  if (req.body) {
    try {
      req.body['created_at'] = date;
    } catch (error) {
      console.log(error);
      return res.status(500).send('Encryption failed');
    }
  }

  next();
};

encryptMiddleware = (req, res, next) => {
  const encryptionKey = crypto.scryptSync('mySecretEncryptionKey', 'salt', 32);
  const iv = Buffer.from('1234567890123456', 'utf8');
  if (req.body && Object.keys(req.body).length > 0) {
    try {
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
      let encryptedData = cipher.update(JSON.stringify(req.body["description"]), 'utf8', 'hex');
      encryptedData += cipher.final('hex');
      req.body['description'] = encryptedData;
    } catch (error) {
      console.log(error);
      return res.status(500).send('Encryption failed');
    }
  }
  next();
};

module.exports = { authMiddleware, createdTimeMiddleware, encryptMiddleware };