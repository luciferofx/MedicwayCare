const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Environment setup
const NODE_ENV = process.env.NODE_ENV || 'development';
try {
  require('dotenv').config({ path: './.env' });
} catch (error) {
  console.warn('.env file not found, using process environment variables');
}
const JWT_SECRET = process.env.JWT_SECRET || 'yor-super-secret-jwt-key-here';
process.env.JWT_SECRET = JWT_SECRET; // Ensure it is available globally
const ATLAS_URI = process.env.ATLAS_URI || 'mongodb+srv://luciferofx:Raja9315@cluster0.0lrw669.mongodb.net/healthcare';
process.env.ATLAS_URI = ATLAS_URI;
const PORT = process.env.PORT || 6003;

// MIDDLEWARE: Remove Trailing Slashes
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS' && req.path !== '/' && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

// CORS setup
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://72.62.187.221:5173",
    "https://medicwaycare.com",
    "https://snapsta-43709.web.app",
    "https://snapsta-43709.firebaseapp.com",
    "https://v-web-frontend-flame.vercel.app",
    "https://v-web-frontend-s8pe.vercel.app",
    "https://v-web-frontend-gaci.vercel.app",
    "https://v-web-frontend-beta.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logger middleware (for debugging 404s)
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
  next();
});

const Admin = require('./models/Admin.cjs');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
  const maxRetries = 3;
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      if (!ATLAS_URI) {
        throw new Error('ATLAS_URI environment variable is not defined');
      }
      await mongoose.connect(ATLAS_URI, {
        dbName: 'healthcare',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority'
      });
      console.log('MongoDB connected successfully');

      // Admin Seeder Logic
      try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
          console.log('No admins found, creating default admin...');
          const hashedPassword = await bcrypt.hash('admin123', 12);
          await Admin.create({
            username: 'admin',
            email: 'admin@medicwaycare.com',
            password: hashedPassword,
            role: 'superadmin',
            isActive: true
          });
          console.log('Default admin seeded: admin@medicwaycare.com / admin123');
        }
      } catch (seedErr) {
        console.error('Error seeding admin:', seedErr.message);
      }

      return;
    } catch (err) {
      attempts++;
      console.error(`Mongoose connection attempt ${attempts} failed:`, err.message);
      if (attempts >= maxRetries) {
        console.error('Max retries reached. Could not connect to MongoDB.');
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

const Content = require('./models/Content.cjs');

// ============================================
// DROPDOWN ROUTES
// ============================================

// ============================================
// API V1 ROUTER
// ============================================
const v1Router = express.Router();

// Public content route (v1)
v1Router.get('/public/content/:page', async (req, res) => {
  const { page } = req.params;
  try {
    const dbContent = await Content.find({ page: page });
    if (dbContent && dbContent.length > 0) {
      const flatData = {};
      dbContent.forEach(item => {
        if (!flatData[item.section]) flatData[item.section] = {};
        flatData[item.section][item.key] = item.value;
      });
      return res.json({ success: true, data: flatData, lastUpdated: dbContent[0].updatedAt });
    }
    res.json({ success: true, data: { message: 'Content not found' } });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch content' });
  }
});

// ============================================
// MOUNT ALL API ROUTES
// ============================================

const websiteDoctorRouter = require('./routes/doctor.cjs');
const websiteHospitalRouter = require('./routes/hospitals.cjs');
const websiteContactRouter = require('./routes/contact.cjs');
const websiteBlogRouter = require('./routes/blog.cjs');

// Explicitly mount on v1Router
v1Router.use('/doctors', websiteDoctorRouter);
v1Router.use('/hospitals', websiteHospitalRouter);
v1Router.use('/contact', websiteContactRouter);
v1Router.use('/blogs', websiteBlogRouter);

// Dynamic loop for remaining routes
const otherRoutes = [
  { path: '/country', file: './route/country.route.cjs' },
  { path: '/category', file: './route/category.route.cjs' },
  { path: '/subcategory', file: './route/subcategory.route.cjs' },
  { path: '/dropdown', file: './route/dropdown.route.cjs' },
  { path: '/admin', file: './routes/admin.cjs' },
  { path: '/master-doctor', file: './route/doctor.route.cjs' },
  { path: '/master-hospital', file: './route/hospital.route.cjs' },
  { path: '/procedure-costs', file: './routes/procedureCosts.cjs' },
  { path: '/patients', file: './routes/patient.cjs' },
  { path: '/booking', file: './routes/bookings.cjs' },
  { path: '/seo', file: './routes/seo.cjs' },
  { path: '/language', file: './route/language.route.cjs' }
];

otherRoutes.forEach(route => {
  try {
    const mod = require(route.file);
    v1Router.use(route.path, mod);
    console.log(`✅ Mounted Extra: ${route.path} ← ${route.file}`);
  } catch (err) {
    console.warn(`✗ Failed Extra: ${route.path} - ${err.message}`);
  }
});

// Final Mount to APP
app.use('/api/v1', v1Router);
app.use('/api', v1Router); // Backwards compatibility


// Static files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Root endpoint
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  res.json({
    status: 'Server running successfully',
    dbStatus: dbStatus === 1 ? 'Connected' : 'Disconnected',
    environment: NODE_ENV
  });
});

// Admin content routes are now handled by routes/admin.cjs
// ============================================

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  res.json({
    status: 'API is running',
    dbStatus: dbStatus === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    endpoints: {
      dropdowns: '/api/v1/dropdown/language, /api/v1/dropdown/counter-category',
      admin: '/api/admin/content',
      version: '/api/v1'
    }
  });
});

// Catch-all for unmatched API routes
app.use('/api/:unmatchedRoute', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    suggestion: 'Most API routes are now under /api/v1/',
    attemptedRoute: req.params.unmatchedRoute,
    availableV1Endpoints: [
      '/api/v1/doctors (Base Route)',
      '/api/v1/doctors/all',
      '/api/v1/hospitals (Base Route)',
      '/api/v1/hospitals/all',
      '/api/v1/contact',
      '/api/v1/blogs',
      '/api/v1/admin/login'
    ]
  });
});


// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'production' ? 'Please try again later' : error.message
  });
});

// Export for serverless deployment
const handler = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection failed in handler:', error.message);
      return res.status(500).json({
        error: 'Database connection failed',
        message: 'Please try again later'
      });
    }
  }
  return app(req, res);
};

module.exports = handler;

// Start server - Always listen unless in production (for serverless environments)
// But for standard Render/VPS deployments, we want to listen regardless of NODE_ENV
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📝 Environment: ${NODE_ENV}`);
      console.log(`🌐 CORS enabled for: https://snapsta-43709.web.app`);
      console.log(`📋 Available endpoints:`);
      console.log(`   - POST /api/v1/admin/login`);
      console.log(`   - GET  /api/v1/blogs`);
      console.log(`   - GET  /api/v1/blogs/stats`);
      console.log(`   - GET  /api/v1/seo/page/:pageType`);
      console.log(`   - GET  /api/v1/seo/page/:pageType/:pageIdentifier`);
      console.log(`   - GET  /api/v1/booking`);
      console.log(`   - GET  /api/v1/contact`);
      console.log(`   - GET  /api/v1/dropdown/language`);
      console.log(`   - GET  /api/v1/dropdown/counter-category`);
      console.log(`   - GET  /api/admin/content`);
      console.log(`   - POST /api/admin/content`);
      console.log(`   - GET  /api/health`);
      console.log(`   - GET  /`);
      console.log(`💾 Database persistence: ENABLED`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('Mongoose connection closed');
  process.exit(0);
});

startServer();
