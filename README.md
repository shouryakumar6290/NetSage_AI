# NetSage AI

NetSage AI is an AI-powered network troubleshooting assistant designed for Cisco Packet Tracer and networking lab problems. It helps junior network engineers identify root causes of network issues by analyzing user-described symptoms, topology notes, and Cisco `show` command outputs.

## Architecture

```
User
 ↓
NetSage AI Dashboard (React + Vite + Tailwind)
 ↓
Input Case
 ↓
Rule Checker + AI Diagnosis (FastAPI)
 ↓
Evidence Analysis
 ↓
Human Review
 ↓
Accept / Edit / Reject
 ↓
Fix
 ↓
Verification
```

## Features

- **AI Diagnosis**: Analyzes command output and symptoms to provide an evidence-backed root cause, confidence score, and fix steps.
- **Rule Checker**: A deterministic Python engine (`checker.py`) that catches common faults (duplicate IPs, downed interfaces, missing VLANs, etc.) before involving AI.
- **Human-in-the-Loop Workflow**: All AI recommendations MUST be reviewed by a human. The system supports accepting, editing, and rejecting AI diagnoses.
- **Responsible AI Log**: Tracks all human corrections to AI diagnoses to improve the model over time.
- **Case Library**: Comes pre-loaded with 30+ realistic networking troubleshooting scenarios.

## Setup Instructions

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend
1. `cd backend`
2. `pip install fastapi uvicorn`
3. `uvicorn main:app --reload`
