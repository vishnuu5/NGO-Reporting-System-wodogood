# NGO Reporting System

A full-stack web application that enables NGOs to submit monthly impact reports and provides an admin dashboard for tracking and visualizing aggregated data.

## Tech Stack

### Frontend

- **Framework**: React.js with Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Language**: JavaScript (ES6+)

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Processing**: Multer, CSV-Parse
- **Async Processing**: Background job processing

## Features

### Report Submission

- Single report submission form with validation
- Fields: NGO ID, Month, People Helped, Events Conducted, Funds Utilized
- Real-time validation and error handling

### Bulk Upload

- CSV file upload for multiple reports
- Background processing with job status tracking
- Real-time progress updates (polling every 2 seconds)
- Partial failure handling with detailed error messages
- Sample CSV download functionality

### Admin Dashboard

- Month-wise aggregated statistics
- Total NGOs reporting
- Total people helped
- Total events conducted
- Total funds utilized
- Detailed NGO-wise breakdown table
- Responsive design for all devices

### Backend Features

- RESTful API design
- Idempotent report submissions (no duplicate NGO/month combinations)
- Asynchronous CSV processing
- Job status tracking
- Input validation and error handling
- MongoDB indexes for performance

## API Endpoints

| POST | `/api/report` | Submit a single monthly report |
| POST | `/api/reports/upload` | Upload CSV file for bulk reports |
| GET | `/api/job-status/:jobId` | Get processing status of uploaded CSV |
| GET | `/api/dashboard?month=YYYY-MM` | Get aggregated dashboard data for a month |

## Demo Links

[View Demo](https://ngo-reporting-system-wodogood.vercel.app)

- **Frontend**:

```bash
https://ngo-reporting-system-wodogood.vercel.app
```

- **Backend API**:

```bash
https://ngo-reporting-system-wodogood-backend.onrender.com
```

- **GitHub Repository**:

```bash
https://github.com/vishnuu5/NGO-Reporting-System-wodogood.git
```

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the Backend directory:

```bash
PORT=5000
MONGODB_URI=
NODE_ENV=development
```

For MongoDB Atlas (production):

```bash
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ngo-reporting?retryWrites=true&w=majority
NODE_ENV=production
```

4. Start the backend server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the Frontend directory:

```bash
# For local development
VITE_API_URL=http://localhost:5000

# For production (replace with your deployed backend URL)
# VITE_API_URL=https://your-backend-url.onrender.com
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## CSV Format

The bulk upload feature expects a CSV file with the following format:

```bash
ngoId,month,peopleHelped,eventsConducted,fundsUtilized
NGO001,2024-01,150,5,50000
NGO002,2024-01,200,8,75000
NGO003,2024-01,100,3,30000
```

**Field Specifications:**

- `ngoId`: String, unique identifier for the NGO
- `month`: String, format YYYY-MM (e.g., 2024-01)
- `peopleHelped`: Integer, number of people helped
- `eventsConducted`: Integer, number of events conducted
- `fundsUtilized`: Number, amount of funds used (can have decimals)

## Key Implementation Details

### Idempotency

Reports with the same NGO ID and month combination are automatically updated instead of creating duplicates, preventing double-counting.

### Background Processing

CSV files are processed asynchronously using a job-based system. The frontend polls the `/job-status/:jobId` endpoint every 2 seconds to display real-time progress.

### Error Handling

- Input validation on both frontend and backend
- Detailed error messages for failed CSV rows
- Graceful handling of partial failures in bulk uploads
- MongoDB unique index on (ngoId, month) combination

### Database Schema

- **Reports**: Stores individual monthly reports with compound index on ngoId + month
- **Jobs**: Tracks CSV processing jobs with status, progress, and error details

## Future Improvements

With more time or for production deployment, I would add:

- **Authentication & Authorization**: JWT-based admin authentication
- **Pagination**: For dashboard NGO breakdown table
- **Advanced Filtering**: By region, date range, NGO categories
- **Data Visualization**: Charts and graphs using Chart.js or D3.js
- **Export Functionality**: Download dashboard data as PDF/Excel
- **Retry Logic**: Automatic retry for failed CSV rows
- **Rate Limiting**: API rate limiting using express-rate-limit
- **Caching**: Redis caching for dashboard queries
- **Logging**: Structured logging with Winston
- **Testing**: Unit tests (Jest) and integration tests (Supertest)
- **API Documentation**: Swagger/OpenAPI specification
- **Monitoring**: Error tracking with Sentry, performance monitoring
- **Email Notifications**: For job completion/failure

## API Sample Usage

### Submit Single Report

```bash
curl -X POST http://localhost:5000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "ngoId": "NGO001",
    "month": "2024-01",
    "peopleHelped": 150,
    "eventsConducted": 5,
    "fundsUtilized": 50000
  }'
```

### Upload CSV

```bash
curl -X POST http://localhost:5000/api/reports/upload \
  -F "file=@reports.csv"
```

### Get Job Status

```bash
curl http://localhost:5000/api/job-status/{jobId}
```

### Get Dashboard Data

```bash
curl "http://localhost:5000/api/dashboard?month=2024-01"
```

## License

This project is open source and available under the MIT License.
