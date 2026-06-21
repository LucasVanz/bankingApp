# 🏦 Banking App

Full-stack banking simulation built with **Spring Boot and React**, implementing JWT authentication, QR-code transaction confirmation, financial asset investment system and interactive analytics dashboard.

Designed to demonstrate backend architecture, security practices and modern Java development patterns.

---

## 🚀 Tech Stack

### 🔧 Backend
- Java 17  
- Spring Boot  
- Spring Security + JWT  
- Spring Data JPA (Hibernate)  
- Flyway (Database Migrations)  
- PostgreSQL  
- H2 (Development)  
- Maven  

### 🎨 Frontend
- React 18 + Vite  
- Axios  
- React Router  
- Recharts (Analytics)  
- QRCode.React  
- CSS3  

---

## 🧠 Architecture

The backend follows a layered architecture:
Controller → Service → Repository → Database

- Controllers handle HTTP requests  
- Services contain business rules  
- Repositories abstract the persistence layer  
- Security layer implements JWT filter authentication  
- Flyway manages schema versioning  

This structure ensures maintainability, scalability and separation of concerns.

---

## 📋 Core Features

### 👤 Authentication & User Management
- User registration  
- Login using CPF + password  
- JWT authentication (24h expiration)  
- Password encryption with BCrypt  
- Profile update (name, email, phone, photo)  

### 💰 Transactions
- Deposit requests with QR Code confirmation  
- Withdraw requests with QR Code confirmation  
- Transfer between accounts with confirmation flow  
- Transaction confirmation by ID (`/transaction/confirm/{id}` and `/transaction/confirmWithPassword/{id}`)  
- Transaction detail lookup by ID  
- Transaction status tracking  
- Detailed statement filtering with type and date range  
- Send statement by email  

### 📊 Financial Analytics
- Transaction volume charts  
- Transaction quantity charts  
- Dashboard with available balance  
- Categorized financial flow  

### 📈 Investments Module
- View financial assets (FIXED / VARIABLE)  
- Buy assets with QR Code confirmation  
- Sell investments using `investmentSell`  
- Track investment wallet holdings  
- Profitability and position summaries  

---

## 🔐 Security

- JWT authentication with request filtering  
- BCrypt password hashing  
- CPF validation  
- CORS configuration  
- Protected routes via token validation  
- Masked CPF serialization in API responses  

---

## 🔑 Main Endpoints

### Authentication
```bash
POST /auth/login
POST /users/create
```
### User
```bash
GET /users/me
GET /users/me/wallet
PUT /users/me/update
```
### Transactions
```bash
POST /transaction/deposit
POST /transaction/withdraw
POST /transaction/transfer
POST /transaction/investment
POST /transaction/investmentSell
POST /transaction/confirm/{id}
POST /transaction/confirmWithPassword/{id}
POST /transaction/transfer/confirm/{id}
GET /transaction/details/{id}
GET /transaction/status/{id}
GET /users/me/transactions?type={type}&startDate={date}&endDate={date}
GET /users/me/transactions/email?type={type}&startDate={date}&endDate={date}
```
### Investments & Analytics
```bash
GET /financialAssets/homebroker
GET /users/me/investmentWallet
GET /users/me/analisys
```
---

## 💾 Database

Main tables:

- `users`  
- `wallets`  
- `transactions`  
- `financial_assets`  
- `user_investments`  

Migrations handled via: 
```bash
src/main/resources/db/migration/
```
---

---

## 📁 Project Structure

```
bankingApp/
├── backend/
│   └── banking-backend/           # Spring Boot API
│       ├── src/main/java/com/lucas/banking/banking_backend/
│       │   ├── controller/         # HTTP request handlers
│       │   ├── service/            # Business logic
│       │   ├── repository/         # Data access layer
│       │   ├── entity/             # JPA entities
│       │   ├── dto/                # Data transfer objects
│       │   ├── config/             # Spring configuration
│       │   ├── exception/          # Custom exceptions
│       │   ├── infra/              # Infrastructure (JWT, CORS)
│       │   └── validation/         # Custom validators
│       ├── src/main/resources/
│       │   ├── application.properties     # Main config
│       │   ├── application-dev.properties  # Dev profile
│       │   ├── application-prod.properties # Prod profile
│       │   └── db/migration/       # Flyway SQL migrations
│       └── pom.xml                 # Maven configuration
├── mobile/                          # React + Vite frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API calls
│   │   ├── utils/                  # Helper functions
│   │   └── assets/                 # Images and static files
│   └── package.json                # NPM dependencies
└── README.md                        # This file
```

---

