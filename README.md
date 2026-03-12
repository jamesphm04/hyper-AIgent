# HyperAIgent - Upload, Analyze & Query Your CSV, Excel, PDF & Google Sheets!

> An AI-powered document intelligence platform. Talk to your CSVs, Google Sheets, multi-sheet Excel files, and PDFs — HyperAIgent generates code to analyze your data, plots visualizations, and answers questions with precision. Your data stays on your machine; only metadata is sent to OpenAI.

---
![Hyper-AIgent Demo](docs/hyper_aigent_demo.gif)  
[Watch the demo on YouTube](https://youtu.be/0wEDj3ot_z0)
---
## Features

- **Multi-format support** — CSV, Google Sheets, multi-sheet Excel, PDF
- **AI-generated analysis** — generates and executes code to answer questions about your data
- **Data visualization** — plots charts and graphs for deeper insight
- **Privacy first** — raw data never leaves your machine; only metadata is sent to OpenAI
- **No data limits** — performance scales with your own hardware
- **Lambda integration** — AWS Lambda for text embedding and RAG on large PDFs
- **Interactive interface** — conversational UI for natural back-and-forth analysis
- **Deploy anywhere** — fully Dockerized for any environment

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│              Next.js Frontend (fe)                  │
│                  localhost:3000                      │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (REST)
          ┌──────────▼──────────┐
          │  Spring Boot (be)   │
          │   localhost:8080    │
          │  - Auth (JWT)       │
          │  - File management  │
          │  - Google Sheets    │
          └──────┬──────┬───────┘
                 │      │
    ┌────────────▼─┐  ┌─▼──────────────────┐
    │  PostgreSQL  │  │  FastAPI            │
    │  (local)     │  │  spread-sheet svc   │
    │  port 5432   │  │  localhost:5002     │
    └──────────────┘  │  - SQL generation   │
                      │  - Data analysis    │
                      │  - Plot rendering   │
                      │  - PDF RAG          │
                      └────────┬────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   OpenAI API        │
                    │   AWS Lambda        │
                    │  (text embeddings)  │
                    └─────────────────────┘
```

| Service | Tech | Port |
|---|---|---|
| `fe` | Next.js + NextAuth | 3000 |
| `be` | Spring Boot 3 | 8080 |
| `services/spread-sheet` | FastAPI (Python) | 5002 |
| Database | PostgreSQL | 5432 (local) |

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Make](https://www.gnu.org/software/make/)
- PostgreSQL running locally on port 5432

---

## Docker Setup (Recommended)

### 1. Clone the repo

```bash
git clone https://github.com/jamesphm04/hyper-AIgent.git
cd hyper-AIgent
```

### 2. Configure environment variables

Each service has its own `.env` file. Fill in your values:

### 3. Build and run

```bash
make build   # first time only
make up      # start all services
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Useful Make commands

| Command | Description |
|---|---|
| `make up` | Start all services |
| `make down` | Stop all services |
| `make build` | Rebuild all Docker images |
| `make clean` | Remove all containers and volumes |

---

## Local Setup (Without Docker)

### Prerequisites

- Node.js 20+
- Java 21+
- Maven 3.9+
- Python 3.11+
- PostgreSQL 14+

### 1. Database

Create the database in your local PostgreSQL:

```sql
CREATE DATABASE hyper_aigent_db;
```

### 2. Frontend (`fe`)

```bash
cd fe
npm install
npm run dev
```

Runs on [http://localhost:3000](http://localhost:3000).

### 3. Backend (`be`)

```bash
cd be
export $(grep -v '^#' .env | xargs)
mvn spring-boot:run
```

Runs on [http://localhost:8080](http://localhost:8080).

### 4. Spreadsheet service (`services/spread-sheet`)

```bash
cd services/spread-sheet
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Runs on [http://localhost:5002](http://localhost:5002).

---