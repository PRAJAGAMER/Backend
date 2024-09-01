const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Tentukan folder penyimpanan
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Tentukan nama file
  },
});

// Filter file berdasarkan tipe file
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|doc|docx|jpg|jpeg|png/; // Hanya menerima PDF, DOC, DOCX, JPG, JPEG, dan PNG
  const mimetype = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only .pdf, .doc, .docx, .jpg, .jpeg, .png formats allowed!'));
};

// Inisialisasi `multer` dengan konfigurasi
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
