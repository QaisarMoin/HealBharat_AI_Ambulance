# AI Emergency Pressure & Ambulance Load Prediction System

## Project Overview

A comprehensive emergency management system that predicts hospital pressure levels and ambulance availability using AI-driven analysis of multiple data sources including weather, time patterns, and incident reports.

**Phase 3 Complete**: Production-ready system with professional UI, security hardening, and comprehensive documentation.

## 🎯 System Objectives

- **Predict Hospital Pressure**: Analyze capacity utilization and predict emergency load
- **Optimize Ambulance Deployment**: Real-time tracking and predictive allocation
- **Multi-Factor Analysis**: Weather, time patterns, incidents, and historical data
- **Real-time Alerts**: Critical situation notifications and warnings
- **Emergency Dashboard**: Professional interface for operations monitoring

## 🏗️ Architecture

### Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js with Tailwind CSS
- **AI/ML**: Custom prediction algorithms with multiple data sources
- **Database**: MongoDB with comprehensive data models

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│   Tailwind CSS  │    │   Security      │    │   Models        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐
│   AI Engine     │    │   Data Sources  │
│   Predictions   │◄──►│   Weather       │
│   Analytics     │    │   Time Patterns │
│   Alerts        │    │   Incidents     │
└─────────────────┘    └─────────────────┘
```

## 📊 Key Features

### 1. **AI-Powered Predictions**

- Multi-factor analysis (weather, time, incidents)
- Historical data learning and pattern recognition
- Real-time pressure level predictions
- Ambulance availability forecasting

### 2. **Emergency Dashboard**

- Real-time hospital pressure monitoring
- Ambulance status tracking
- Incident management
- Professional, responsive UI with Tailwind CSS

### 3. **Alert System**

- Critical situation notifications
- Multi-severity alert levels
- Real-time updates
- Historical alert tracking

### 4. **Data Management**

- Multiple data import formats (JSON, CSV, Excel)
- Data validation and sanitization
- Mock data generation for testing
- Comprehensive data models

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd HealBharat_AI_Ambulance
```

2. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Environment Setup**

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure your environment variables
# - MongoDB connection string
# - Port numbers
# - API keys (if needed)
```

4. **Start the application**

```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd frontend
npm run dev
```

5. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

## 📁 Project Structure

```
HealBharat_AI_Ambulance/
├── backend/                    # Node.js Express Server
│   ├── app.js                 # Main application file
│   ├── config/                # Configuration files
│   │   └── database.js        # MongoDB connection
│   ├── models/                # MongoDB schemas
│   │   ├── Hospital.js        # Hospital data model
│   │   ├── AmbulanceLog.js    # Ambulance tracking
│   │   ├── AccidentIncident.js # Incident reports
│   │   ├── WeatherContext.js  # Weather data
│   │   └── TimeContext.js     # Time patterns
│   ├── routes/                # API endpoints
│   │   ├── dashboardRoutes.js # Dashboard API
│   │   ├── alertRoutes.js     # Alert system
│   │   ├── dataRoutes.js      # Data import/export
│   │   └── predictionRoutes.js # AI predictions
│   ├── services/              # Business logic
│   │   ├── dashboardService.js # Dashboard logic
│   │   ├── alertService.js    # Alert management
│   │   ├── dataImportService.js # Data processing
│   │   ├── mockDataService.js # Test data
│   │   └── predictionService.js # AI algorithms
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.js    # Error handling
│   │   └── validation.js      # Input validation
│   ├── utils/                 # Utility functions
│   │   └── logger.js          # Logging system
│   └── uploads/               # File uploads
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # App entry point
│   │   ├── index.css          # Global styles
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   ├── Alerts.jsx     # Alert management
│   │   │   ├── MapView.jsx    # Map visualization
│   │   │   └── DataImport.jsx # Data import UI
│   │   └── assets/            # Static assets
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   └── tailwind.config.js     # Tailwind CSS config
│
├── test_system.md             # System testing guide
└── README.md                  # This file
```

## 🔧 API Endpoints

### Dashboard API

- `GET /api/dashboard` - Main dashboard data
- `GET /api/dashboard/summary` - Summary statistics
- `GET /api/dashboard/zones` - Zone-specific data
- `GET /api/dashboard/realtime` - Real-time updates

### Alert System

- `GET /api/alerts` - All alerts
- `GET /api/alerts/:zone` - Zone-specific alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert

### Data Management

- `POST /api/data/import` - Import data
- `GET /api/data/export` - Export data
- `GET /api/data/mock` - Generate mock data

### Predictions

- `GET /api/predictions` - Get predictions
- `GET /api/predictions/:hospitalId` - Hospital-specific predictions
- `POST /api/predictions/analyze` - Custom analysis

## 🎨 UI Features

### Professional Dashboard

- **Real-time Monitoring**: Live updates every 30 seconds
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Styling**: Clean, modern interface with Tailwind CSS
- **Data Visualization**: Charts, graphs, and status indicators

### Key Pages

1. **Dashboard**: Main operations center with key metrics
2. **Alerts**: Alert management with filtering and search
3. **Map View**: Geographic visualization of hospital data
4. **Data Import**: Tools for importing and managing data

### Security Features

- Input sanitization and validation
- Rate limiting (100 requests/minute)
- CORS configuration
- Content Security Policy
- Helmet.js security headers

## 🧪 Testing

### System Testing

Detailed testing procedures are available in [test_system.md](./test_system.md).

### Manual Testing

1. Start both backend and frontend servers
2. Navigate to http://localhost:5173
3. Test all dashboard features
4. Verify alert system functionality
5. Test data import capabilities

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test predictions
curl http://localhost:5000/api/predictions

# Test alerts
curl http://localhost:5000/api/alerts
```

