# 🚀 GrowEasy Lead Importer

> An intelligent, production-grade CRM data migration pipeline that parses, validates, cleans, deduplicates, and standardizes messy CSV spreadsheets into CRM-ready records using AI-powered telemetry mapping.

---

## 📖 Overview

GrowEasy Lead Importer is a full-stack application that automates CRM data migration by transforming unstructured CSV files into clean, standardized lead records.

Instead of manually cleaning spreadsheets, the system uses AI to understand inconsistent column names, validates important contact information, removes duplicate entries, and prepares high-quality CRM records for import.

---

## ✨ Features

### 🤖 AI-Powered Data Mapping
- Uses **Groq Cloud SDK** with **Llama-3.3-70B-Versatile**
- Intelligently understands irregular spreadsheet headers
- Maps uploaded data into a standardized CRM schema
- Extracts useful information from inconsistent datasets

### 🧹 Smart Deduplication Engine
- Prevents duplicate CRM records
- Checks:
  - Email Address
  - 10-digit Mobile Number
- Uses an efficient in-memory lookup system before importing

### ⚡ Deterministic Pre-Validation
Performs fast validation before AI processing.

Automatically skips rows that are missing:
- Name
- Email
- Phone Number

This reduces unnecessary AI API calls and improves performance.

### 📦 Chunk-Based Processing
Large CSV files are processed safely using:

- 25 rows per batch
- Automatic retry mechanism
- Fault-tolerant upload pipeline

### 🛡 Production-Ready Error Handling
Designed to handle real-world data issues including:

- Unix Epoch (Jan 1, 1970) date bug
- Empty cells
- Null values
- Invalid formats
- Missing columns
- Corrupted spreadsheet rows

---

# 🏗 Architecture

```
CSV Upload
      │
      ▼
CSV Parser (PapaParse)
      │
      ▼
Pre Validation
      │
      ▼
AI Header Mapping (Groq Llama-3.3-70B)
      │
      ▼
CRM Schema Conversion
      │
      ▼
Deduplication Engine
      │
      ▼
Clean CRM Records
```

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- Groq Cloud SDK
- PapaParse
- Jest

## Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide React

---

# 📂 Repository Structure

```text
groweasy-csv-importer/
│
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── aiService.ts
│   │   │   └── validationService.ts
│   │   │
│   │   ├── store/
│   │   │   └── leadStore.ts
│   │   │
│   │   ├── types/
│   │   │   └── crmTypes.ts
│   │   │
│   │   └── importController.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── ImportModal.tsx
│   │   │   ├── LeadsTable.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ...
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙ Setup & Installation

## Prerequisites

- Node.js (v18 or higher)
- npm
- Groq API Key

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd groweasy-csv-importer
```

---

## 2. Backend Setup

Navigate into backend.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
PORT=5001
GROQ_API_KEY=your_actual_groq_api_key
```

Run development server.

```bash
npm run dev
```

Backend runs at

```
http://localhost:5001
```

---

## 3. Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start development server.

```bash
npm run dev
```

Frontend runs at

```
http://localhost:3000
```

---

# 🧪 Running Tests

Backend includes unit tests for parsing and validation.

```bash
cd backend
npm run test
```

---

# 📤 API Reference

## POST `/api/import`

Uploads a CSV file and returns standardized CRM records.

### Request

```
Content-Type: multipart/form-data
```

Upload a CSV file using the `file` field.

---

### Sample Response

```json
{
  "records": [
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "mobile_without_country_code": "9876543210",
      "country_code": "+91",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "created_at": "2026-07-19T08:32:00.000Z"
    }
  ],
  "totalImported": 1,
  "totalSkipped": 0,
  "skippedRecords": []
}
```

---

# 🔄 Data Processing Pipeline

```
User Uploads CSV
        │
        ▼
CSV Parsing
        │
        ▼
Data Validation
        │
        ▼
AI Header Detection
        │
        ▼
Schema Mapping
        │
        ▼
Duplicate Detection
        │
        ▼
Date Normalization
        │
        ▼
CRM Ready Output
```

---

# 🎯 Key Highlights

- AI-powered CSV header understanding
- Intelligent CRM schema mapping
- Production-grade validation pipeline
- Duplicate detection
- Batch processing
- Automatic retry mechanism
- Robust date normalization
- Fault-tolerant import pipeline
- Clean and responsive UI
- Unit-tested backend

---

# 🚀 Future Improvements

- PostgreSQL / MySQL integration
- Redis caching
- Background job processing
- WebSocket import progress
- Multi-file import
- Authentication & Role-Based Access Control
- Import history dashboard
- Export cleaned records
- Docker deployment
- Kubernetes support

---

# 👨‍💻 Author

**Kriti Kalita**

Computer Science Engineer | Full Stack Developer | AI & Cloud Enthusiast

---

## ⭐ If you found this project useful, consider giving it a star!
