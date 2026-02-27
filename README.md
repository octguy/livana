# Livana 1.0

An Airbnb-inspired fullstack marketplace for home rentals and experience bookings. Built with Spring Boot 3.5.7 (Java 25) and React 19 + TypeScript + Vite.

## Features

- **Dual Marketplace** - Home rentals and experience bookings
- **Real-Time Chat** - WebSocket-powered messaging with STOMP
- **Payment Processing** - VNPay integration for transactions
- **Role-Based Access** - Guest, User, Host, and Admin roles
- **Location Search** - Interactive maps with Leaflet
- **Host Dashboard** - Revenue analytics and booking management
- **Image Uploads** - Cloudinary integration

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Spring Boot 3.5.7, Java 25, PostgreSQL, JPA/Hibernate, JWT, RabbitMQ, WebSocket/STOMP |
| **Frontend** | React 19, TypeScript 5.9, Vite 7.1, Zustand, Tailwind CSS 4.1, Radix UI |
| **Infrastructure** | Docker, Nginx, Cloudinary, VNPay |

---

## Quick Start with Docker

The fastest way to run the entire stack.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### 1. Clone and Configure

```bash
git clone <repository-url>
cd livana
```

Create `source/livana-be/.env` with your credentials:

```env
# Database
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# JWT (generate a secure key)
SPRING_JWT_SECRET_KEY=your-256-bit-secret-key-here
SPRING_JWT_SECRET_KEY_EXPIRATION=86400000
REFRESH_TOKEN_EXPIRATION=604800000
RESET_PASSWORD_TOKEN_EXPIRATION=3600000
VERIFICATION_CODE_EXPIRATION=3600000

# Email (Gmail App Password)
SUPPORT_EMAIL=your-email@gmail.com
APP_PASSWORD=your-gmail-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=livana

# RabbitMQ
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# VNPay (sandbox or production)
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Demo data (optional)
SEED_DEMO_DATA=false
```

### 2. Start All Services

```bash
cd source
docker compose up -d
```

This starts:
- **PostgreSQL** on port `5432`
- **RabbitMQ** on port `5672` (management UI: `15672`)
- **Backend API** on port `8080`
- **Frontend** on port `5173`

### 3. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| RabbitMQ Management | http://localhost:15672 |

### Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f livana-be

# Stop all services
docker compose down

# Stop and remove volumes (reset data)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build
```

---

## Local Development Setup

For active development with hot reload.

### Prerequisites

- **Java 25+** - `java -version`
- **Node.js 18+** - `node -v`
- **PostgreSQL 14+**
- **RabbitMQ 3.x** (optional, for messaging)

### 1. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE livana;"

# Initialize schema
psql -U postgres -d livana -f source/schema.sql
```

### 2. Backend Setup

```bash
cd source/livana-be
```

Configure `src/main/resources/application.yaml` or set environment variables:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/livana
    username: postgres
    password: postgres

jwt:
  secret: your-256-bit-secret-key-here
  expiration: 86400000

cloudinary:
  cloud-name: your-cloud-name
  api-key: your-api-key
  api-secret: your-api-secret

vnpay:
  vnp-TmnCode: your-tmn-code
  vnp-HashSecret: your-hash-secret
  vnp-Url: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

Run the backend:

```bash
./gradlew bootRun
```

Backend starts at `http://localhost:8080`

### 3. Frontend Setup

```bash
cd source/livana-fe
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8080
```

Run the frontend:

```bash
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## Development Commands

### Backend

```bash
cd source/livana-be

./gradlew bootRun                    # Run with hot reload
./gradlew build                      # Build project
./gradlew test                       # Run all tests
./gradlew test --tests ClassName     # Run specific test
./gradlew bootJar                    # Create executable JAR
./gradlew clean                      # Clean build artifacts
```

### Frontend

```bash
cd source/livana-fe

npm run dev       # Development server with HMR
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## Project Structure

```
source/
├── docker-compose.yml          # Full stack Docker setup
├── schema.sql                  # Database schema
├── livana-be/                  # Spring Boot backend
│   ├── src/main/java/octguy/livanabe/
│   │   ├── config/             # Security, WebSocket, RabbitMQ
│   │   ├── controller/         # REST endpoints
│   │   ├── service/            # Business logic
│   │   ├── repository/         # JPA repositories
│   │   ├── entity/             # Domain models
│   │   ├── dto/                # Request/Response DTOs
│   │   └── jwt/                # Authentication
│   └── Dockerfile
└── livana-fe/                  # React frontend
    ├── src/
    │   ├── components/         # UI components
    │   ├── pages/              # Page components
    │   ├── stores/             # Zustand state
    │   ├── services/           # API services
    │   └── types/              # TypeScript types
    └── Dockerfile
```

---

## API Documentation

Access Swagger UI at `http://localhost:8080/swagger-ui.html` when the backend is running.

### Key Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Auth** | `POST /api/v1/auth/login` | Login |
| | `POST /api/v1/auth/register` | Register |
| | `POST /api/v1/auth/refresh-token` | Refresh JWT |
| **Listings** | `GET /api/v1/listings/homes` | Search homes |
| | `GET /api/v1/listings/experiences` | Search experiences |
| | `POST /api/v1/listings/homes` | Create listing (Host) |
| **Bookings** | `POST /api/v1/bookings/homes` | Book a home |
| | `GET /api/v1/bookings/my-bookings` | User's bookings |
| **Payments** | `POST /api/v1/payments/vnpay/create` | Create payment |
| **WebSocket** | `/ws` | Real-time connection |

---

## Environment Variables Reference

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | - |
| `SPRING_DATASOURCE_USERNAME` | Database username | - |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |
| `SPRING_JWT_SECRET_KEY` | JWT signing key (256-bit) | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |
| `VNPAY_TMN_CODE` | VNPay terminal code | - |
| `VNPAY_HASH_SECRET` | VNPay hash secret | - |
| `RABBITMQ_HOST` | RabbitMQ host | `localhost` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |

---

## Troubleshooting

### Backend won't start

```bash
# Check Java version (requires 25+)
java -version

# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check if port 8080 is in use
lsof -i :8080
```

### Docker issues

```bash
# View container logs
docker compose logs -f livana-be

# Restart a specific service
docker compose restart livana-be

# Reset everything
docker compose down -v && docker compose up -d --build
```

### WebSocket not connecting

- Verify backend is running at `http://localhost:8080`
- Check browser console for CORS errors
- Ensure `/ws` endpoint is accessible

### Payment callback issues

For local development, use [ngrok](https://ngrok.com/) to expose your callback URL:

```bash
ngrok http 8080
# Update VNPAY_RETURN_URL with the ngrok URL
```
