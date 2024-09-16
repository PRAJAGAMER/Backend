const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
exports.registerUser = async ({ name, nim, nik, password, email, telp, universitas, major, photoPath, cvPath, scoreListPath }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      status: 'Pending',
      Regist: {
        create: {
          cv: cvPath,
          recommend_letter: '',
          score_list: scoreListPath,
          portofolio: '',
        },
      },
      Profile: {
        create: {
          telp_user: telp,
          nik,
          photo: photoPath,
          place_birth: '',
          birth_date: '',
          province_domicile: '',
          city_domicile: '',
          address_domicile: '',
          province_ktp: '',
          city_ktp: '',
          address_ktp: '',
        },
      },
      University: {
        create: {
          univ_name: universitas,
          nim,
          major,
          ipk: 0,
          semester: '',
          name_supervisor: '',
          telp_supervisor: '',
          email_supervisor: '',
        },
      },
    },
  });
};

exports.loginUser = async (nik, password) => {
  const user = await prisma.user.findFirst({
    where: {
      Profile: {
        nik: nik,
      }
    },
    include: {
      Profile: true,
    }
  });

  if (!user) {
    throw new Error('Invalid NIK or password');
  }

  if (user.status !== 'Verifying') {
    throw new Error('User status is not Verifying');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid NIK or password');
  }

  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

  return { token, user };
};

exports.registerAdmin = async ({ admin_name, nip, telp_admin, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.admin.create({
    data: {
      admin_name,
      nip, 
      telp_admin,
      email,
      password: hashedPassword,
    },
  });
};

exports.loginAdmin = async (nip, password) => {
  const admin = await prisma.admin.findFirst({
    where: { nip }, 
  });

  if (!admin) {
    throw new Error('Invalid NIP or password');
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error('Invalid NIP or password');
  }

  const token = jwt.sign({ id: admin.id, name: admin.admin_name }, JWT_SECRET, { expiresIn: '1h' });

  return { token, admin };
};