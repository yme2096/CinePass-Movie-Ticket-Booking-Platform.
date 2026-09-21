# 🎬 CinePass – Movie Ticket Booking Platform

CinePass is a full-stack movie ticket booking platform designed to provide a simple and structured online cinema booking experience.

Users can browse movies, select a date, choose a theatre and show, select seats, and complete their booking through a microservices-based backend.

---

## 🚀 Project Overview

CinePass demonstrates how modern web technologies and microservices architecture can be used to build an online movie ticket booking system.

The application consists of:

- 🎨 React frontend
- ⚙️ Spring Boot backend
- 🔐 JWT-based authentication
- 🌐 API Gateway
- 🔎 Eureka Service Discovery
- 🎬 Movie Service
- 🎟️ Booking Service
- 💳 Payment Service
- 👤 User Service
- 🗄️ MySQL database
- 📡 REST APIs
- 📊 Actuator monitoring

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │       Vite           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     API Gateway      │
                         │       :8080          │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             ┌────────────┐ ┌────────────┐ ┌────────────┐
             │User Service│ │Movie Service│ │Booking     │
             │   :8081    │ │   :8082     │ │Service     │
             └─────┬──────┘ └─────┬──────┘ │   :8083    │
                   │              │         └─────┬──────┘
                   │              │               │
                   │              │               ▼
                   │              │        ┌─────────────┐
                   │              │        │Payment      │
                   │              │        │Service      │
                   │              │        │   :8084     │
                   │              │        └─────────────┘
                   │              │
                   └──────────────┼─────────────────┐
                                  │                 │
                                  ▼                 ▼
                         ┌────────────────┐  ┌──────────────┐
                         │ Eureka Server  │  │    MySQL     │
                         │     :8761      │  │   Database   │
                         └────────────────┘  └──────────────┘
```

---

# ✨ Features

## 👤 User Management

- User registration
- User login
- JWT authentication
- Secure API access
- User information management

## 🎬 Movie Management

- Browse available movies
- View movie details
- Movie language
- Movie genre
- Movie duration
- Movie posters

## 📅 Show Management

- Select movie date
- View available theatres
- View available shows
- Select show timing

## 🎟️ Seat Booking

- Select available seats
- Prevent duplicate seat booking
- Calculate booking amount
- Create booking
- View booking details

## 💳 Payment

- Payment service integrated with the booking workflow
- Payment status management
- Booking/payment relationship

## 🌐 Microservices

The backend is divided into independent services:

```text
user-service
movie-service
booking-service
payment-service
api-gateway
eureka-server
```

This makes the application easier to develop, maintain and scale.

---

# 🛠️ Technologies Used

## Frontend

- React.js
- Vite
- JavaScript
- CSS
- Axios

## Backend

- Java
- Spring Boot
- Spring Cloud
- Spring Data JPA
- Hibernate
- Maven
- REST APIs

## Microservices

- Spring Cloud Gateway
- Netflix Eureka
- Service Discovery
- API Gateway

## Security

- Spring Security
- JWT Authentication

## Database

- MySQL

## Development Tools

- Eclipse / Spring Tools
- Visual Studio Code
- MySQL Workbench
- Postman
- Git
- GitHub

---

# 📂 Project Structure

```text
CinePass/
│
├── Backend/
│   │
│   ├── api-gateway/
│   │
│   ├── eureka-server/
│   │
│   ├── user-service/
│   │
│   ├── movie-service/
│   │
│   ├── booking-service/
│   │
│   └── payment-service/
│
├── Frontend/
│   │
│   └── cinepass-frontend/
│       │
│       ├── public/
│       ├── src/
│       │   ├── App.jsx
│       │   ├── App.css
│       │   └── main.jsx
│       │
│       ├── package.json
│       └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Backend Setup

## Prerequisites

Install the following:

- Java 21
- Maven
- MySQL
- Node.js
- npm
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/yme2096/CinePass-Movie-Ticket-Booking-Platform..git
```

```bash
cd CinePass-Movie-Ticket-Booking-Platform.
```

---

# 🗄️ Database Setup

Install and start MySQL.

Create the required databases according to the database configuration used by the individual services.

Example:

```sql
CREATE DATABASE cinepass_user;
CREATE DATABASE cinepass_movie;
CREATE DATABASE cinepass_booking;
CREATE DATABASE cinepass_payment;
```

Update the database configuration in each service's `application.properties`.

**Do not commit real database passwords to GitHub.**

---

# 🔐 Environment Variables

Sensitive information such as passwords and JWT secrets should be provided through environment variables.

Example:

```properties
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}
```

Set the variables on your local machine before starting the services.

---

# ▶️ Running the Backend

Start the services in the following order.

### 1. Eureka Server

```text
eureka-server
```

Default port:

```text
8761
```

Eureka Dashboard:

```text
http://localhost:8761
```

### 2. User Service

```text
user-service
```

Default port:

```text
8081
```

### 3. Movie Service

```text
movie-service
```

Default port:

```text
8082
```

### 4. Booking Service

```text
booking-service
```

Default port:

```text
8083
```

### 5. Payment Service

```text
payment-service
```

Default port:

```text
8084
```

### 6. API Gateway

```text
api-gateway
```

Default port:

```text
8080
```

The frontend communicates with the backend through the API Gateway.

---

# 🎨 Frontend Setup

Open a terminal inside:

```text
Frontend/cinepass-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide a local URL, usually:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🔄 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  ▼
API Gateway
  │
  ▼
