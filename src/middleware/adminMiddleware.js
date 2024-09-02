const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check if the user is an admin
const adminMiddleware = async (req, res, next) => {
  // Retrieve token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak tersedia' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Token verification
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find admin based on ID from token
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id }
    });

    // Check if admin is found
    if (!admin) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    // Store admin information in the request for use in the route handler
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = adminMiddleware;
