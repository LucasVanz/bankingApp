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
- Deposit (QR Code confirmation)  
- Withdraw (QR Code confirmation)  
- Transfer between accounts  
- Transaction status tracking  
- Detailed statement (all / income / expenses)  

### 📊 Financial Analytics
- Transaction volume charts  
- Transaction quantity charts  
- Dashboard with available balance  
- Categorized financial flow  

### 📈 Investments Module
- View financial assets (FIXED / VARIABLE)  
- Buy assets  
- Track investment wallet  
- Profitability calculation  

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
GET /transaction/status/{id}
GET /users/me/transactions
GET /users/me/transactions/expenses
GET /users/me/transactions/income
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
