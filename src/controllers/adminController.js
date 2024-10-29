const adminService = require('../services/adminService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Handler to retrieve all admin data
const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handler to delete admin by id
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await adminService.deleteAdmin(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handler to retrieve all user data
const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handler to retrieve all user data 2
const getAllUsers2 = async (req, res) => {
  try {
    const users = await adminService.getAllUsers2();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  if (!['Verifying', 'NotVerifying'].includes(status)) {
    return res.status(400).json({ error: 'Status yang diberikan tidak valid. Hanya dapat mengubah ke Verifying atau NotVerifying.' });
  }

  try {
    const user = await adminService.getUserById(userId);
    if (!user || user.status !== 'Pending') {
      return res.status(400).json({ error: 'Status awal harus Pending untuk dapat diubah ke Verifying atau NotVerifying.' });
    }

    const updatedUser = await adminService.updateUserStatus(userId, status);

    if (status === 'Verifying') {
      const phoneNumber = await adminService.getUserPhoneNumber(userId);
      const message = 'Selamat+Pendaftaran+akun+kamu+diterima+silahkan+login+dan+lakukan+pendaftaran+magang';
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
      
      return res.redirect(whatsappUrl);
    } 

    if (status === 'NotVerifying') {
      const phoneNumber = await adminService.getUserPhoneNumber(userId);
      const message = 'Maaf+Pendaftaran+akun+anda+tidak+dapat+diverifikasi+untuk+magang';
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

  if (!['Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status yang diberikan tidak valid. Hanya dapat mengubah ke Accepted atau Rejected.' });
  }

  try {
    const user = await adminService.getUserById(userId);
    if (!user || user.status !== 'Verifying') {
      return res.status(400).json({ error: 'Status awal harus Verifying untuk dapat diubah ke Accepted atau Rejected.' });
    }

    const updatedUser = await adminService.updateUserStatus(userId, status);

    if (status === 'Accepted') {
      const phoneNumber = await adminService.getUserPhoneNumber(userId);
      const message = 'Halo+setelah+melalui+proses+seleksi+administrasi+kamu+diterima+magang+di+DISDUKCAPIL+Kota+Semarang+,+untuk+informasi+selajutnya+silahkan+masuk+ke+grup+WhatsApp+berikut+link+grupnya';
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
      
      return res.redirect(whatsappUrl);
    }

    if (status === 'Rejected') {
      const phoneNumber = await adminService.getUserPhoneNumber(userId);
      const message = 'Halo,+kami+dengan+berat+hati+memberitahukan+bahwa+proses+lamaran+magang+Anda+tidak+dapat+kami+terima.+Terima+kasih+telah+mendaftar+dan+tetap+semangat!';
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;

      return res.redirect(whatsappUrl);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the total number of applicants, accepted applicants, and rejected applicants, and retrieve all applicant data
const getApplicantsData = async (req, res) => {
  try {
    const [totalApplicants, verifyingApplicants, acceptedApplicants, rejectedApplicants, applicantsList] = await Promise.all([
      adminService.countAllApplicants(),
      adminService.countVerifyingApplicants(),
      adminService.countAcceptedApplicants(),
      adminService.countRejectedApplicants(),
      adminService.getApplicantsList()
    ]);

    res.status(200).json({ 
      totalApplicants,
      verifyingApplicants,
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
    cb(null, path.join(__dirname, '../uploads/assets')); // File Storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save files with unique names
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

// Multer Configuration
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter, 
});

const updateBannerByNameBanner = async (req, res) => {
  upload.single('banner')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newBannerFilePath = req.file.path;
    const nameBanner = 'lowongan';

    try {
      const { updatedVacancy } = await adminService.updateBannerUrlByNameBanner(nameBanner, newBannerFilePath);

      if (updatedVacancy.count === 0) {
        return res.status(404).json({ message: `No vacancies found with name_banner = ${nameBanner}` });
      }

      return res.status(200).json({ message: 'Banner updated successfully', updatedVacancy });
    } catch (error) {
      console.error('Error updating banner:', error);

      // Rollback: Remove the newly uploaded file if an error occurs
      fs.unlink(newBannerFilePath, (unlinkError) => {
        if (unlinkError) {
          console.error('Failed to delete new file:', unlinkError);
        }
      });

      return res.status(500).json({ message: error.message });
    }
  });
};

const getBannerByNameBanner = async (req, res) => {
  const { nameBanner } = req.query;

  console.log('Received nameBanner:', nameBanner); // Debug log

  if (!nameBanner) {
    return res.status(400).json({ message: 'nameBanner query parameter is required' });
  }

  try {
    const bannerPath = await adminService.getBannerByNameBanner(nameBanner);

    if (!bannerPath) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.sendFile(path.resolve(bannerPath));  
  } catch (error) {
    console.error('Error in getBannerByNameBanner:', error); // Debug log
    res.status(500).json({ message: 'Error retrieving banner' });
  }
};

module.exports = {
  getAllAdmins,
  deleteAdmin,
  getAllUsers,
  updateUserStatus,
  getAllUsers2,
  updateUserStatus2,
  getApplicantsData,
  updateBannerByNameBanner,
  getBannerByNameBanner,
};