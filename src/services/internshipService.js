const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

exports.getInternshipForm = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Profile: true,
        University: true,
        Regist: true, // Menambahkan relasi ke tabel `Regist` jika diperlukan
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Data yang akan otomatis terisi
    return {
      name: user.name,
      nim: user.University?.nim,
      nik: user.Profile?.nik,
      email: user.email,
      telp: user.Profile?.telp_user,
      univ_name: user.University?.univ_name,
      major: user.University?.major,
      cv: user.Regist?.cv,
      portofolio: user.Regist?.portofolio,
    };
  } catch (error) {
    console.error('Error fetching internship form:', error);
    throw new Error('Failed to fetch internship form data');
  }
};

// Fungsi untuk mengajukan lamaran magang
function deleteFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

exports.applyForInternship = async ({
  userId,
  available_space,
  first_period,
  last_period,
  recommend_letter,
  portofolio,
  cv
}) => {
  try {
    // Mendapatkan data lamaran magang sebelumnya
    const previousData = await prisma.regist.findUnique({
      where: { user_id: userId },
      select: {
        recommend_letter: true,
        portofolio: true,
        cv: true
      }
    });

    // Hapus file lama jika ada file baru yang diunggah
    if (recommend_letter && previousData.recommend_letter !== recommend_letter) {
      deleteFile(previousData.recommend_letter);
    }
    if (portofolio && previousData.portofolio !== portofolio) {
      deleteFile(previousData.portofolio);
    }
    if (cv && previousData.cv !== cv) {
      deleteFile(previousData.cv);
    }

    // Update data lamaran magang
    return await prisma.regist.update({
      where: { user_id: userId },
      data: {
        available_space: Boolean(available_space),
        first_period: new Date(first_period),
        last_period: new Date(last_period),
        recommend_letter,
        portofolio,
        cv
      }
    });
  } catch (error) {
    console.error('Error applying for internship:', error);
    throw new Error(`Error applying for internship: ${error.message}`);
  }
};