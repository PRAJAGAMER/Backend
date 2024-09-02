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

// Handler to update user status [verifying]
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

// Handler to update user status [Accepted]
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

// Get the total number of applicants, accepted applicants, and rejected applicants, and retrieve all applicant data
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
      return res.status(500).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const bannerFilePath = req.file.path; 

    const nameBanner = 'lowongan'; 

    try {
      const updatedVacancy = await adminService.updateBannerUrlByNameBanner(nameBanner, bannerFilePath);
      
      if (updatedVacancy.count === 0) {
        return res.status(404).json({ message: `No vacancies found with name_banner = ${nameBanner}` });
      }

      return res.status(200).json({ message: 'Banner updated successfully', updatedVacancy });
    } catch (error) {
      fs.unlink(bannerFilePath, (unlinkError) => {
        if (unlinkError) console.error('Failed to delete file:', unlinkError);
      });

      return res.status(500).json({ message: error.message });
    }
  });
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
};