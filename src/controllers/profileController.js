const profileService = require('../services/profileService');

const getProfile = async (req, res) => {
  const userId = req.user.id;  // Ambil userId dari JWT yang terverifikasi
  try {
    const user = await profileService.getProfile(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      photo: user.Profile?.photo,
      name: user.name,
      email: user.email,
      telp: user.Profile?.telp_user,
      nim: user.University?.nim,
      nik: user.Profile?.nik,
      university: user.University?.univ_name,
      major: user.University?.major,
      ipk: user.University?.ipk || null,
      semester: user.University?.semester || null,
      place_birth: user.Profile?.place_birth || null,
      birth_date: user.Profile?.birth_date || null,
      province_domicile: user.Profile?.province_domicile || null,
      city_domicile: user.Profile?.city_domicile || null,
      address_domicile: user.Profile?.address_domicile || null,
      province_ktp: user.Profile?.province_ktp || null,
      city_ktp: user.Profile?.city_ktp || null,
      address_ktp: user.Profile?.address_ktp || null,
      name_supervisor: user.University?.name_supervisor || null,
      telp_supervisor: user.University?.telp_supervisor || null,
      email_supervisor: user.University?.email_supervisor || null,
    });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;  // Ambil userId dari JWT
  const profileData = req.body;  // Ambil semua data dari body request

  try {
    const result = await profileService.updateProfile(userId, profileData);
    res.json({ message: 'Profile updated successfully', result });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};