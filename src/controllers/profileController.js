const multer = require('multer');
const path = require('path');
const profileService = require('../services/profileService');

const getProfile = async (req, res) => {
  const userId = req.user.id;  // Retrieve the userId of the verified JWT
  try {
    const user = await profileService.getProfile(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      photo: user.Profile?.photo,
      name: user.name,
      email: user.email,
      telp: user.Profile?.telp_user,
      nim: user.University?.nim,
      nik: user.Profile?.nik,
      university: user.University?.univ_name,
      major: user.University?.major,
      ipk: user.University?.ipk || null,
      semester: user.University?.semester || null,
      place_birth: user.Profile?.place_birth || null,
      birth_date: user.Profile?.birth_date || null,
      province_domicile: user.Profile?.province_domicile || null,
      city_domicile: user.Profile?.city_domicile || null,
      address_domicile: user.Profile?.address_domicile || null,
      province_ktp: user.Profile?.province_ktp || null,
      city_ktp: user.Profile?.city_ktp || null,
      address_ktp: user.Profile?.address_ktp || null,
      name_supervisor: user.University?.name_supervisor || null,
      telp_supervisor: user.University?.telp_supervisor || null,
      email_supervisor: user.University?.email_supervisor || null,
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Internal server error' });
  }
};

// const updateProfile = async (req, res) => {
//   const userId = req.user.id;  // Get userId from JWT
//   const profileData = req.body;  // Retrieve all data from the request body

//   try {
//     const result = await profileService.updateProfile(userId, profileData);
//     res.json({ message: 'Profile updated successfully', result });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ error: 'Internal server error', details: error.message });
//   }
// };

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/photo/');  // Folder tempat menyimpan file gambar
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);  // Format nama file
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpg, jpeg, png) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Membatasi ukuran file maksimal 5MB
  }
}).single('photo');  // Hanya satu file, yaitu photo

const updateProfile = async (req, res) => {
  // Gunakan multer untuk menangani upload file
  upload(req, res, async (err) => {
    if (err) {
      // Cek jenis error
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 5MB limit!' });
      }
      return res.status(400).json({ error: err.message });
    }

    const userId = req.user.id;  // Ambil userId dari JWT
    const profileData = req.body;  // Ambil data lain dari body request

    // Jika ada file yang diunggah, tambahkan path ke profileData
    if (req.file) {
      profileData.photo = req.file.path;  // Path file yang diunggah
    }

    try {
      // Panggil service untuk memperbarui profile
      const result = await profileService.updateProfile(userId, profileData);
      res.json({ message: 'Profile updated successfully', result });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
};

module.exports = {
  getProfile,
  updateProfile,
};