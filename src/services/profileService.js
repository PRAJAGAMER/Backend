const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

exports.getProfile = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    return await prisma.user.findUnique({
      where: {
        id: userId, 
      },
      include: {
        Regist: true,
        Profile: true,
        University: true
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error; 
  }
};

// exports.updateProfile = async (userId, profileData) => {
//   try {
//     const { ipk, semester, name_supervisor, telp_supervisor, email_supervisor, ...profileFields } = profileData;

//     const updatedProfile = await prisma.profile.update({
//       where: { user_id: userId },
//       data: profileFields,
//     });

//     const updatedUniversity = await prisma.university.update({
//       where: { user_id: userId },
//       data: {
//         ...(ipk && { ipk: parseFloat(ipk) }),
//         ...(semester && { semester: semester.toString() }),
//         ...(name_supervisor && { name_supervisor }),
//         ...(telp_supervisor && { telp_supervisor }),
//         ...(email_supervisor && { email_supervisor }),
//       },
//     });

//     return { updatedProfile, updatedUniversity };
//   } catch (error) {
//     console.error('Error updating profile or university:', error);
//     throw new Error(`Failed to update profile or university: ${error.message}`);
//   }
// };

const deleteFile = (filePath) => {
  try {
    console.log(`Trying to delete file at path: ${filePath}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Hapus file
      console.log('File deleted successfully');
    } else {
      console.log('File does not exist');
    }
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};

exports.updateProfile = async (userId, profileData) => {
  try {
    const { ipk, semester, name_supervisor, telp_supervisor, email_supervisor, telp_user, photo, ...profileFields } = profileData;

    // Ambil profile lama dari database
    const currentProfile = await prisma.profile.findUnique({
      where: { user_id: userId },
    });

    if (currentProfile && currentProfile.photo && photo && currentProfile.photo !== photo) {
      // Tentukan path file lama
      const oldPhotoPath = path.join(__dirname, '..', 'uploads', 'photo', path.basename(currentProfile.photo));
      console.log(`Old photo path: ${oldPhotoPath}`);
      deleteFile(oldPhotoPath);
    }

    // Perbarui data profile
    const updatedProfile = await prisma.profile.update({
      where: { user_id: userId },
      data: {
        ...profileFields,
        ...(telp_user && { telp_user }),  // Perbarui nomor telepon jika ada
        ...(photo && { photo })  // Perbarui path foto jika ada
      },
    });

    // Perbarui data universitas
    const updatedUniversity = await prisma.university.update({
      where: { user_id: userId },
      data: {
        ...(ipk && { ipk: parseFloat(ipk) }),
        ...(semester && { semester: semester.toString() }),
        ...(name_supervisor && { name_supervisor }),
        ...(telp_supervisor && { telp_supervisor }),
        ...(email_supervisor && { email_supervisor }),
      },
    });

    return { updatedProfile, updatedUniversity };
  } catch (error) {
    console.error('Error updating profile or university:', error);
    throw new Error(`Failed to update profile or university: ${error.message}`);
  }
};