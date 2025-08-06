const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const facilitiesRoutes = require('./routes/facilities');
const transfersRoutes = require('./routes/transfers');

// Database connection (optional - works without it for now)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('✅ Connected to MongoDB');
    }).catch(err => {
        console.log('⚠️  MongoDB not connected, using mock data');
    });
} else {
    console.log('ℹ️  Running without database - using mock data');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/transfers', transfersRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date(),
        services: {
            api: 'running',
            database: mongoose.connection.readyState === 1 ? 'connected' : 'mock mode'
        }
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'CareLink API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            facilities: '/api/facilities',
            transfers: '/api/transfers',
            auth: '/api/auth/login'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🏥 Facilities: http://localhost:${PORT}/api/facilities`);
});