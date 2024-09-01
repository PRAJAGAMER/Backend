const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    return await prisma.user.findUnique({
      where: {
        id: userId, // Gunakan userId untuk pencarian
      },
      include: {
        Regist: true,
        Profile: true,
        University: true
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error; // Rethrow error untuk ditangani oleh controller
  }
};

exports.updateProfile = async (userId, profileData) => {
  try {
    const { ipk, semester, name_supervisor, telp_supervisor, email_supervisor, ...profileFields } = profileData;

    const updatedProfile = await prisma.profile.update({
      where: { user_id: userId },
      data: profileFields,
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