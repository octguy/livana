# Livana

A fullstack marketplace platform for home rentals and experience bookings, inspired by Airbnb. Built with Spring Boot and React, featuring real-time chat, payment processing, and comprehensive booking management.

## Features

- **Dual Marketplace**: Browse and book both home rentals and unique experiences
- **Role-Based Access Control**: Guest, User, Host, and Admin roles with granular permissions
- **Real-Time Communication**: WebSocket-powered chat and instant notifications
- **Secure Authentication**: JWT-based auth with automatic token refresh
- **Payment Integration**: VNPay payment gateway for seamless transactions
- **Advanced Search**: Location-based filtering with interactive maps
- **Review System**: Rate and review listings and hosts
- **Host Dashboard**: Revenue analytics and booking management
- **Multi-Step Listing Creation**: Intuitive wizard for creating listings
- **Image Management**: Cloudinary integration for photo uploads
- **Soft Delete Pattern**: Data preservation with logical deletion

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.7 (Java 25)
- **Database**: PostgreSQL with JPA/Hibernate
- **Authentication**: JWT (HS256) with refresh tokens
- **Messaging**: RabbitMQ for async operations
- **WebSocket**: STOMP over WebSocket for real-time features
- **Storage**: Cloudinary for image hosting
- **Payment**: VNPay integration
- **Build Tool**: Gradle

### Frontend
- **Framework**: React 19.1.1 with TypeScript 5.9.3
- **Build Tool**: Vite 7.1.7
- **State Management**: Zustand 5.0.8
- **Styling**: Tailwind CSS 4.1 + Radix UI (shadcn/ui)
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router 7.9.5
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for analytics
- **Maps**: Leaflet for location features
- **WebSocket**: STOMP.js + SockJS

## Prerequisites

- **Java 25** or higher
- **Node.js 18+** and npm
- **PostgreSQL 14+**
- **RabbitMQ 3.x** (for messaging features)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd livana
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE livana;
```

Initialize the schema:

```bash
psql -U your_username -d livana -f source/schema.sql
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd source/livana-be
```

Configure `src/main/resources/application.yaml` with your credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/livana
    username: your_username
    password: your_password

  mail:
    host: smtp.gmail.com
    username: your_email@gmail.com
    password: your_app_password

  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

jwt:
  secret: your-secret-key-here
  expiration: 86400000  # 24 hours

cloudinary:
  cloud-name: your_cloud_name
  api-key: your_api_key
  api-secret: your_api_secret

vnpay:
  vnp-TmnCode: your_tmn_code
  vnp-HashSecret: your_hash_secret
  vnp-Url: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

Build and run:

```bash
./gradlew bootRun
```

The backend will start at `http://localhost:8080`

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd source/livana-fe
```

Install dependencies:

```bash
npm install
```

Configure `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Start the development server:

```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

## Project Structure

### Backend (`source/livana-be/`)

```
src/main/java/octguy/livanabe/
├── config/              # Security, WebSocket, RabbitMQ configs
├── controller/          # REST API endpoints
├── service/
│   └── implementation/  # Business logic
├── repository/          # JPA repositories
├── entity/              # Domain models
├── dto/
│   ├── request/        # Request DTOs
│   └── response/       # Response DTOs
├── jwt/                # JWT authentication
├── enums/              # Enumerations
├── utils/              # Utility classes
├── exception/          # Custom exceptions
└── consumer/           # RabbitMQ consumers
```

### Frontend (`source/livana-fe/`)

```
src/
├── components/
│   ├── ui/             # Reusable UI components (Radix-based)
│   ├── auth/           # Auth guards and wrappers
│   └── layout/         # Layout components
├── pages/              # Page components by feature
├── stores/             # Zustand state stores
├── services/           # API service layer
├── lib/                # Axios config and utilities
└── types/              # TypeScript type definitions
```

## Available Commands

### Backend

```bash
./gradlew bootRun          # Run the application
./gradlew build            # Build the project
./gradlew clean            # Clean build artifacts
./gradlew bootJar          # Create executable JAR
./gradlew test             # Run all tests
./gradlew test --tests com.example.ClassName  # Run specific test
```

### Frontend

```bash
npm run dev               # Start dev server (http://localhost:5173)
npm run build             # Production build
npm run preview           # Preview production build
npm run lint              # Run ESLint
```

## API Documentation

Once the backend is running, access the Swagger UI documentation at:

```
http://localhost:8080/swagger-ui.html
```

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/verify` - Email verification
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

