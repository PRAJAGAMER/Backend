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

const deleteFile = (filePath) => {
  try {
    console.log(`Trying to delete file at path: ${filePath}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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

    const currentProfile = await prisma.profile.findUnique({
      where: { user_id: userId },
    });

    if (currentProfile && currentProfile.photo && photo && currentProfile.photo !== photo) {
      const oldPhotoPath = path.join(__dirname, '..', 'uploads', 'photo', path.basename(currentProfile.photo));
      console.log(`Old photo path: ${oldPhotoPath}`);
      deleteFile(oldPhotoPath);
    }

    const updatedProfile = await prisma.profile.update({
      where: { user_id: userId },
      data: {
        ...profileFields,
        ...(telp_user && { telp_user }),  
        ...(photo && { photo })  
      },
    });

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