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

## 🛠️ Running Locally

### Backend

```bash
cd backend/banking-backend
mvn clean install
mvn spring-boot:run
http://localhost:8080

cd mobile
npm install
npm run dev
http://localhost:5173
```

## 👨‍💻 Author

**Lucas Vanzella**  
- Software Developer  
- Focused on backend Java and financial systems.
