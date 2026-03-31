# 🏦 Apex Merchant Ledger
**A Full-Stack Settlement Dashboard for Modern Merchants.**

[![Live Demo](https://img.shields.io/badge/Demo-Live-blue)](https://merchant-dashboard-umber.vercel.app/)

---

## ⚡ Features
- **Real-Time Ledger:** Transactions sync automatically via Supabase (PostgreSQL).
- **Payment Integration:** Live Paystack Checkout integration for instant funding.
- **Merchant Identity:** Unique Merchant IDs and Business Profile management.
- **Secure Auth:** Enterprise-grade security using Supabase Auth & Row Level Security.

## 🛠️ Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Framer Motion.
- **Database:** Supabase (PostgreSQL).
- **State:** Zustand (with Persistence).
- **Payments:** Paystack API.

## 🧪 Development Note (Test Phase)
This application is currently in **Sandbox/Test Mode**. 
- To test the payment flow, use [Paystack Test Cards](https://paystack.com/docs/payments/test-cards/).
- No real money is processed.
- Account verification (KYC) is simulated for demonstration purposes.

---

## 🚀 Setup
1. Clone repo.
2. `npm install`.
3. Add `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` and Supabase keys to `.env`.
4. `npm run dev`.