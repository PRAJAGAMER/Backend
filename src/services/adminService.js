const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();

// Menampilkan semua user
// const getAllUsers = async () => {
//   try {
//     const users = await prisma.user.findMany();
//     return users;
//   } catch (error) {
//     throw new Error('Error saat mengambil data semua user');
//   }
// };

// Fungsi untuk mengambil semua data admin
const getAllAdmins = async () => {
  return await prisma.admin.findMany();
};

// Fungsi untuk menghapus admin berdasarkan admin_id
const deleteAdmin = async (id) => {
  return await prisma.admin.delete({
    where: {
      id: parseInt(id), 
    },
  });
};

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        Profile: {
          select: {
            photo: true,
          },
        },
        University: {
          select: {
            univ_name: true,
            nim: true,
          },
        },
        Regist: {
          select: {
            cv: true,
            portofolio: true,
            score_list: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    throw new Error('Error saat mengambil data semua user');
  }
};

// Mengubah status user
const updateUserStatus = async (userId, status) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: status },
    });
    return updatedUser;
  } catch (error) {
    throw new Error('Error saat mengubah status user');
  }
};

const getAllUsers2 = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        status: true, // Menampilkan status
        Profile: {
          select: {
            photo: true,
          },
        },
        University: {
          select: {
            univ_name: true,
            nim: true,
          },
        },
        Regist: {
          select: {
            cv: true,
            portofolio: true,
            score_list: true,
            recommend_letter: true, // Menampilkan surat rekomendasi
          },
        },
      },
    });
    return users;
  } catch (error) {
    throw new Error('Error saat mengambil data semua user');
  }
};

const getUserPhoneNumber = async (userId) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { user_id: userId },
      select: { telp_user: true },
    });
    return profile ? profile.telp_user : null;
  } catch (error) {
    throw new Error('Error saat mendapatkan nomor telepon user');
  }
};


// Menghitung jumlah pendaftar secara keseluruhan
const countAllApplicants = async () => {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    throw new Error('Error saat menghitung jumlah pendaftar');
  }
};

// Menghitung jumlah pendaftar yang diterima (Accepted)
const countAcceptedApplicants = async () => {
  try {
    const count = await prisma.user.count({
      where: { status: Role.Accepted }, // Menggunakan enum Role.Accepted
    });
    return count;
  } catch (error) {
    console.error('Detail Error:', error.message);
    throw new Error('Error saat menghitung jumlah pendaftar yang diterima');
  }
};

// Menghitung jumlah pendaftar yang ditolak (Rejected)
const countRejectedApplicants = async () => {
  try {
    const count = await prisma.user.count({
      where: { status: Role.Rejected }, // Menggunakan enum Role.Rejected
    });
    return count;
  } catch (error) {
    console.error('Detail Error:', error.message);
    throw new Error('Error saat menghitung jumlah pendaftar yang ditolak');
  }
};

const getApplicantsList = async () => {
  return await prisma.regist.findMany({
    include: {
      user: {
        select: {
          name: true,          // Mengambil nama dari model User
          status: true,        // Mengambil status dari model User
          createdAt: true,     // Tanggal pendaftaran dari model User
          University: {
            select: {
              univ_name: true, // Mengambil nama universitas dari model University
            }
          }
        }
      }
    }
  });
};

// Service untuk update banner URL berdasarkan name_banner
const updateBannerUrlByNameBanner = async (nameBanner, newBannerUrl) => {
  try {
    const updatedVacancy = await prisma.vacancies.updateMany({
      where: { name_banner: nameBanner },
      data: { banner: newBannerUrl },
    });
    return updatedVacancy;
  } catch (error) {
    throw new Error('Error updating banner URL');
  }
};


module.exports = {
  getAllAdmins,
  deleteAdmin,
  getAllUsers,
  getAllUsers2,
  updateUserStatus,
  countAllApplicants,
  countAcceptedApplicants,
  countRejectedApplicants,
  getApplicantsList,
  getUserPhoneNumber,
  updateBannerUrlByNameBanner,
};