const { PrismaClient } = require('@prisma/client');
const ExcelJS = require('exceljs');

const prisma = new PrismaClient();

const exportDataToExcel = async () => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users Data');

  // Define columns for the worksheet
  worksheet.columns = [
    { header: 'User ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Created At', key: 'createdAt', width: 20 },
    { header: 'Updated At', key: 'updatedAt', width: 20 },
    { header: 'CV', key: 'cv', width: 30 },
    { header: 'Recommend Letter', key: 'recommend_letter', width: 30 },
    { header: 'Score List', key: 'score_list', width: 30 },
    { header: 'Telp User', key: 'telp_user', width: 15 },
    { header: 'NIK', key: 'nik', width: 20 },
    { header: 'University', key: 'univ_name', width: 30 },
    { header: 'NIM', key: 'nim', width: 20 },
    { header: 'Major', key: 'major', width: 20 },
    { header: 'IPK', key: 'ipk', width: 10 },
    { header: 'Semester', key: 'semester', width: 10 },
  ];

  // Fetch data from database
  const users = await prisma.user.findMany({
    include: {
      Regist: true,
      Profile: true,
      University: true,
    },
  });

  // Add data to the worksheet
  users.forEach((user) => {
    worksheet.addRow({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updateAt,
      cv: user.Regist?.cv,
      recommend_letter: user.Regist?.recommend_letter,
      score_list: user.Regist?.score_list,
      telp_user: user.Profile?.telp_user,
      nik: user.Profile?.nik,
      univ_name: user.University?.univ_name,
      nim: user.University?.nim,
      major: user.University?.major,
      ipk: user.University?.ipk,
      semester: user.University?.semester,
    });
  });

  // Write the data to a buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = { exportDataToExcel };
