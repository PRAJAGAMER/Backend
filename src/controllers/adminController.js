const adminService = require('../services/adminService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Menampilkan semua user
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await adminService.getAllUsers();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Handler untuk mengambil semua data admin
const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handler untuk menghapus admin berdasarkan id
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await adminService.deleteAdmin(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers2 = async (req, res) => {
  try {
    const users = await adminService.getAllUsers2();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengubah status user
/*const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const updatedUser = await adminService.updateUserStatus(userId, status);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/
const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const updatedUser = await adminService.updateUserStatus(userId, status);

    if (status === 'Verifying') {
      const phoneNumber = await adminService.getUserPhoneNumber(userId);
      const message = 'Selamat+kamu+diterima+magang+silahkan+login';
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
      
      return res.redirect(whatsappUrl);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserStatus2 = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const updatedUser = await adminService.updateUserStatus(userId, status);

    if (status === 'Accepted') {
      const phoneNumber = await adminService.getUserPhoneNumber(userId);
      const message = 'Halo+setelah+melalui+proses+seleksi+administrasi+kamu+berhak+masuk+ke+grup+berikut+link+grupnya';
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
      
      return res.redirect(whatsappUrl);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan jumlah total pendaftar, pendaftar yang diterima, dan pendaftar yang ditolak
const getApplicantsData = async (req, res) => {
  try {
    const [totalApplicants, acceptedApplicants, rejectedApplicants, applicantsList] = await Promise.all([
      adminService.countAllApplicants(),
      adminService.countAcceptedApplicants(),
      adminService.countRejectedApplicants(),
      adminService.getApplicantsList()
    ]);

    res.status(200).json({ 
      totalApplicants,
      acceptedApplicants,
      rejectedApplicants,
      applicantsList
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/assets')); // Tempat penyimpanan file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menyimpan file dengan nama unik
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
  }
};

// Konfigurasi multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter, // Tambahkan fileFilter di sini
});

// Controller untuk update banner URL berdasarkan name_banner
/*const updateBannerByNameBanner = async (req, res) => {
  const { banner } = req.body;
  const nameBanner = 'lowongan'; // name_banner yang ingin diperbarui

  if (!banner) {
    return res.status(400).json({ message: 'Banner URL is required' });
  }

  try {
    const updatedVacancy = await adminService.updateBannerUrlByNameBanner(nameBanner, banner);
    
    if (updatedVacancy.count === 0) {
      return res.status(404).json({ message: `No vacancies found with name_banner = ${nameBanner}` });
    }

    return res.status(200).json({ message: 'Banner updated successfully', updatedVacancy });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};*/
const updateBannerByNameBanner = async (req, res) => {
  // Gunakan middleware upload untuk menangani file upload
  upload.single('banner')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const bannerFilePath = req.file.path; // Path file gambar yang diupload

    const nameBanner = 'lowongan'; // name_banner yang ingin diperbarui

    try {
      // Update URL banner di database
      const updatedVacancy = await adminService.updateBannerUrlByNameBanner(nameBanner, bannerFilePath);
      
      if (updatedVacancy.count === 0) {
        return res.status(404).json({ message: `No vacancies found with name_banner = ${nameBanner}` });
      }

      return res.status(200).json({ message: 'Banner updated successfully', updatedVacancy });
    } catch (error) {
      // Hapus file jika terjadi error
      fs.unlink(bannerFilePath, (unlinkError) => {
        if (unlinkError) console.error('Failed to delete file:', unlinkError);
      });

      return res.status(500).json({ message: error.message });
    }
  });
};


// // Mendapatkan jumlah pendaftar secara keseluruhan
// const getTotalApplicants = async (req, res) => {
//   try {
//     const totalApplicants = await adminService.countAllApplicants();
//     res.status(200).json({ totalApplicants });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Mendapatkan jumlah pendaftar yang diterima (accepted)
// const getAcceptedApplicants = async (req, res) => {
//   try {
//     const acceptedApplicants = await adminService.countAcceptedApplicants();
//     res.status(200).json({ acceptedApplicants });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Mendapatkan jumlah pendaftar yang ditolak (rejected)
// const getRejectedApplicants = async (req, res) => {
//   try {
//     const rejectedApplicants = await adminService.countRejectedApplicants();
//     res.status(200).json({ rejectedApplicants });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = {
  getAllAdmins,
  deleteAdmin,
  getAllUsers,
  updateUserStatus,
  getAllUsers2,
  updateUserStatus2,
  // getTotalApplicants,
  // getAcceptedApplicants,
  // getRejectedApplicants,
  getApplicantsData,
  updateBannerByNameBanner,
};