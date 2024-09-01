const adminService = require('../services/adminService');

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
  
};