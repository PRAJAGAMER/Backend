const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const authRoutes = require('./src/routes/authRoute');
const profileRoutes = require('./src/routes/profileRoute');
const internshipRoute = require('./src/routes/internshipRoute');
const adminRoute = require('./src/routes/adminRoute');
const exportRoute = require('./src/routes/exportRoute');
const cors = require('cors');
const corsOptions = {
  credential: true,
  origin: ['http://localhost:5173']
}

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use(cors(corsOptions));
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', internshipRoute);
app.use('/api', adminRoute);
app.use('/api', exportRoute);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});