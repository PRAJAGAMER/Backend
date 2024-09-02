const internshipService = require('../services/internshipService');
const multer = require('multer');
const path = require('path');

exports.getInternshipForm = async (req, res) => {
  const userId = req.user.id;

  try {
    const formData = await internshipService.getInternshipForm(userId);

    res.json({ formData });
  } catch (error) {
    console.error('Error fetching internship form:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Configure file storage by file type
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'src/uploads/'; 

    switch (file.fieldname) {
      case 'cv':
        uploadPath = 'src/uploads/cv/';
        break;
      case 'recommend_letter':
        uploadPath = 'src/uploads/recommend_letter/';
        break;
      case 'portofolio':
        uploadPath = 'src/uploads/portofolio/';
        break;
      default:
        uploadPath = 'src/uploads/';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});


const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'cv' || file.fieldname === 'recommend_letter' || file.fieldname === 'portofolio') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only pdf files are allowed.'), false);
    }
  } else {
    cb(new Error('Invalid field name.'), false);
  }
};

// Multer Initialization
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: fileFilter
});

exports.applyForInternship = [
  upload.fields([
    { name: 'recommend_letter', maxCount: 1 },
    { name: 'portofolio', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
  ]),
  async (req, res) => {
    const userId = req.user.id;
    const { available_space, first_period, last_period } = req.body;

    // Retrieve files from req.files
    const recommendLetterFile = req.files['recommend_letter'] ? req.files['recommend_letter'][0] : null;
    const portofolioFile = req.files['portofolio'] ? req.files['portofolio'][0] : null;
    const cvFile = req.files['cv'] ? req.files['cv'][0] : null;

    try {
      const internship = await internshipService.applyForInternship({
        userId,
        available_space,
        first_period,
        last_period,
        recommend_letter: recommendLetterFile ? recommendLetterFile.path.replace(/\\/g, '/') : null,
        portofolio: portofolioFile ? portofolioFile.path.replace(/\\/g, '/') : null,
        cv: cvFile ? cvFile.path.replace(/\\/g, '/') : null,
      });

      res.json({ message: 'Internship application submitted successfully', internship });
    } catch (error) {
      console.error('Error applying for internship:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
];