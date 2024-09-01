const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./src/routes/authRoute');
const profileRoutes = require('./src/routes/profileRoute');
const internshipRoute = require('./src/routes/internshipRoute');
const adminRoute = require('./src/routes/adminRoute');
const exportRoute = require('./src/routes/exportRoute');

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', internshipRoute);
app.use('/api', adminRoute);
app.use('/api', exportRoute);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});