Authentication
  │
  ▼
Movie Selection
  │
  ▼
Date Selection
  │
  ▼
Theatre Selection
  │
  ▼
Show Selection
  │
  ▼
Seat Selection
  │
  ▼
Booking
  │
  ▼
Payment
  │
  ▼
Booking Confirmation
```

---

# 🔐 Security

CinePass uses JWT-based authentication to secure protected APIs.

The authentication flow is:

```text
User Login
     │
     ▼
User Service
     │
     ▼
JWT Token
     │
     ▼
Frontend
     │
     ▼
API Gateway
     │
     ▼
Protected Microservices
```

Sensitive configuration should always be stored outside the source code.

---

# 📡 API Gateway

The API Gateway provides a single entry point for frontend requests.

Example:

```text
Frontend
   │
   ▼
localhost:8080
   │
   ├── /api/auth/**
   │       └── User Service
   │
   ├── /api/movies/**
   │       └── Movie Service
   │
   ├── /api/bookings/**
   │       └── Booking Service
   │
   └── /api/payments/**
           └── Payment Service
```

---

# 🔎 Service Discovery

Eureka Server is used for service discovery.

Instead of hardcoding the address of every microservice, services register themselves with Eureka.

```text
                 Eureka Server
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   User Service Movie Service Booking Service
        │                         │
        └──────────┬──────────────┘
                   ▼
              API Gateway
```

---

# 📊 Monitoring

Spring Boot Actuator is used to expose application health and monitoring endpoints.

Example:

```text
/actuator/health
/actuator/info
```

These endpoints can be used to check service health and application information.

---

# 🧪 Testing

The REST APIs can be tested using:

- Postman
- Browser
- React frontend

Example authentication request:

```text
POST /api/auth/login
```

Example movie request:

```text
GET /api/movies
```

Example booking request:

```text
POST /api/bookings
```

---

# 🎯 Digital Technology & Innovation (DTI) Concepts

CinePass applies Digital Technology and Innovation concepts to a real-world entertainment booking problem.

### 1. Microservices Architecture

The application is divided into independent services such as User, Movie, Booking and Payment services.

### 2. Digital Platform

CinePass provides a digital platform for discovering movies and booking cinema tickets online.

### 3. Automation

The booking workflow reduces manual theatre booking operations by digitally managing movie, show and seat information.

### 4. Distributed Systems

Multiple backend services communicate through APIs and service discovery.

### 5. Secure Digital Transactions

Authentication and authorization mechanisms are used to protect user and booking-related operations.

### 6. Scalable Architecture

Independent services allow different components of the system to be developed and scaled separately.

---

# 💡 Innovation

The project combines movie discovery, authentication, theatre/show selection, seat booking and payment processing into a single digital platform.

The microservices architecture allows individual modules to evolve independently while maintaining communication through well-defined APIs.

---

# 📸 Application Modules

### Home / Movie Listing

Users can browse currently available movies.

### Login & Registration

Users can create an account and securely log in.

### Movie Selection

Users can select a movie and proceed to booking.

### Date Selection

Users can select their preferred booking date.

### Theatre & Show Selection

Available theatres and show timings can be displayed for the selected movie and date.

### Seat Selection

Users can choose seats before confirming their booking.

### Booking

The system creates and manages movie ticket bookings.

### Payment

Payment information and payment status are handled through the payment service.

---

# 🔮 Future Enhancements

- Online payment gateway integration
- Email/SMS booking confirmation
- Admin dashboard
- Movie search and filtering
- Real-time seat availability
- Redis caching
- Kafka event-driven communication
- Prometheus monitoring
- Grafana dashboards
- Docker containerization
- Kubernetes deployment
- Cloud deployment
- Recommendation system

---

# 👨‍💻 Developer

**M. Jayachandra Reddy**

B.Tech – Computer Science and Engineering

---

# 📜 License

This project is developed for educational and academic purposes.

---

# ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**CinePass – Making movie ticket booking simple, structured and digital.**