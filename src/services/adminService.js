const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

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

// const getAllUsers = async () => {
//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         name: true,
//         email: true,
//         status: true,
//         createdAt: true,
//         Profile: {
//           select: {
//             telp_user: true,
//             nik: true,
//             photo: true, 
//           },
//         },
//         Regist: {
//           select: {
//             cv: true, 
//             score_list: true, 
//           },
//         },
//         University: {
//           select: {
//             univ_name: true,
//             major: true,
//             nim: true,
//           },
//         },
//       },
//     });
//     return users;
//   } catch (error) {
//     throw new Error('Error retrieving all user data');
//   }
// };

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: {
          in: ['Pending', 'Verifying', 'NotVerifying'],
        },
      },
      select: {
        name: true,
        email: true,
        status: true,
        createdAt: true,
        Profile: {
          select: {
            telp_user: true,
            nik: true,
            photo: true, 
          },
        },
        Regist: {
          select: {
            cv: true, 
            score_list: true, 
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
    throw new Error('Error retrieving all user data');
  }
};

// replace user status
const updateUserStatus = async (userId, status) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: status }, // pastikan `status` sesuai dengan enum
    });
    return updatedUser;
  } catch (error) {
    console.error('Error in updateUserStatus:', error); // Tambahkan log untuk debugging
    throw new Error('Error when changing user status');
  }
};

// const getAllUsers2 = async () => {
//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         name: true,
//         email: true,
//         status: true, 
//         Profile: {
//           select: {
//             telp_user: true,
//             nik: true,
//           },
//         },
//         University: {
//           select: {
//             univ_name: true,
//             major: true,
//             nim: true,
//           },
//         },
//         Regist: {
//           select: {
//             cv: true,
//             portofolio: true,
//             recommend_letter: true, 
//             available_space: true,
//             first_period: true,
//             last_period: true,
//             updateAt: true,  
//           },
//         },
//       },
//     });
//     return users;
//   } catch (error) {
//     throw new Error('Error retrieving all user datar');
//   }
// };

const getAllUsers2 = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: {
          in: ['Verifying', 'Accepted', 'Rejected'],
        },
      },
      select: {
        name: true,
        email: true,
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
            updateAt: true,  
          },
        },
      },
    });
    return users;
  } catch (error) {
    throw new Error('Error retrieving all user data');
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
    throw new Error('Error getting the user phone number');
  }
};

// Count the total number of registrants
const countAllApplicants = async () => {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    throw new Error('Error when calculating the number of registrants');
  }
};

// Count the number of verifying applicants (Rejected)
const countVerifyingApplicants = async () => {
  try {
    const count = await prisma.user.count({
      where: { status: Role.Verifying }, 
    });
    return count;
  } catch (error) {
    console.error('Detail Error:', error.message);
    throw new Error('Error when calculating the number of verifying applicants');
  }
};

// Count the number of not verifying applicants (Rejected)
const countNotVerifyingApplicants = async () => {
  try {
    const count = await prisma.user.count({
      where: { status: Role.NotVerifying }, 
    });
    return count;
  } catch (error) {
    console.error('Detail Error:', error.message);
    throw new Error('Error when calculating the number of verifying applicants');
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
    throw new Error('Error when calculating the number of accepted applicants');
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
    throw new Error('Error when calculating the number of rejected applicants');
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

const getBannerUrlByNameBanner = async (nameBanner) => {
  try {
    const vacancy = await prisma.vacancies.findFirst({
      where: { name_banner: nameBanner },
      select: { banner: true },
    });

    if (!vacancy) {
      throw new Error('Banner not found');
    }

    return vacancy.banner;
  } catch (error) {
    throw new Error('Error retrieving banner URL');
  }
};

const updateBannerUrlByNameBanner = async (nameBanner, newBannerUrl) => {
  try {
    const previousBannerUrl = await getBannerUrlByNameBanner(nameBanner);

    const updatedVacancy = await prisma.vacancies.updateMany({
      where: { name_banner: nameBanner },
      data: { banner: newBannerUrl },
    });

    if (previousBannerUrl && fs.existsSync(previousBannerUrl)) {
      fs.unlink(previousBannerUrl, (unlinkError) => {
        if (unlinkError) {
          console.error('Failed to delete old file:', unlinkError);
        }
      });
    }

    return { updatedVacancy, previousBannerUrl };
  } catch (error) {
    console.error('Error in updateBannerUrlByNameBanner:', error);
    throw new Error('Error updating banner URL');
  }
};

const getBannerByNameBanner = async (nameBanner) => {
  try {
    console.log('Querying for nameBanner:', nameBanner); // Debug log

    // Use findFirst if name_banner is not unique
    const vacancy = await prisma.vacancies.findFirst({
      where: { name_banner: nameBanner },
      select: {
        banner: true,
      },
    });

    if (!vacancy) {
      throw new Error('Banner not found');
    }

    return vacancy.banner;
  } catch (error) {
    console.error('Error in getBannerByNameBanner service:', error); // Debug log
    throw new Error('Error retrieving banner');
  }
};

const getUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true, // mengambil status untuk pengecekan
      },
    });
    return user;
  } catch (error) {
    throw new Error('Error retrieving user by ID');
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
  countVerifyingApplicants,
  countNotVerifyingApplicants,
  countAcceptedApplicants,
  countRejectedApplicants,
  getApplicantsList,
  updateBannerUrlByNameBanner,
  getBannerByNameBanner,
  getUserById,
};