#### Listings
- `GET /api/v1/listings/homes` - Search home listings
- `GET /api/v1/listings/homes/{id}` - Get home details
- `POST /api/v1/listings/homes` - Create home listing (Host)
- `GET /api/v1/listings/experiences` - Search experiences
- `GET /api/v1/listings/experiences/{id}` - Get experience details
- `POST /api/v1/listings/experiences` - Create experience (Host)

#### Bookings
- `POST /api/v1/bookings/homes` - Book a home
- `POST /api/v1/bookings/experiences` - Book an experience
- `GET /api/v1/bookings/my-bookings` - User's bookings
- `GET /api/v1/bookings/host-bookings` - Host's received bookings
- `PUT /api/v1/bookings/homes/{id}/confirm` - Confirm booking (Host)
- `PUT /api/v1/bookings/homes/{id}/cancel` - Cancel booking

#### Payments
- `POST /api/v1/payments/vnpay/create` - Create VNPay payment URL
- `GET /api/v1/payments/vnpay/callback` - VNPay callback handler

#### Real-Time (WebSocket)
- `/ws` - WebSocket endpoint (SockJS enabled)
- `/topic/chat/{userId}` - Chat message subscription
- `/topic/notifications/{userId}` - Notification subscription
- `/app/messages` - Send chat message

## User Roles and Permissions

### Guest (Unauthenticated)
- Browse home and experience listings
- View listing details
- Register for an account

### User (Authenticated)
- All Guest permissions
- Book homes and experiences
- Write reviews
- Send messages to hosts
- Manage profile and bookings

### Host
- All User permissions
- Create and manage listings
- Manage bookings and availability
- View revenue analytics
- Respond to guest inquiries

### Admin
- All permissions
- Manage users and roles
- Manage platform catalogs
- Access system analytics

## Key Features Deep Dive

### Authentication Flow
1. User submits credentials to `/auth/login`
2. Backend validates and returns JWT + refresh token (HTTP-only cookie)
3. Frontend stores JWT in Zustand store
4. JWT automatically added to requests via Axios interceptor
5. On 401 error, token auto-refreshes with exponential backoff retry

### Real-Time Chat
- WebSocket connection established on login
- STOMP protocol for message routing
- Users subscribe to personal chat topic
- Messages stored in PostgreSQL
- Unread message tracking

### Payment Processing (VNPay)
1. User initiates booking
2. Backend generates VNPay URL with HMAC-SHA256 signature
3. User completes payment on VNPay
4. VNPay calls backend callback with transaction result
5. Backend verifies signature and updates booking status
6. Notification sent via RabbitMQ and WebSocket

### Multi-Step Listing Creation
- **Step 1**: Location selection with interactive map
- **Step 2**: Property/experience details
- **Step 3**: Amenities and features selection
- **Step 4**: Photo upload to Cloudinary
- **Step 5**: Pricing and availability settings
- State managed in Zustand (not persisted)

### Location-Based Search
- Bounding box queries using latitude/longitude
- Distance calculation for nearby listings
- Interactive map with markers
- Filter by price, capacity, amenities, dates

## Architecture Highlights

### Backend Patterns
- **Layered Architecture**: Controller → Service Interface → Service Implementation → Repository
- **Soft Delete**: All entities include `deletedAt` timestamp with `@SQLRestriction`
- **Response Wrapper**: Consistent `ApiResponse<T>` format for all endpoints
- **Entity Inheritance**: JOINED strategy for `BaseListing` and `Booking` hierarchies
- **JWT Stateless**: No server-side session storage

### Frontend Patterns
- **Service Layer**: Business logic separated from components
- **Custom Hooks**: Reusable logic abstraction
- **Zustand Stores**: Modular state management per domain
- **Axios Interceptors**: Centralized request/response handling
- **Protected Routes**: Role-based route guards

## Database Schema

The complete database schema is available in `source/schema.sql`. Key tables:

- **users**: User accounts and profiles
- **roles**: Role definitions (GUEST, USER, HOST, ADMIN)
- **role_users**: User-role associations
- **base_listing**: Abstract listing table
- **home_listing**: Home rental listings
- **experience_listing**: Experience/activity listings
- **booking**: Abstract booking table
- **home_booking**: Home rental bookings
- **experience_booking**: Experience bookings
- **conversation**: Chat conversations
- **message**: Chat messages
- **payment**: Payment transactions
- **review**: User reviews
- **notification**: System notifications