## 📈 Data Models

### Hospital Model

```javascript
{
  name: String,
  zone: String,
  capacity: Number,
  currentPatients: Number,
  availableBeds: Number,
  availableAmbulances: Number,
  location: {
    latitude: Number,
    longitude: Number
  },
  type: String,
  contact: {
    phone: String,
    email: String
  }
}
```

### Ambulance Log Model

```javascript
{
  hospitalId: ObjectId,
  zone: String,
  patientCount: Number,
  arrivalTime: Date,
  departureTime: Date,
  ambulanceType: String,
  priority: String
}
```

### Prediction Model

```javascript
{
  hospitalId: ObjectId,
  zone: String,
  predictedPressure: String,
  confidence: Number,
  factors: {
    weatherImpact: Number,
    timeImpact: Number,
    incidentImpact: Number,
    historicalTrend: Number
  },
  timestamp: Date
}
```

## 🔒 Security Features

### Implemented Security Measures

- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: 100 requests per minute per IP
- **CORS Protection**: Configured for development and production
- **Security Headers**: Helmet.js for security headers
- **Content Security Policy**: Prevents XSS attacks
- **Error Handling**: Secure error responses without sensitive data

### Security Best Practices

- Environment variables for sensitive data
- No hardcoded credentials
- Proper error handling without information leakage
- Input sanitization to prevent injection attacks

## 🚀 Deployment

### Development Environment

```bash
# Start development servers
cd backend && npm start
cd frontend && npm run dev
```

### Production Deployment

1. Build frontend: `npm run build`
2. Set production environment variables
3. Deploy backend to server
4. Serve frontend static files
5. Configure reverse proxy (nginx/Apache)

### Docker Support (Optional)

Docker configuration can be added for containerized deployment.

## 📊 Performance

### Optimizations

- Efficient MongoDB queries with indexing
- Caching for frequently accessed data
- Rate limiting to prevent abuse
- Optimized frontend rendering with React
- Tailwind CSS for efficient styling

### Scalability

- Modular architecture for easy scaling
- Database indexing for performance
- API design supports horizontal scaling
- Frontend supports lazy loading

## 🤝 Contributing

### Development Guidelines

1. Follow existing code patterns
2. Add appropriate comments and documentation
3. Test changes thoroughly
4. Update this README for significant changes

### Code Style

- Use ESLint for JavaScript linting
- Follow React best practices
- Maintain consistent naming conventions
- Use meaningful variable names

## 📞 Support

### Getting Help

- Check this README for common issues
- Review [test_system.md](./test_system.md) for troubleshooting
- Examine API documentation in route files
- Check console logs for error details

### Common Issues

1. **MongoDB Connection**: Verify connection string in .env
2. **CORS Errors**: Check frontend/backend port configuration
3. **Build Errors**: Ensure all dependencies are installed
4. **API Errors**: Verify data models and validation

## 📋 Phase-wise Evolution

### Phase 1: Foundation (Completed)

- ✅ Basic prediction algorithms
- ✅ Core data models
- ✅ Simple API endpoints
- ✅ Basic frontend interface

### Phase 2: Logic & Expansion (Completed)

- ✅ Multi-factor analysis
- ✅ Geospatial awareness
- ✅ Time-series logic
- ✅ Real-time alerts
- ✅ Emergency dashboard
- ✅ Data import/export

### Phase 3: Final Polish (Completed)

- ✅ Professional UI with Tailwind CSS
- ✅ Security hardening
- ✅ Loading states and error handling
- ✅ Comprehensive documentation
- ✅ Production readiness

## 🎯 Future Enhancements

### Potential Improvements

- Machine learning model integration
- Mobile application development
- Advanced analytics and reporting
- Integration with hospital systems
- Real-time GPS tracking
- Voice assistant integration

### Scalability Features

- Microservices architecture
- Cloud deployment optimization
- Advanced caching strategies
- Database sharding
- CDN integration

## 📄 License

This project is part of an internship submission and should be used in accordance with applicable agreements and policies.

## 🙏 Acknowledgments

- **Technology Stack**: Node.js, Express, React, MongoDB, Tailwind CSS
- **AI/ML Concepts**: Multi-factor analysis, predictive modeling
- **Emergency Management**: Best practices in healthcare operations
- **UI/UX Design**: Professional dashboard design principles

---

**Note**: This is a real internship project submission, not a demo. The system is designed for actual emergency management use cases and follows production-ready standards.
