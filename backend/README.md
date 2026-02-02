# AI Emergency Pressure & Ambulance Load Prediction System

## Overview

This is Phase 1 (Foundation & MVP) of a backend system designed to help hospitals and emergency authorities anticipate Emergency Department overload, estimate ambulance arrival pressure, identify high-risk zones, and receive early operational alerts.

**Technology Stack:** MongoDB, Express.js, Node.js, JavaScript (MERN backend only)

## System Architecture

### Backend Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection setup
├── models/                  # Data models
│   ├── Hospital.js         # Hospital information and capacity
│   ├── AmbulanceLog.js     # Ambulance arrival records
│   ├── AccidentIncident.js # Accident and incident reports
│   ├── WeatherContext.js   # Weather conditions
│   └── TimeContext.js      # Seasonal and festival context
├── services/
│   └── predictionService.js # Core prediction logic
├── routes/
│   └── predictionRoutes.js  # API endpoints
├── app.js                   # Main application file
└── package.json
```

### Data Models

#### Hospital

- **name**: Hospital name (required)
- **zone**: Geographic zone (North, South, East, West, Central)
- **capacity**: Maximum patient capacity (1-1000)
- **currentLoad**: Current patient load

#### AmbulanceLog

- **hospital**: Reference to hospital
- **zone**: Geographic zone
- **timestamp**: Arrival time
- **patientCount**: Number of patients (1-10)

#### AccidentIncident

- **zone**: Geographic zone
- **timestamp**: Incident time
- **severity**: Low, Medium, High, Critical
- **description**: Optional incident description

#### WeatherContext

- **date**: Date of weather record
- **condition**: Clear, Rainy, Stormy, Foggy, Snowy
- **temperature**: Temperature reading
- **humidity**: Humidity percentage

#### TimeContext

- **date**: Date of time context
- **season**: Summer, Monsoon, Winter
- **isFestival**: Boolean flag
- **festivalName**: Optional festival name

## Prediction Logic (MVP)

### Emergency Department Pressure

- **Low**: Average patient load < 4
- **Medium**: Average patient load 4-7
- **High**: Average patient load ≥ 8

### Ambulance Pressure

- **Low**: < 5 ambulance arrivals in 24 hours
- **Medium**: 5-9 ambulance arrivals in 24 hours
- **High**: ≥ 10 ambulance arrivals in 24 hours

### Accident Risk

Base score calculated from recent incidents:

- Critical/High severity: +2 points each
- Medium severity: +1 point each

**Multipliers applied:**

- Rainy weather: ×1.5
- Stormy weather: ×2.0
- Foggy weather: ×1.3
- Snowy weather: ×1.8
- Festival period: ×1.4
- Monsoon season: ×1.2

**Risk levels:**

- **Low**: Score < 4
- **Medium**: Score 4-7
- **High**: Score ≥ 8

### Overall Risk

Calculated from individual risk factors (Low=1, Medium=2, High=3):

- **Low**: Total score 3-3
- **Medium**: Total score 4-6
- **High**: Total score 7-9

## API Endpoints

### GET /api/predictions

Returns risk predictions for all zones.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "zone": "North",
      "edPressure": "High",
      "ambulancePressure": "Medium",
      "accidentRisk": "Low",
      "overallRisk": "Medium",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Risk predictions retrieved successfully"
}
```

### GET /api/alerts

Returns early alerts for high-risk situations.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "type": "HIGH_RISK_ZONE",
      "zone": "Central",
      "message": "High overall risk detected in Central zone",
      "severity": "Critical",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Early alerts retrieved successfully"
}
```

### GET /health

Health check endpoint.

### GET /

Root endpoint with system information.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone and navigate to backend:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment setup:**

   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. **Start MongoDB:**

   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application:**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emergency_prediction
```

## How It Works

### Data Flow

1. **Data Collection**: Systems log ambulance arrivals, accidents, and contextual data
2. **Prediction Calculation**: Service analyzes recent data (last 24 hours)
3. **Risk Assessment**: Individual risk factors are calculated and combined
4. **Alert Generation**: High-risk situations trigger alerts
5. **API Response**: Results are served via REST endpoints

### Business Logic

The system uses explainable, threshold-based logic that can be easily understood by non-technical stakeholders:

- **Historical Analysis**: Looks at ambulance arrivals and accident patterns from the last 24 hours
- **Contextual Factors**: Weather conditions and seasonal/festival periods that affect emergency rates
- **Simple Thresholds**: Clear, documented thresholds for each risk level
- **Transparent Scoring**: Risk scores are calculated using simple multipliers and additions

## Phase 1 Assumptions

### Simplifications Made

- **Single time window**: All predictions based on last 24 hours
- **Average-based calculations**: Using averages rather than hospital-specific analysis
- **Fixed thresholds**: Hard-coded risk thresholds for MVP
- **No real-time streaming**: Batch processing of recent data
- **No authentication**: Focus on core prediction logic
- **No frontend**: Backend-only implementation

### Data Quality Requirements

- Ambulance logs should be recorded within 1 hour of arrival
- Accident reports should include accurate severity classification
- Weather data should be updated daily
- Hospital capacity should be kept current

## Phase 2 Considerations

### Potential Enhancements

- **Machine Learning**: Replace threshold-based logic with ML models
- **Real-time Processing**: Stream processing for immediate predictions
- **Historical Analysis**: Multi-day and seasonal trend analysis
- **Hospital-specific Models**: Individual risk models per hospital
- **Integration APIs**: Connect with hospital management systems
- **Mobile Notifications**: Push alerts to emergency personnel
- **Dashboard UI**: Visual interface for monitoring and analysis
- **Advanced Analytics**: Predictive modeling and trend analysis

### Scalability Planning

- **Database Optimization**: Indexing and query optimization
- **Caching Layer**: Redis for frequently accessed data
- **Load Balancing**: Multiple API instances
- **Microservices**: Break down into specialized services
- **Cloud Deployment**: Containerization and orchestration

## Testing

### Manual Testing

1. Start the server: `npm run dev`
2. Access health check: `http://localhost:5000/health`
3. Get predictions: `http://localhost:5000/api/predictions`
4. Get alerts: `http://localhost:5000/api/alerts`

### Data Seeding

To test with sample data, you can use MongoDB Compass or a script to insert test records into the collections.

## Error Handling

The system includes basic error handling for:

- Database connection failures
- Invalid data formats
- Missing required fields
- API endpoint errors

Error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (in development mode)"
}
```

## Monitoring

### Health Checks

- `/health` endpoint for system status
- Database connection monitoring
- Basic error logging

### Logging

- Error stack traces in development
- Connection status messages
- API request/response logging (can be enhanced)

## Security Considerations

### Current (Phase 1)

- No authentication or authorization
- Basic input validation
- Error message sanitization in production

### Future (Phase 2)

- API authentication (JWT/OAuth)
- Role-based access control
- Input sanitization and validation
- Rate limiting
- HTTPS enforcement

## Contributing

### Code Style

- Use ESLint for consistent formatting
- Follow JavaScript best practices
- Document business logic clearly
- Maintain simple, explainable algorithms

### Testing

- Add unit tests for prediction logic
- Integration tests for API endpoints
- Performance tests for database queries

## Support

For questions about the system architecture or implementation:

- Review the prediction service logic in `services/predictionService.js`
- Check the API endpoints in `routes/predictionRoutes.js`
- Refer to the data models in the `models/` directory

This MVP provides a solid foundation that can be extended with more sophisticated features while maintaining the core principle of explainable, stakeholder-friendly emergency prediction logic.