## 🛠️ Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Maven 3.8+** (included with backend via `mvnw`)
- **npm 9+** or **yarn** (for frontend)
- **PostgreSQL 14+** (for production) OR H2 (for development)
- **Git**

---

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env` file in the backend root or set these variables:

```bash
# JWT Configuration
JWT_SECRET=your_secret_key_here_min_32_characters

# Email Configuration (Gmail)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password_here

# Database (Production only)
DATABASE_URL=jdbc:postgresql://localhost:5432/banking_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
```

### For Gmail Email Service

1. Enable 2-factor authentication on your Google Account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `MAIL_PASSWORD` environment variable

---

## 🚀 Running Locally

### Backend

**Development (H2 Database)**

```bash
cd backend/banking-backend

# Set environment variables
export JWT_SECRET=your_dev_secret_key_here
export MAIL_USERNAME=your_email@gmail.com
export MAIL_PASSWORD=your_app_password

# Build and run
mvn clean install
mvn spring-boot:run

# API will be available at http://localhost:8080
```

**Testing**

```bash
cd backend/banking-backend
mvn test
```

### Frontend

```bash
cd mobile

# Install dependencies
npm install

# Development server
npm run dev

# The app will be available at http://localhost:5173
```

**Configure Backend URL**

Update the API base URL in [src/services/api.js](src/services/api.js):

```javascript
// For local development
const API_URL = 'http://localhost:8080';
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
cd backend/banking-backend
docker build -t banking-backend:latest .
```

### Run Docker Container

```bash
docker run -p 8080:8080 \
  -e JWT_SECRET=your_secret \
  -e MAIL_USERNAME=your_email@gmail.com \
  -e MAIL_PASSWORD=your_app_password \
  -e DATABASE_URL=jdbc:postgresql://postgres:5432/banking \
  banking-backend:latest
```

### Production Database Setup (PostgreSQL)

```bash
# Connect to PostgreSQL
psql -U postgres -c "CREATE DATABASE banking_db;"

# Flyway migrations will run automatically on startup
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

---

## 🔧 Application Profiles

The backend supports multiple configuration profiles:

### Development Profile (`dev`)

- **Active by default** in `application.properties`
- Uses **H2 in-memory database**
- Shows SQL queries in console
- Perfect for local development and testing

### Production Profile (`prod`)

- Uses **PostgreSQL** database
- Requires environment variables for database connection
- Production-grade security settings

**Switch profiles:**

```bash
# Development
mvn spring-boot:run

# Production
mvn spring-boot:run -Dspring.profiles.active=prod
```

---

## 📊 Database Schema

**Managed via Flyway migrations** (`src/main/resources/db/migration/`):

1. `V1__create_financial_asset_table.sql` - Financial assets catalog
2. `V2__insert_starters_financial_assets_table.sql` - Initial asset data
3. `V3__create_users_table.sql` - User accounts
4. `V4__create_wallets_table.sql` - User wallets
5. `V5__create_user_investments_table.sql` - Investment portfolio
6. `V6__create_transactions_table.sql` - Transaction history

Migrations run automatically on application startup.

---

## 🧪 Testing & Quality

```bash
# Run backend tests
mvn test

# Lint frontend code
npm run lint
```

---

## 📦 Build & Package

### Backend JAR

```bash
cd backend/banking-backend
mvn clean package

# JAR file: target/banking-backend-0.0.1-SNAPSHOT.jar
java -jar target/banking-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Build

```bash
cd mobile
npm run build

# Output: dist/
```

---

## 🔐 Security Best Practices

- Never commit `.env` files with real secrets
- Use strong, unique JWT secrets (minimum 32 characters)
- Enable HTTPS in production
- Rotate JWT secrets periodically
- Use PostgreSQL in production (not H2)
- Enable CORS only for trusted origins
- Validate all CPF inputs

---

## 📚 API Documentation

Complete API endpoints available at `/swagger-ui.html` (if Springdoc OpenAPI is configured).

Base URL: `http://localhost:8080`

For detailed endpoint documentation, see [Main Endpoints](#-main-endpoints) section above.

---

## 🐛 Troubleshooting

### JWT_SECRET not found
- Ensure environment variable is set: `export JWT_SECRET=your_key`
- Or add to `application-dev.properties`

### Email not sending
- Verify Gmail app password is correct
- Check Gmail 2FA is enabled
- Ensure `MAIL_USERNAME` and `MAIL_PASSWORD` are set

### H2 Database errors
- H2 is only for development. For production, use PostgreSQL
- Delete `src/main/resources/db/h2/` if migrations fail

### CORS issues on frontend
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration in backend `config/` folder

---

## 👨‍💻 Author

**Lucas Vanzella**  
- Software Developer  
- Focused on backend Java and financial systems.
