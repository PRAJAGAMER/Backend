const authService = require('../services/authService');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
/*
exports.registerUser = async (req, res) => {
  const { name, nim, nik, password, email, telp, universitas, major, photo, cv, score_list } = req.body;

  try {
    const user = await authService.registerUser({
      name, nim, nik, password, email, telp, universitas, major, photo, cv, score_list
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/// Konfigurasi penyimpanan Multer
// Konfigurasi penyimpanan Multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder tujuan berdasarkan jenis file
    let uploadPath = '';
    switch (file.fieldname) {
      case 'photo':
        uploadPath = path.join(__dirname, '../uploads/photo');
        break;
      case 'cv':
        uploadPath = path.join(__dirname, '../uploads/cv');
        break;
      case 'score_list':
        uploadPath = path.join(__dirname, '../uploads/score_list');
        break;
      default:
        uploadPath = path.join(__dirname, '../uploads');
    }
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Inisialisasi Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file 5MB
});

// Middleware upload untuk file
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'score_list', maxCount: 1 },
]);

// Controller untuk registrasi user
exports.registerUser = (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Log untuk debugging
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    // Deklarasi variabel file
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const cvFile = req.files['cv'] ? req.files['cv'][0] : null;
    const scoreListFile = req.files['score_list'] ? req.files['score_list'][0] : null;

    // Log untuk memeriksa file yang diupload
    console.log('photoFile:', photoFile);
    console.log('cvFile:', cvFile);
    console.log('scoreListFile:', scoreListFile);

    // Cek file yang kosong dan kirimkan pesan error yang sesuai
    let missingFields = [];
    if (!photoFile) missingFields.push('photo');
    if (!cvFile) missingFields.push('cv');
    if (!scoreListFile) missingFields.push('score_list');

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required files: ${missingFields.join(', ')}` });
    }

    try {
      const { name, nim, nik, password, email, telp, universitas, major } = req.body;

      const photoPath = photoFile.path;
      const cvPath = cvFile.path;
      const scoreListPath = scoreListFile.path;

      const user = await authService.registerUser({
        name, nim, nik, password, email, telp, universitas, major, photoPath, cvPath, scoreListPath
      });

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authService.loginUser(email, password);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Register untuk admin
exports.registerAdmin = async (req, res) => {
  const { admin_name, nip, telp_admin, email, password } = req.body;

  try {
    const admin = await authService.registerAdmin({ admin_name, nip, telp_admin, email, password });
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login untuk admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, admin } = await authService.loginAdmin(email, password);
    res.json({ token, admin });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};