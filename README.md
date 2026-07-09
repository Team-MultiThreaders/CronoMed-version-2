# 🏥 ChronoMed v2.0

> A modern, secure, and concurrent-safe hospital queue management system that simplifies appointment booking and enables real-time queue management for both patients and doctors.


<p align="center">
  <img width="1920" height="1080" alt="hero-medical" src="https://github.com/user-attachments/assets/cbae042c-dbde-4f3a-af5c-fd0df4d34ad5" />
</p>

---

## 📖 Overview

Long waiting times and inefficient queue management are common challenges in healthcare systems. **ChronoMed v2.0** addresses these issues by providing a secure, real-time platform where patients can book appointments while doctors efficiently manage their consultation queues.

The system focuses on **performance, security, concurrency, and user experience**, making the appointment process smooth for both patients and healthcare providers.

---

## ✨ Features

### 👤 Authentication & Security
- JWT Authentication
- Role-Based Access Control
- Patient Registration
- Secure Password Encryption
- Protected REST APIs

### 🩺 Patient Portal
- Patient Registration & Login
- Search Doctors
- Filter by Specialization
- Book Appointments
- Receive Instant Queue Number
- View Live Queue Status

### 👨‍⚕️ Doctor Dashboard
- Secure Doctor Login
- Live Queue Dashboard
- Call Next Patient
- Start Consultation
- Complete Consultation
- Queue Statistics

### ⚡ Queue Management
- Concurrent-safe appointment booking
- Thread-safe queue allocation
- Live queue synchronization
- Prevent duplicate queue numbers
- Automatic appointment status updates

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS v4
- React Router
- Axios
- Lucide React

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate

### Database
- PostgreSQL (Supabase)

### Authentication
- JWT (JSON Web Tokens)

---

## 📸 Preview

### Login & Authentication

<p align="center">
<img src="./assets/login.png" width="750"/>
</p>

Secure role-based authentication for Patients and Doctors using JWT.

---

### Doctor Dashboard

<p align="center">
<img src="./assets/dashboard.png" width="750"/>
</p>

Doctors can monitor queues, call the next patient, and manage consultations in real time.

---

## 🔐 Security Highlights

- JWT Authentication
- Password Encryption
- Protected REST Endpoints
- Role-based Authorization
- Secure API Communication

---

## ⚙️ Concurrency

ChronoMed implements a **thread-safe booking mechanism** to ensure:

- No duplicate queue numbers
- Consistent appointment ordering
- Reliable booking under concurrent requests

---

## 🚀 Future Improvements

We're continuously improving ChronoMed. Upcoming updates include:

- 📱 Mobile Application
- 🔔 SMS & Email Notifications
- 📅 Calendar Integration
- 💳 Online Payment Gateway
- 📄 Digital Medical Records
- 📊 Admin Dashboard
- 🤖 AI-powered Appointment Recommendations
- 🌐 Cloud Deployment
- 📈 Analytics & Reports

Stay tuned—more exciting features are on the way!

---

## 👨‍💻 Team MultiThreaders

- Nimsara Kodithuwakku
<img width="1920" height="1080" alt="hero-medical" src="https://github.com/user-attachments/assets/a13a49f9-ac68-450f-bb9a-9f6c72dc6ea6" />
- Yasandu Kethmika
- Kenul Perera
- Risandu Dissanayake
- Chamitha Botheju

---

## 🙏 Acknowledgements

A heartfelt thank you to **Prof. Chandana** for providing us with the opportunity, guidance, and encouragement throughout the development of this project.

---

⭐ If you like this project, don't forget to give the repository a star!
