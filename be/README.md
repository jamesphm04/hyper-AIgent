# Hyper-AIgent Backend

Backend service for **Hyper-AIgent**, an AI-powered data interaction platform that allows users to upload documents and connect external data sources such as spreadsheets to interact with them using natural language.

This repository contains the **Spring Boot backend API** responsible for authentication, file management, Google Sheets integration, and AI conversation orchestration.

---

## Overview

Hyper-AIgent enables users to:

- Upload **PDF, CSV, and Excel files**
- Connect **Google Sheets**
- Store and manage documents
- Process documents for AI interaction
- Communicate with AI via conversational APIs

The backend integrates with **OpenAI APIs** for AI responses and can optionally process large documents via **AWS Lambda pipelines**.

---

## Setup Database

```
psql -U postgres
CREATE DATABASE hyper_aigent_db;
\c hyper_aigent_db
ALTER TABLE gg_sheets
ALTER COLUMN id SET DEFAULT nextval('gg_sheet_id_seq');
```

## Run the backend

```
export $(grep -v '^#' .env | xargs)
mvn spring-boot:run
```