## Development Tips

### Backend Hot Reload
Spring Boot DevTools is configured for automatic restart on code changes.

### Frontend Hot Module Replacement
Vite provides instant HMR during development.

### Database Migrations
Currently using SQL schema file. Consider adding Flyway or Liquibase for production.

### CORS Configuration
Development CORS allows `http://localhost:5173`. Update for production domains in `SecurityConfig.java`.

### Debugging WebSocket
Use browser developer tools to inspect WebSocket frames. Check connection at `/ws/info` endpoint.

## Testing

### Backend Tests
```bash
cd source/livana-be
./gradlew test
./gradlew test --tests octguy.livanabe.service.*  # Test specific package
```

Test files are located in `src/test/java/`.

### Frontend Tests
Currently no test framework configured. Consider adding Vitest or Jest for unit tests and Playwright for E2E.

## Common Issues and Solutions

### Backend won't start
- **Check Java version**: `java -version` (requires Java 25)
- **Verify PostgreSQL**: Ensure database is running and credentials are correct
- **RabbitMQ**: Start RabbitMQ service if using messaging features
- **Port conflict**: Ensure port 8080 is available

### WebSocket connection fails
- **Backend running**: Verify backend is accessible at `http://localhost:8080`
- **CORS**: Check CORS configuration includes frontend URL
- **Firewall**: Ensure WebSocket traffic is not blocked

### Token refresh failing
- **Cookie settings**: Refresh token must be HTTP-only cookie
- **CORS credentials**: `withCredentials: true` in Axios config
- **Token expiry**: Check JWT expiration settings

### Payment integration issues
- **VNPay credentials**: Verify credentials in `application.yaml`
- **Callback URL**: Use ngrok for local testing to make callback accessible
- **Signature verification**: Check HMAC-SHA256 implementation matches VNPay docs

### Images not uploading
- **Cloudinary config**: Verify cloud name, API key, and secret
- **File size limits**: Check Spring Boot max file size settings
- **CORS**: Ensure Cloudinary URL is not blocked

## Environment Variables

### Backend (`application.yaml`)
```yaml
# Database
spring.datasource.url
spring.datasource.username
spring.datasource.password

# JWT
jwt.secret
jwt.expiration

# Email
spring.mail.username
spring.mail.password

# Cloudinary
cloudinary.cloud-name
cloudinary.api-key
cloudinary.api-secret

# VNPay
vnpay.vnp-TmnCode
vnpay.vnp-HashSecret

# RabbitMQ
spring.rabbitmq.host
spring.rabbitmq.username
spring.rabbitmq.password
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

**Security Note**: Never commit sensitive credentials to version control. Use environment variables or secret management tools.

## Deployment

### Backend Deployment
1. Build production JAR:
   ```bash
   ./gradlew bootJar
   ```
2. JAR file will be in `build/libs/`
3. Run with production profile:
   ```bash
   java -jar livana-be.jar --spring.profiles.active=prod
   ```

### Frontend Deployment
1. Build production bundle:
   ```bash
   npm run build
   ```
2. Dist files will be in `dist/`
3. Serve with any static file server (Nginx, Apache, Vercel, Netlify)

### Environment Considerations
- Update CORS origins for production domains
- Use HTTPS for production
- Configure proper database connection pooling
- Set up reverse proxy (Nginx) for backend
- Enable production logging and monitoring
- Configure CDN for static assets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Backend**: Follow Spring Boot and Java conventions
- **Frontend**: ESLint configuration provided, run `npm run lint`
- Write meaningful commit messages
- Add tests for new features
- Update documentation for significant changes

## Documentation

Additional documentation available:
- **Requirements**: `source/REQUIREMENTS_ACTORS_USECASES.md` (Vietnamese)
- **Use Cases**: `source/USE_CASES.md` (Vietnamese)
- **Sitemap**: `source/SITEMAP.md`
- **Developer Guide**: `source/CLAUDE.md`
- **Database Schema**: `source/schema.sql`

## License

[Specify your license here - MIT, Apache 2.0, etc.]

## Support

For issues, questions, or contributions, please open an issue on GitHub.
