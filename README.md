# Qubic Real-Time Token Dashboard

A real-time analytics dashboard for the *QX smart contract* on the Qubic testnet.

It streams events from *EasyConnect → FastAPI backend → React frontend*, and visualises trades, token activity, and wallet behaviour in a clean, modern UI.

---

## 🔍 Overview

*Tech stack*

- *Frontend:* React + TypeScript + Vite, Recharts (charts)
- *Backend:* FastAPI (Python), in-memory storage
- *Integration:* EasyConnect (Qubic testnet events → HTTP webhook)
- *Hosting (recommended setup):*
  - Frontend on *Vercel*
  - Backend on *Replit*

This README explains how to:

1. Run the whole system *locally*
2. Configure *EasyConnect* to send events
3. Run using *cloud hosting* (Replit + Vercel)

---

## ⚡ Quick Start (for judges)

If you’re just reviewing the project and a live demo URL is available:

1. Open the Demo Application URL - https://qubic-real-time-dash-7stuyjq70-aaryan-moitras-projects.vercel.app/ in your browser.
2. The dashboard will:
   - Poll the backend for GET /api/metrics
   - Display live or simulated events on the charts and table

If you’d like to run it yourself or test locally, follow the steps below.

---

## 📁 Project Structure

```text
Qubic_RealTimeDash/
  backend/
    app/
      _init_.py
      main.py       # FastAPI app
      schemas.py    # QubicEvent model
    requirements.txt
  frontend/
    index.html
    vite.config.ts
    package.json
    tsconfig.json
    src/
      main.tsx
      App.tsx
      types.ts
      hooks/useQubicData.ts
      utils/metrics.ts
      components/
        dashboard/
        charts/
