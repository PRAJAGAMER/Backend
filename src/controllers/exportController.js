// controllers/exportController.js
const { exportDataToExcel } = require('../services/exportService');

const exportToExcel = async (req, res) => {
  try {
    const buffer = await exportDataToExcel();

    // Set the appropriate headers for download
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="users_data.xlsx"'
    );
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the buffer as a response
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to export data to Excel', error });
  }
};

module.exports = { exportToExcel };