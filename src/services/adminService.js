const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to retrieve all admin data
const getAllAdmins = async () => {
  return await prisma.admin.findMany();
};

// Function to delete admin based on admin id
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
        email: true,
        status: true,
        createdAt: true,
        Profile: {
          select: {
            telp_user: true,
            nik: true,
          },
        },
        University: {
          select: {
            univ_name: true,
            major: true,
            nim: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    throw new Error('Error saat mengambil data semua user');
  }
};

// replace user status
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
        status: true, 
        Profile: {
          select: {
            telp_user: true,
            nik: true,
          },
        },
        University: {
          select: {
            univ_name: true,
            major: true,
            nim: true,
          },
        },
        Regist: {
          select: {
            cv: true,
            portofolio: true,
            recommend_letter: true, 
            available_space: true,
            first_period: true,
            last_period: true,
            updateAt: true,  // Mengambil tanggal update applyForInternship
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

// Count the total number of registrants
const countAllApplicants = async () => {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    throw new Error('Error saat menghitung jumlah pendaftar');
  }
};

// Count the number of accepted applicants (Accepted)
const countAcceptedApplicants = async () => {
  try {
    const count = await prisma.user.count({
      where: { status: Role.Accepted }, 
    });
    return count;
  } catch (error) {
    console.error('Detail Error:', error.message);
    throw new Error('Error saat menghitung jumlah pendaftar yang diterima');
  }
};

// Count the number of rejected applicants (Rejected)
const countRejectedApplicants = async () => {
  try {
    const count = await prisma.user.count({
      where: { status: Role.Rejected }, 
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
          name: true,          
          status: true,        
          createdAt: true,     
          University: {
            select: {
              univ_name: true, 
            }
          }
        }
      }
    }
  });
};

// Service to update banner URL based on name_banner
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
  getUserPhoneNumber,
  countAllApplicants,
  countAcceptedApplicants,
  countRejectedApplicants,
  getApplicantsList,
  updateBannerUrlByNameBanner,
};