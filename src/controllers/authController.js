const authService = require('../services/authService');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Storage Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for photo. Only jpg and png are allowed.'), false);
    }
  } else if (file.fieldname === 'cv' || file.fieldname === 'score_list') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only pdf files are allowed.'), false);
    }
  } else {
    cb(new Error('Invalid field name.'), false);
  }
};

// Multer Initialization
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: fileFilter
});

// Middleware upload for files
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'score_list', maxCount: 1 },
]);

// Controller for user registration
exports.registerUser = (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Logs for debugging
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    // File variable declaration
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const cvFile = req.files['cv'] ? req.files['cv'][0] : null;
    const scoreListFile = req.files['score_list'] ? req.files['score_list'][0] : null;

    // Logs to check uploaded files
    console.log('photoFile:', photoFile);
    console.log('cvFile:', cvFile);
    console.log('scoreListFile:', scoreListFile);

    // Check for empty files and send an appropriate error message
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
  const { nik, password } = req.body;

  try {
    const { token, user } = await authService.loginUser(nik, password);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Register for admin
exports.registerAdmin = async (req, res) => {
  const { admin_name, nip, telp_admin, email, password } = req.body;

  try {
    const admin = await authService.registerAdmin({ admin_name, nip, telp_admin, email, password });
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { nip, password } = req.body;

  try {
    const { token, admin } = await authService.loginAdmin(nip, password);
    res.json({ token, admin });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};