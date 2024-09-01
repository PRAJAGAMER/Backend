const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware untuk memeriksa apakah pengguna adalah admin
const adminMiddleware = async (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak tersedia' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Temukan admin berdasarkan ID dari token
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id }
    });

    // Periksa apakah admin ditemukan
    if (!admin) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    // Simpan informasi admin di request untuk digunakan di route handler
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = adminMiddleware;
